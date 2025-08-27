import "dotenv/config";
import { VTTLoader } from "./vttLoader";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

class QdrantBatchProcessor {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      configuration: {
        baseURL: "https://ai-gateway.vercel.sh/v1",
        apiKey: process.env.AI_GATEWAY_API_KEY,
      },
    });

    this.qdrantConfig = {
      url: process.env.QDRANT_URL,
      collectionName: "chaicode-course",
    };

    // Batch sizes
    this.fileBatchSize = 10; // Process 10 files at a time
    this.documentBatchSize = 25; // Send 25 documents to Qdrant at a time
    this.vectorStore = null;
  }

  async processAllVTTFiles(vttDirectory) {
    console.log("🔍 Discovering VTT files...");
    const vttFiles = await VTTLoader.discoverFiles(vttDirectory, true);
    console.log(`Found ${vttFiles.length} VTT files`);

    // Process files in small batches
    const fileBatches = this.createBatches(vttFiles, this.fileBatchSize);
    console.log(`📦 Created ${fileBatches.length} file batches`);

    let totalProcessed = 0;
    let vectorStoreInitialized = false;

    for (let i = 0; i < fileBatches.length; i++) {
      const fileBatch = fileBatches[i];
      console.log(
        `\n🔄 Processing file batch ${i + 1}/${fileBatches.length} (${fileBatch.length} files)`,
      );

      try {
        // Load documents from this file batch
        const batchDocs = await VTTLoader.loadMultiple(fileBatch, {
          combineSegments: true,
          segmentsPerChunk: 4, // Reduced chunk size
          skipErrors: true,
          verbose: false,
        });

        console.log(
          `📄 Loaded ${batchDocs.length} documents from ${fileBatch.length} files`,
        );

        if (batchDocs.length === 0) {
          console.log(`⚠️  No documents in this batch, skipping...`);
          continue;
        }

        // Process documents in smaller batches for Qdrant
        await this.processDocumentBatches(batchDocs, vectorStoreInitialized);
        vectorStoreInitialized = true;

        totalProcessed += batchDocs.length;
        console.log(`✅ Total processed: ${totalProcessed} documents`);

        // Rate limiting
        await this.sleep(2000);
      } catch (error) {
        console.error(
          `❌ Failed to process file batch ${i + 1}:`,
          error.message,
        );
        throw error;
      }
    }

    console.log(`🎉 Successfully processed ${totalProcessed} documents!`);
  }

  async processDocumentBatches(documents, isInitialized) {
    const documentBatches = this.createBatches(
      documents,
      this.documentBatchSize,
    );
    console.log(`  📝 Processing ${documentBatches.length} document batches`);

    for (let j = 0; j < documentBatches.length; j++) {
      const docBatch = documentBatches[j];
      console.log(
        `    📦 Document batch ${j + 1}/${documentBatches.length} (${docBatch.length} docs)`,
      );

      try {
        if (!isInitialized && j === 0) {
          // Initialize vector store with first batch
          this.vectorStore = await QdrantVectorStore.fromDocuments(
            docBatch,
            this.embeddings,
            this.qdrantConfig,
          );
          console.log(
            `    🆕 Initialized Qdrant collection with ${docBatch.length} documents`,
          );
        } else {
          // Add documents to existing collection
          await this.addDocumentsToExistingStore(docBatch);
          console.log(
            `    ➕ Added ${docBatch.length} documents to collection`,
          );
        }

        // Small delay between document batches
        if (j < documentBatches.length - 1) {
          await this.sleep(500);
        }
      } catch (error) {
        console.error(`    ❌ Document batch ${j + 1} failed:`, error.message);

        // If it's still a payload error, try smaller batches
        if (
          error.message.includes("Payload error") ||
          error.message.includes("larger than allowed")
        ) {
          console.log(`    🔄 Retrying with smaller batch size...`);
          await this.retryWithSmallerBatch(docBatch, isInitialized || j > 0);
        } else {
          throw error;
        }
      }
    }
  }

  async retryWithSmallerBatch(documents, isInitialized) {
    const smallerBatches = this.createBatches(documents, 10); // Even smaller: 10 docs

    for (let k = 0; k < smallerBatches.length; k++) {
      const tinyBatch = smallerBatches[k];
      console.log(
        `      🔹 Retry batch ${k + 1}/${smallerBatches.length} (${tinyBatch.length} docs)`,
      );

      if (!isInitialized && k === 0) {
        this.vectorStore = await QdrantVectorStore.fromDocuments(
          tinyBatch,
          this.embeddings,
          this.qdrantConfig,
        );
      } else {
        await this.addDocumentsToExistingStore(tinyBatch);
      }

      await this.sleep(1000);
    }
  }

  async addDocumentsToExistingStore(documents) {
    // Create a temporary vector store instance to add documents
    const tempStore = new QdrantVectorStore(this.embeddings, this.qdrantConfig);
    await tempStore.addDocuments(documents);
  }

  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Run the processor
async function main() {
  try {
    const processor = new QdrantBatchProcessor();
    await processor.processAllVTTFiles("./genai-cohort");
  } catch (error) {
    console.error("💥 Processing failed:", error.message);
    process.exit(1);
  }
}

main();
