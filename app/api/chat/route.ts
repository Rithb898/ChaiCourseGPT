import OpenAI from "openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "@/lib/embeddings";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import {
  HYDE_SYSTEM_PROMPT,
  QUERY_REWRITING_SYSTEM_PROMPT,
  RERANKING_SYSTEM_PROMPT,
  createMainSystemPrompt,
} from "@/constants/prompts";

const openai = new OpenAI({
  baseURL: "https://ai-gateway.vercel.sh/v1",
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

type CourseType = "all" | "nodejs" | "python";

interface DocumentChunk {
  metadata: {
    lessonNumber?: string;
    lessonTopic?: string;
    technology?: string;
    startTime?: string;
    endTime?: string;
    segmentId?: string;
  };
  pageContent: string;
  retrievalScore?: number;
  retrievalSources?: Array<{
    queryType: string;
    query: string;
    weight: number;
  }>;
}

interface ConsolidatedSource {
  id: string;
  technology: string;
  lessonNumber: string;
  lessonTopic: string;
  startTime: string;
  endTime: string;
  relevanceScore: number;
}

// --- Simple Query Detection ---
function isSimpleQuery(query: string): boolean {
  const words = query.trim().split(/\s+/);
  const questionMarks = (query.match(/\?/g) || []).length;

  // Simple patterns
  const simplePatterns = [
    /^what is /i,
    /^how to /i,
    /^explain /i,
    /^define /i,
    /^show me /i,
    /^tell me /i,
  ];

  const isSimplePattern = simplePatterns.some((pattern) => pattern.test(query));
  const isShort = words.length <= 8;
  const isSingleQuestion = questionMarks <= 1;

  const isSimple = (isShort && isSingleQuestion) || isSimplePattern;

  console.log(
    `🔍 Query analysis: "${query}" - Simple: ${isSimple} (${words.length} words, ${questionMarks} questions)`,
  );

  return isSimple;
}

function consolidateSources(chunks: DocumentChunk[]): ConsolidatedSource[] {
  const lessonMap = new Map();

  chunks.forEach((doc) => {
    const lessonNum = doc.metadata.lessonNumber || "?";
    const lessonTopic = doc.metadata.lessonTopic || "Unknown Topic";
    const technology = doc.metadata.technology || "Unknown";
    const key = `${lessonNum}-${lessonTopic}`;

    if (!lessonMap.has(key)) {
      lessonMap.set(key, {
        lessonNumber: lessonNum,
        lessonTopic: lessonTopic,
        technology: technology,
        chunks: [],
        startTimes: new Set(),
        endTimes: new Set(),
      });
    }

    const lesson = lessonMap.get(key);
    lesson.chunks.push(doc);
    lesson.startTimes.add(doc.metadata.startTime || "00:00:00");
    lesson.endTimes.add(doc.metadata.endTime || "00:00:00");
  });

  return Array.from(lessonMap.values())
    .filter((lesson) => lesson.chunks.length >= 1)
    .sort((a, b) => b.chunks.length - a.chunks.length)
    .slice(0, 3)
    .map((lesson) => {
      const startTimes = Array.from(lesson.startTimes).sort();
      const endTimes = Array.from(lesson.endTimes).sort();

      return {
        id: `source-${lesson.lessonNumber}`,
        technology: lesson.technology,
        lessonNumber: lesson.lessonNumber,
        lessonTopic: lesson.lessonTopic,
        startTime: String(startTimes[0] || "00:00:00"),
        endTime: String(endTimes[endTimes.length - 1] || "00:00:00"),
        relevanceScore: lesson.chunks.length,
      };
    });
}

// --- Parallel HyDE Generation ---
async function generateHypotheticalDocument(
  userQuery: string,
): Promise<string> {
  const { text } = await generateText({
    model: groq("moonshotai/kimi-k2-instruct"),
    system: HYDE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Student Question: ${userQuery}

Generate a detailed course transcript segment that would answer this question:`,
      },
    ],
  });

  return text;
}

// --- Parallel Query Rewriting ---
async function rewriteQuery(userInput: string) {
  const { text } = await generateText({
    model: "openai/gpt-5-nano",
    system: QUERY_REWRITING_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userInput }],
  });

  let queryRewrite;
  try {
    queryRewrite = JSON.parse(text);
  } catch {
    queryRewrite = { mainQuery: userInput, subQueries: [] };
  }

  return queryRewrite;
}

// --- Parallel Query Processing ---
async function processQueriesInParallel(userInput: string, isSimple: boolean) {
  console.log(`⚡ Starting parallel processing - Simple query: ${isSimple}`);

  if (isSimple) {
    // For simple queries: Only run HyDE (faster)
    console.log(`🚀 Simple query - Running HyDE only`);
    const hydeDocument = await generateHypotheticalDocument(userInput);

    return {
      mainQuery: userInput,
      subQueries: [],
      hypotheticalDocument: hydeDocument,
    };
  } else {
    // For complex queries: Run HyDE and query rewriting in parallel
    console.log(
      `🚀 Complex query - Running HyDE + Query rewriting in parallel`,
    );
    const [hydeDocument, queryRewrite] = await Promise.all([
      generateHypotheticalDocument(userInput),
      rewriteQuery(userInput),
    ]);

    return {
      ...queryRewrite,
      hypotheticalDocument: hydeDocument,
    };
  }
}

// --- Strong Course Filtering Function ---
function filterDocumentsByCourse(
  docs: DocumentChunk[],
  courseFilter: CourseType,
): DocumentChunk[] {
  if (courseFilter === "all") return docs;

  return docs.filter((doc) => {
    const docTech = doc.metadata.technology?.toLowerCase();
    const filterTech = courseFilter.toLowerCase();
    return docTech === filterTech;
  });
}

// --- Optimized Parallel Retrieval ---
async function optimizedRetrievalWithParallelSearch(
  userInput: string,
  vectorStore: QdrantVectorStore,
  courseFilter: CourseType = "all",
) {
  const startTime = Date.now();
  console.log(
    `🎯 Starting optimized retrieval with course filter: ${courseFilter}`,
  );

  const isSimple = isSimpleQuery(userInput);

  // Step 1: Process queries in parallel
  const { mainQuery, hypotheticalDocument } = await processQueriesInParallel(
    userInput,
    isSimple,
  );

  console.log(`⏱️ Query processing took: ${Date.now() - startTime}ms`);

  // Step 2: Determine which queries to run (reduced count)
  let queriesToRun: string[];

  if (isSimple) {
    // Simple queries: Original + HyDE only (2 searches)
    queriesToRun = [userInput, hypotheticalDocument];
    console.log(`📊 Simple query - Running 2 searches`);
  } else {
    // Complex queries: Original + Main rewrite + HyDE (3 searches, skip sub-queries)
    queriesToRun = [userInput, mainQuery, hypotheticalDocument];
    console.log(`📊 Complex query - Running 3 searches`);
  }

  // Step 3: Run all vector searches in parallel
  const searchStartTime = Date.now();
  const searchPromises = queriesToRun.map(async (query, index) => {
    try {
      const docs = await vectorStore.similaritySearch(query, 15); // Slightly reduced from 20
      const filteredDocs = filterDocumentsByCourse(docs, courseFilter);

      return {
        query,
        docs: filteredDocs,
        queryType: index === queriesToRun.length - 1 ? "HyDE" : "Traditional",
        index,
      };
    } catch (error) {
      console.error(`Error in search ${index}:`, error);
      return { query, docs: [], queryType: "Traditional", index };
    }
  });

  const searchResults = await Promise.all(searchPromises);
  console.log(`⏱️ Parallel searches took: ${Date.now() - searchStartTime}ms`);

  // Step 4: Combine and score results
  const allDocs: DocumentChunk[] = [];
  const docScores = new Map();

  searchResults.forEach(({ docs, queryType, index }) => {
    docs.forEach((doc: DocumentChunk) => {
      const docId = doc.metadata.segmentId;
      if (!docScores.has(docId)) {
        docScores.set(docId, {
          doc,
          sources: [],
          totalScore: 0,
        });
      }

      // Weight different retrieval methods
      let weight = 1;
      if (index === 0) weight = 1.2; // Original query gets slight boost
      if (queryType === "HyDE") weight = 1.5; // HyDE gets higher weight

      docScores.get(docId).sources.push({
        queryType,
        query: searchResults[index].query.substring(0, 100) + "...",
        weight,
      });
      docScores.get(docId).totalScore += weight;
    });

    allDocs.push(...docs);
  });

  // Step 5: Deduplicate and sort
  const uniqueDocs = Array.from(docScores.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((item) => ({
      ...item.doc,
      retrievalScore: item.totalScore,
      retrievalSources: item.sources,
    }));

  console.log(`✅ Total retrieval took: ${Date.now() - startTime}ms`);
  console.log(`📚 Retrieved ${uniqueDocs.length} unique docs after filtering`);

  return {
    queries: queriesToRun.slice(0, -1), // Don't include HyDE doc in query list
    docs: uniqueDocs,
    hydeDocument: hypotheticalDocument,
    isSimpleQuery: isSimple,
  };
}

// --- Conditional Re-ranking (Skip for Simple Queries) ---
async function conditionalReranking(
  userInput: string,
  docs: DocumentChunk[],
  hydeDocument: string,
  isSimple: boolean,
) {
  if (docs.length === 0) return [];

  // Skip re-ranking for simple queries - use retrieval scores directly
  if (isSimple) {
    console.log(
      `⚡ Skipping re-ranking for simple query - using retrieval scores`,
    );
    return docs
      .sort((a, b) => (b.retrievalScore || 0) - (a.retrievalScore || 0))
      .slice(0, 8); // Take top 8
  }

  // Full re-ranking for complex queries
  console.log(`🔄 Running full re-ranking for complex query`);
  const rerankStartTime = Date.now();

  const { text } = await generateText({
    model: "openai/gpt-5-nano",
    system: RERANKING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `User Query: ${userInput}

Hypothetical Ideal Answer:
${hydeDocument}

Course Transcript Chunks:
${docs.map((d, i) => `(${i}) ${d.pageContent}`).join("\n\n")}

Select the most relevant chunk indexes:`,
      },
    ],
  });

  let indexes: number[] = [];
  try {
    indexes = JSON.parse(text);
  } catch {
    // Fallback: use retrieval scores
    indexes = docs
      .map((doc, i) => ({ index: i, score: doc.retrievalScore || 1 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.index);
  }

  console.log(`⏱️ Re-ranking took: ${Date.now() - rerankStartTime}ms`);
  return indexes.map((i) => docs[i]).filter(Boolean);
}

export async function POST(req: Request) {
  const totalStartTime = Date.now();

  try {
    const { messages, courseFilter = "all" } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    console.log(`🎯 Course Filter: ${courseFilter}`);
    console.log(`📝 User Query: ${lastMessage}`);

    // Initialize vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "chaicode-course",
      },
    );

    // Optimized retrieval with parallel processing
    const {
      queries,
      docs: retrievedDocs,
      hydeDocument,
      isSimpleQuery,
    } = await optimizedRetrievalWithParallelSearch(
      lastMessage,
      vectorStore,
      courseFilter,
    );

    console.log(`📚 Retrieved ${retrievedDocs.length} docs after filtering`);

    // Conditional re-ranking (skip for simple queries)
    const relevantChunks = await conditionalReranking(
      lastMessage,
      retrievedDocs,
      hydeDocument,
      isSimpleQuery,
    );

    console.log(`🎯 Final relevant chunks: ${relevantChunks.length}`);

    // Final safety check
    const safeChunks =
      courseFilter === "all"
        ? relevantChunks
        : relevantChunks.filter(
            (chunk) =>
              chunk.metadata.technology?.toLowerCase() ===
              courseFilter.toLowerCase(),
          );

    console.log(`✅ Safe chunks after final filter: ${safeChunks.length}`);
    console.log(`⏱️ Total processing time: ${Date.now() - totalStartTime}ms`);

    if (safeChunks.length === 0) {
      const courseSpecificMessage =
        courseFilter === "all"
          ? "Yaar, ye specific topic maine course mein cover nahi kiya hai."
          : `Yaar, ye specific topic maine ${courseFilter} course mein cover nahi kiya hai. Maybe try the other course or switch to "All Courses"?`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text", data: courseSpecificMessage })}\n\n`,
            ),
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "sources", data: [] })}\n\n`,
            ),
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`),
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Consolidate sources
    const consolidatedSources = consolidateSources(safeChunks);
    console.log(`📋 Consolidated sources: ${consolidatedSources.length}`);

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Prepare context
          const context = safeChunks
            .map((doc, i) => {
              const lessonNum = doc.metadata.lessonNumber || "?";
              const lessonTopic = doc.metadata.lessonTopic || "Unknown Topic";
              const start = doc.metadata.startTime || "??:??:??";
              const end = doc.metadata.endTime || "??:??:??";
              const tech = doc.metadata.technology || "Unknown";

              return `(${i + 1}) ${tech.toUpperCase()} - Lesson ${lessonNum} - ${lessonTopic} [${start} → ${end}]
${doc.pageContent}`;
            })
            .join("\n\n");

          const systemPrompt = createMainSystemPrompt(
            lastMessage,
            queries,
            context,
            courseFilter,
          );

          // Stream OpenAI response
          const completion = await openai.chat.completions.create({
            model: "anthropic/claude-3.5-haiku",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
            temperature: 0.1,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text", data: content })}\n\n`,
                ),
              );
            }
          }

          // Send sources
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "sources", data: consolidatedSources })}\n\n`,
            ),
          );

          // Send completion
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`),
          );
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", data: "Stream error occurred" })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
