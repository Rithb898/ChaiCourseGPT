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

interface ConsolidatedSource {
  id: string;
  technology: string;
  lessonNumber: string;
  lessonTopic: string;
  startTime: string;
  endTime: string;
  relevanceScore: number;
}

function consolidateSources(chunks: any[]): ConsolidatedSource[] {
  const lessonMap = new Map();

  // Group chunks by lesson
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

  // Convert to sources array, sorted by relevance
  return Array.from(lessonMap.values())
    .filter((lesson) => lesson.chunks.length >= 1) // Show lessons with 1+ relevant chunks
    .sort((a, b) => b.chunks.length - a.chunks.length) // Most relevant first
    .slice(0, 3) // Show only top 3 most relevant lessons
    .map((lesson) => {
      const startTimes = Array.from(lesson.startTimes).sort();
      const endTimes = Array.from(lesson.endTimes).sort();

      return {
        id: `source-${lesson.lessonNumber}`,
        technology: lesson.technology,
        lessonNumber: lesson.lessonNumber,
        lessonTopic: lesson.lessonTopic,
        startTime: String(startTimes[0] || "00:00:00"), // Earliest start time
        endTime: String(endTimes[endTimes.length - 1] || "00:00:00"), // Latest end time
        relevanceScore: lesson.chunks.length,
      };
    });
}

// --- HyDE: Generate Hypothetical Document ---
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

// --- Query Rewriting with HyDE ---
async function rewriteQueryWithHyDE(userInput: string) {
  // Generate hypothetical document
  const hypotheticalDoc = await generateHypotheticalDocument(userInput);

  // Also generate traditional query rewrites
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    system: QUERY_REWRITING_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userInput }],
  });

  let queryRewrite;
  try {
    queryRewrite = JSON.parse(text);
  } catch {
    queryRewrite = { mainQuery: userInput, subQueries: [] };
  }

  return {
    ...queryRewrite,
    hypotheticalDocument: hypotheticalDoc,
  };
}

// --- HyDE-Enhanced Retrieval ---
async function retrieveWithHyDE(userInput: string, retriever: any) {
  const { mainQuery, subQueries, hypotheticalDocument } =
    await rewriteQueryWithHyDE(userInput);

  // Combine all queries including the hypothetical document
  let queries = [
    userInput, // Original query
    mainQuery, // Rewritten main query
    ...subQueries, // Sub-queries
    hypotheticalDocument, // HyDE document
  ];

  let allDocs: any[] = [];
  const docScores = new Map(); // Track which retrieval method found each doc

  // Retrieve with each query and track sources
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const docs = await retriever.invoke(query);

    docs.forEach((doc: any) => {
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
      if (i === 0) weight = 1.2; // Original query gets slight boost
      if (i === queries.length - 1) weight = 1.5; // HyDE gets higher weight

      docScores.get(docId).sources.push({
        queryType: i === queries.length - 1 ? "HyDE" : "Traditional",
        query: query.substring(0, 100) + "...",
        weight,
      });
      docScores.get(docId).totalScore += weight;
    });

    allDocs.push(...docs);
  }

  // Deduplicate and sort by combined score
  const uniqueDocs = Array.from(docScores.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((item) => ({
      ...item.doc,
      retrievalScore: item.totalScore,
      retrievalSources: item.sources,
    }));

  return {
    queries: queries.slice(0, -1), // Don't include HyDE doc in query list for display
    docs: uniqueDocs,
    hydeDocument: hypotheticalDocument,
  };
}

// --- Enhanced Re-ranking with HyDE Context ---
async function rerankDocsWithHyDE(
  userInput: string,
  docs: any[],
  hydeDocument: string,
) {
  if (docs.length === 0) return [];

  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
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
    // Fallback: use retrieval scores if available
    indexes = docs
      .map((doc, i) => ({ index: i, score: doc.retrievalScore || 1 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.index);
  }

  return indexes.map((i) => docs[i]).filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Your existing RAG logic with HyDE
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "chaicode-course",
      },
    );

    const retriever = vectorStore.asRetriever({ k: 12 }); // Increased k for HyDE
    const {
      queries,
      docs: retrievedDocs,
      hydeDocument,
    } = await retrieveWithHyDE(lastMessage, retriever);
    const relevantChunks = await rerankDocsWithHyDE(
      lastMessage,
      retrievedDocs,
      hydeDocument,
    );

    if (relevantChunks.length === 0) {
      return Response.json({
        message: "I don't have information about this in the course content.",
        sources: [],
      });
    }

    // ✅ Consolidate sources
    const consolidatedSources = consolidateSources(relevantChunks);

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 1. Prepare context for OpenAI
          const context = relevantChunks
            .map((doc, i) => {
              const lessonNum = doc.metadata.lessonNumber || "?";
              const lessonTopic = doc.metadata.lessonTopic || "Unknown Topic";
              const start = doc.metadata.startTime || "??:??:??";
              const end = doc.metadata.endTime || "??:??:??";

              return `(${i + 1}) Lesson ${lessonNum} - ${lessonTopic} [${start} → ${end}]
${doc.pageContent}`;
            })
            .join("\n\n");

          // Enhanced system prompt with Hitesh Choudhary persona
          const systemPrompt = createMainSystemPrompt(lastMessage, queries, context);

          // 3. Stream OpenAI response
          const completion = await openai.chat.completions.create({
            model: "openai/gpt-4.1-mini",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
            temperature: 0.1, // Lower temperature for more consistent responses
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

          // 4. Send sources after message completion
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "sources", data: consolidatedSources })}\n\n`,
            ),
          );

          // 5. Send completion signal
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
