import OpenAI from "openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "@/lib/embeddings";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import {
  HYDE_SYSTEM_PROMPT,
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

// Simplified query detection - removed complex analysis
function isSimpleQuery(query: string): boolean {
  const words = query.trim().split(/\s+/);
  return words.length <= 6 || /^(what is|how to|explain|define|show me|tell me)/i.test(query);
}

// Optimized source consolidation
interface LessonData {
  lessonNumber: string;
  lessonTopic: string;
  technology: string;
  count: number;
  startTime: string;
  endTime: string;
}

function consolidateSources(chunks: DocumentChunk[]): ConsolidatedSource[] {
  const lessonMap = new Map<string, LessonData>();

  chunks.forEach((doc) => {
    const key = `${doc.metadata.lessonNumber}-${doc.metadata.lessonTopic}`;
    
    if (!lessonMap.has(key)) {
      lessonMap.set(key, {
        lessonNumber: doc.metadata.lessonNumber || "?",
        lessonTopic: doc.metadata.lessonTopic || "Unknown Topic",
        technology: doc.metadata.technology || "Unknown",
        count: 0,
        startTime: doc.metadata.startTime || "00:00:00",
        endTime: doc.metadata.endTime || "00:00:00",
      });
    }
    const lesson = lessonMap.get(key)!;
    lesson.count++;
  });

  return Array.from(lessonMap.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 3)
    .map(([, lesson]) => ({
      id: `source-${lesson.lessonNumber}`,
      technology: lesson.technology,
      lessonNumber: lesson.lessonNumber,
      lessonTopic: lesson.lessonTopic,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      relevanceScore: lesson.count,
    }));
}

// Simplified HyDE generation
async function generateHypotheticalDocument(userQuery: string): Promise<string> {
  const { text } = await generateText({
    model: groq("moonshotai/kimi-k2-instruct"),
    system: HYDE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Student Question: ${userQuery}` }],
  });
  return text;
}

// Removed query rewriting - not providing enough value for the complexity
// Simple approach: just use original query + HyDE

// Simplified retrieval with course filtering built-in
async function optimizedRetrieval(
  userInput: string,
  vectorStore: QdrantVectorStore,
  courseFilter: CourseType = "all",
) {
  const startTime = Date.now();
  const isSimple = isSimpleQuery(userInput);

  // Always run original query + HyDE in parallel
  const [originalDocs, hydeDocument] = await Promise.all([
    vectorStore.similaritySearch(userInput, 12),
    generateHypotheticalDocument(userInput),
  ]);

  const hydeDocs = await vectorStore.similaritySearch(hydeDocument, 8);

  console.log(`⏱️ Retrieval took: ${Date.now() - startTime}ms`);

  // Filter by course early
  const filterDocs = (docs: DocumentChunk[]) => 
    courseFilter === "all" 
      ? docs 
      : docs.filter(doc => doc.metadata.technology?.toLowerCase() === courseFilter.toLowerCase());

  const filteredOriginal = filterDocs(originalDocs);
  const filteredHyde = filterDocs(hydeDocs);

  // Simple scoring and deduplication
  const docMap = new Map<string, DocumentChunk>();
  
  filteredOriginal.forEach(doc => {
    const id = doc.metadata.segmentId || doc.pageContent.slice(0, 50);
    docMap.set(id, { ...doc, retrievalScore: 1.2 }); // Original query boost
  });

  filteredHyde.forEach(doc => {
    const id = doc.metadata.segmentId || doc.pageContent.slice(0, 50);
    const existing = docMap.get(id);
    if (existing) {
      existing.retrievalScore = (existing.retrievalScore || 0) + 1.5;
    } else {
      docMap.set(id, { ...doc, retrievalScore: 1.5 }); // HyDE boost
    }
  });

  const allDocs = Array.from(docMap.values())
    .sort((a, b) => (b.retrievalScore || 0) - (a.retrievalScore || 0));

  return {
    docs: allDocs,
    hydeDocument,
    isSimpleQuery: isSimple,
  };
}

// Simplified reranking - only for complex queries with many results
async function conditionalReranking(
  userInput: string,
  docs: DocumentChunk[],
  hydeDocument: string,
  isSimple: boolean,
) {
  if (docs.length === 0 || isSimple || docs.length <= 8) {
    return docs.slice(0, 8);
  }

  // Only rerank if we have too many docs (>8) and it's complex
  const { text } = await generateText({
    model: "openai/gpt-5-nano",
    system: RERANKING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `User Query: ${userInput}

Course Chunks:
${docs.slice(0, 12).map((d, i) => `(${i}) ${d.pageContent.slice(0, 200)}...`).join("\n\n")}

Select 6-8 most relevant indexes:`,
      },
    ],
  });

  try {
    const indexes: number[] = JSON.parse(text);
    return indexes.map(i => docs[i]).filter(Boolean);
  } catch {
    return docs.slice(0, 8);
  }
}

export async function POST(req: Request) {
  try {
    const { messages, courseFilter = "all" } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Initialize vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "chaicode-course",
    });

    // Simplified retrieval
    const { docs: retrievedDocs, hydeDocument, isSimpleQuery } = 
      await optimizedRetrieval(lastMessage, vectorStore, courseFilter);

    // Conditional re-ranking
    const relevantChunks = await conditionalReranking(
      lastMessage,
      retrievedDocs,
      hydeDocument,
      isSimpleQuery,
    );

    if (relevantChunks.length === 0) {
      const message = courseFilter === "all"
        ? "Yaar, ye specific topic maine course mein cover nahi kiya hai."
        : `Yaar, ye specific topic maine ${courseFilter} course mein cover nahi kiya hai.`;

      return new Response(
        new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", data: message })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "sources", data: [] })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    const consolidatedSources = consolidateSources(relevantChunks);

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const context = relevantChunks
            .map((doc, i) => `(${i + 1}) ${doc.metadata.technology?.toUpperCase() || "UNKNOWN"} - Lesson ${doc.metadata.lessonNumber} - ${doc.metadata.lessonTopic}
${doc.pageContent}`)
            .join("\n\n");

          const systemPrompt = createMainSystemPrompt(lastMessage, [lastMessage], context, courseFilter);
          const completion = await openai.chat.completions.create({
            model: "anthropic/claude-3.5-haiku",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
            temperature: 0.1,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", data: content })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "sources", data: consolidatedSources })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", data: "Stream error occurred" })}\n\n`));
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