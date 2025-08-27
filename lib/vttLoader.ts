import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";
import { Document } from "@langchain/core/documents";
import fs from "fs/promises";
import path from "path";

interface VTTLoaderOptions {
  combineSegments?: boolean;
  segmentsPerChunk?: number;
  removeHtmlTags?: boolean;
  removePositionCues?: boolean;
  includeEmptySegments?: boolean;
  customMetadata?: Record<string, unknown>;
  skipMalformedSegments?: boolean;
  maxSegments?: number;
  verbose?: boolean;
}

interface VTTSegment {
  id: string;
  startTime: string;
  endTime: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
  originalText: string;
  cueSettings?: string;
  duration: number;
  segmentCount?: number;
  segmentIds?: string[];
  originalSegments?: VTTSegment[];
}

interface PathMetadata {
  fileName: string;
  fileNameWithoutExt: string;
  technology: string;
  pathAfterCourse: string;
  courseMarker?: string;
  coursePath?: string;
  relativePath?: string;
  lessonNumber?: string;
  lessonTopic?: string;
}

/**
 * Custom VTT (WebVTT) Document Loader for LangChain JS
 * Parses VTT subtitle files and creates documents with timestamp metadata
 *
 * @example
 * const loader = new VTTLoader('./path/to/file.vtt', {
 *   combineSegments: true,
 *   segmentsPerChunk: 5,
 *   removeHtmlTags: true
 * });
 * const documents = await loader.load();
 */
export class VTTLoader extends BaseDocumentLoader {
  // Constants for configuration
  static readonly DEFAULT_SEGMENTS_PER_CHUNK = 3;
  static readonly LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB
  static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  static readonly SUPPORTED_EXTENSIONS = [".vtt", ".webvtt"];

  private filePath: string;
  private options: Required<VTTLoaderOptions>;

  constructor(filePath: string, options: VTTLoaderOptions = {}) {
    super();

    // Input validation
    this.validateFilePath(filePath);
    this.filePath = filePath;

    this.options = {
      // Combine multiple subtitle segments into larger chunks
      combineSegments: options.combineSegments || false,
      // Number of segments to combine (if combineSegments is true)
      segmentsPerChunk:
        options.segmentsPerChunk || VTTLoader.DEFAULT_SEGMENTS_PER_CHUNK,
      // Remove HTML tags from subtitle text
      removeHtmlTags: options.removeHtmlTags !== false,
      // Remove positioning cues (like <c.colorE5E5E5>)
      removePositionCues: options.removePositionCues !== false,
      // Include empty segments (subtitles with no text)
      includeEmptySegments: options.includeEmptySegments || false,
      // Custom metadata to add to all documents
      customMetadata: options.customMetadata || {},
      // Skip malformed segments instead of throwing errors
      skipMalformedSegments: options.skipMalformedSegments !== false,
      // Maximum number of segments to process (0 = unlimited)
      maxSegments: options.maxSegments || 0,
      // Enable verbose logging
      verbose: options.verbose || false,
    };

    this.validateOptions();
  }

  /**
   * Validate file path input
   * @param filePath - Path to VTT file
   * @throws {Error} If file path is invalid
   */
  private validateFilePath(filePath: string): void {
    if (!filePath || typeof filePath !== "string") {
      throw new Error("filePath must be a non-empty string");
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!VTTLoader.SUPPORTED_EXTENSIONS.includes(extension)) {
      throw new Error(
        `Unsupported file extension: ${extension}. Supported: ${VTTLoader.SUPPORTED_EXTENSIONS.join(", ")}`,
      );
    }
  }

  /**
   * Validate configuration options
   * @throws {Error} If options are invalid
   */
  private validateOptions(): void {
    if (this.options.segmentsPerChunk < 1) {
      throw new Error("segmentsPerChunk must be at least 1");
    }

    if (this.options.maxSegments < 0) {
      throw new Error("maxSegments must be non-negative (0 = unlimited)");
    }

    if (typeof this.options.customMetadata !== "object") {
      throw new Error("customMetadata must be an object");
    }
  }

  /**
   * Log message if verbose mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[VTTLoader] ${message}`);
    }
  }

  /**
   * Parse timestamp string to seconds with enhanced validation
   * @param timestamp - Format: "00:01:23.456" or "00:01:23,456"
   * @returns Timestamp in seconds
   * @throws {Error} If timestamp format is invalid
   */
  private parseTimestamp(timestamp: string): number {
    if (!timestamp || typeof timestamp !== "string") {
      throw new Error(`Invalid timestamp: ${timestamp}`);
    }

    // More robust timestamp regex that handles optional milliseconds
    const timestampRegex = /^(\d{1,2}):(\d{2}):(\d{2})(?:[.,](\d{1,3}))?$/;
    const match = timestamp.replace(",", ".").match(timestampRegex);

    if (!match) {
      throw new Error(
        `Invalid timestamp format: ${timestamp}. Expected format: HH:MM:SS.mmm or HH:MM:SS,mmm`,
      );
    }

    const [, hours, minutes, seconds, milliseconds = "0"] = match;

    // Validate ranges
    if (parseInt(minutes) >= 60 || parseInt(seconds) >= 60) {
      throw new Error(`Invalid timestamp values: ${timestamp}`);
    }

    // Pad milliseconds to 3 digits
    const ms = milliseconds.padEnd(3, "0").substring(0, 3);

    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(ms) / 1000
    );
  }

  /**
   * Format seconds back to timestamp string with proper padding
   * @param seconds - Seconds to format
   * @returns Formatted timestamp (HH:MM:SS.mmm)
   */
  private formatTimestamp(seconds: number): string {
    if (typeof seconds !== "number" || seconds < 0) {
      throw new Error(`Invalid seconds value: ${seconds}`);
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const wholeSeconds = Math.floor(remainingSeconds);
    const milliseconds = Math.round((remainingSeconds - wholeSeconds) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${wholeSeconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  }

  /**
   * Clean subtitle text by removing HTML tags and positioning cues
   * @param text - Raw subtitle text
   * @returns Cleaned text
   */
  private cleanText(text: string): string {
    if (!text || typeof text !== "string") {
      return "";
    }

    let cleaned = text;

    if (this.options.removeHtmlTags) {
      // More comprehensive HTML tag removal
      cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, "");
    }

    if (this.options.removePositionCues) {
      // Remove WebVTT positioning and styling cues
      cleaned = cleaned
        // Remove voice/class cues like <v Speaker> or <c.className>
        .replace(/<[vc](?:\.[^>]*)?>.*?<\/[vc]>/gi, "")
        .replace(/<[vc][^>]*>/gi, "")
        // Remove timestamp cues like <00:01:23.456>
        .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, "")
        // Remove other WebVTT cues
        .replace(/<[^>]*>/g, "");
    }

    // Handle multiple whitespace types and normalize
    cleaned = cleaned
      .replace(/[\s\n\r\t]+/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();

    return cleaned;
  }

  /**
   * Parse VTT file content into subtitle segments with enhanced error handling
   * @param content - Raw VTT file content
   * @returns Array of subtitle segments
   */
  private parseVTT(content: string): VTTSegment[] {
    if (!content || typeof content !== "string") {
      throw new Error("VTT content must be a non-empty string");
    }

    const subtitleSegments: VTTSegment[] = [];
    let skippedSegments = 0;

    // Remove BOM if present and normalize line endings
    const cleanContent = content
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    // Split by double newlines to get blocks
    const vttBlocks = cleanContent.split(/\n\s*\n/);

    for (let blockIndex = 0; blockIndex < vttBlocks.length; blockIndex++) {
      const block = vttBlocks[blockIndex].trim();

      // Skip WEBVTT header, NOTE blocks, and empty blocks
      if (block.startsWith("WEBVTT") || block.startsWith("NOTE") || !block) {
        continue;
      }

      try {
        const segment = this.parseVTTBlock(block, blockIndex);
        if (segment) {
          subtitleSegments.push(segment);

          // Check maxSegments limit
          if (
            this.options.maxSegments > 0 &&
            subtitleSegments.length >= this.options.maxSegments
          ) {
            this.log(
              `Reached maximum segments limit: ${this.options.maxSegments}`,
            );
            break;
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (this.options.skipMalformedSegments) {
          skippedSegments++;
          this.log(`Skipped malformed segment ${blockIndex}: ${errorMessage}`);
          continue;
        } else {
          throw new Error(
            `Error parsing VTT block ${blockIndex}: ${errorMessage}`,
          );
        }
      }
    }

    this.log(
      `Parsed ${subtitleSegments.length} segments, skipped ${skippedSegments} malformed segments`,
    );
    return subtitleSegments;
  }

  /**
   * Parse individual VTT block into segment
   * @param block - VTT block content
   * @param blockIndex - Block index for error reporting
   * @returns Parsed segment or null if invalid
   */
  private parseVTTBlock(block: string, blockIndex: number): VTTSegment | null {
    const lines = block.split("\n");
    let timelineIndex = -1;
    let cueId = "";

    // Find the timeline (contains -->)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(" --> ")) {
        timelineIndex = i;
        if (i > 0) {
          cueId = lines[0].trim(); // First line is cue ID
        }
        break;
      }
    }

    if (timelineIndex === -1) {
      throw new Error(`No timeline found in block`);
    }

    const timelineParts = lines[timelineIndex].trim();

    // Enhanced timestamp regex that handles WebVTT settings
    const timeMatch = timelineParts.match(
      /^(\d{1,2}:\d{2}:\d{2}(?:[.,]\d{1,3})?)\s*-->\s*(\d{1,2}:\d{2}:\d{2}(?:[.,]\d{1,3})?)(?:\s+(.*))?$/,
    );

    if (!timeMatch) {
      throw new Error(`Invalid timeline format: ${timelineParts}`);
    }

    const [, startTime, endTime, cueSettings = ""] = timeMatch;
    const textLines = lines.slice(timelineIndex + 1);
    const rawText = textLines.join("\n").trim();
    const cleanedText = this.cleanText(rawText);

    // Skip empty segments unless specified otherwise
    if (!cleanedText && !this.options.includeEmptySegments) {
      return null;
    }

    try {
      const startSeconds = this.parseTimestamp(startTime);
      const endSeconds = this.parseTimestamp(endTime);

      // Validate timeline logic
      if (endSeconds <= startSeconds) {
        throw new Error(
          `End time must be after start time: ${startTime} --> ${endTime}`,
        );
      }

      return {
        id: cueId || `segment_${blockIndex + 1}`,
        startTime,
        endTime,
        startSeconds,
        endSeconds,
        text: cleanedText,
        originalText: rawText,
        cueSettings: cueSettings.trim(),
        duration: endSeconds - startSeconds,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Timestamp parsing failed: ${errorMessage}`);
    }
  }

  /**
   * Combine multiple segments into larger chunks
   * @param segments - Array of subtitle segments
   * @returns Array of combined segments
   */
  private combineSegments(segments: VTTSegment[]): VTTSegment[] {
    if (!this.options.combineSegments || segments.length === 0) {
      return segments;
    }

    const combinedSegments: VTTSegment[] = [];
    const chunkSize = this.options.segmentsPerChunk;

    for (let i = 0; i < segments.length; i += chunkSize) {
      const segmentChunk = segments.slice(i, i + chunkSize);
      const firstSegment = segmentChunk[0];
      const lastSegment = segmentChunk[segmentChunk.length - 1];

      // Combine text with proper spacing
      const combinedText = segmentChunk
        .map((segment) => segment.text)
        .filter((text) => text.trim())
        .join(" ")
        .trim();

      if (!combinedText && !this.options.includeEmptySegments) {
        continue;
      }

      combinedSegments.push({
        id: `combined_${Math.floor(i / chunkSize) + 1}`,
        startTime: firstSegment.startTime,
        endTime: lastSegment.endTime,
        startSeconds: firstSegment.startSeconds,
        endSeconds: lastSegment.endSeconds,
        text: combinedText,
        originalText: segmentChunk.map((s) => s.originalText).join("\n"),
        duration: lastSegment.endSeconds - firstSegment.startSeconds,
        segmentCount: segmentChunk.length,
        segmentIds: segmentChunk.map((s) => s.id),
        originalSegments: segmentChunk,
      });
    }

    this.log(
      `Combined ${segments.length} segments into ${combinedSegments.length} chunks`,
    );
    return combinedSegments;
  }

  /**
   * Extract metadata from file path with enhanced parsing
   * @param filePath - Full file path
   * @returns Extracted metadata
   */
  private extractPathMetadata(filePath: string): PathMetadata {
    const normalizedPath = path.normalize(filePath);
    const pathParts = normalizedPath
      .split(path.sep)
      .filter((part) => part && part !== ".");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = path.basename(fileName, path.extname(fileName));

    // Find various course-related directory markers
    const courseMarkers = ["genai-cohort", "course", "lessons", "videos"];
    let courseIndex = -1;
    let courseMarker = "";

    for (const marker of courseMarkers) {
      const index = pathParts.findIndex((part) =>
        part.toLowerCase().includes(marker.toLowerCase()),
      );
      if (index !== -1) {
        courseIndex = index;
        courseMarker = marker;
        break;
      }
    }

    let pathAfterCourse = "";
    let technology = "";
    let lessonInfo: Partial<PathMetadata> = {};
    let courseInfo: Partial<PathMetadata> = {};

    if (courseIndex !== -1 && courseIndex < pathParts.length - 1) {
      const relevantParts = pathParts.slice(courseIndex + 1);
      pathAfterCourse = relevantParts.join("/");

      // Extract technology (usually first directory after course marker)
      if (relevantParts.length > 0) {
        technology = relevantParts[0];
      }

      // Extract course information
      courseInfo = {
        courseMarker,
        coursePath: pathParts.slice(0, courseIndex + 1).join("/"),
        relativePath: pathAfterCourse,
      };
    }

    // Enhanced lesson information extraction
    const lessonPatterns = [
      /^(\d+)[-_\s]+(.+)/, // "01-introduction" or "01_introduction" or "01 introduction"
      /^lesson[-_\s]*(\d+)[-_\s]*(.+)/i, // "lesson-01-introduction"
      /^(\d+)\.(.+)/, // "01.introduction"
      /^chapter[-_\s]*(\d+)[-_\s]*(.+)/i, // "chapter-01-introduction"
    ];

    for (const pattern of lessonPatterns) {
      const match = fileNameWithoutExt.match(pattern);
      if (match) {
        lessonInfo = {
          lessonNumber: match[1].padStart(2, "0"),
          lessonTopic: match[2].replace(/[-_]/g, " ").trim(),
        };
        break;
      }
    }

    return {
      fileName,
      fileNameWithoutExt,
      technology,
      pathAfterCourse: pathAfterCourse || filePath,
      ...courseInfo,
      ...lessonInfo,
    };
  }

  /**
   * Check file size and warn about large files
   * @param filePath - Path to check
   */
  private async checkFileSize(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);

      if (stats.size > VTTLoader.MAX_FILE_SIZE) {
        throw new Error(
          `File too large: ${stats.size} bytes. Maximum size: ${VTTLoader.MAX_FILE_SIZE} bytes`,
        );
      }

      if (stats.size > VTTLoader.LARGE_FILE_THRESHOLD) {
        this.log(
          `Processing large file: ${Math.round((stats.size / 1024 / 1024) * 100) / 100} MB`,
        );
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * Load and parse VTT file with comprehensive error handling
   * @returns Array of LangChain Document objects
   */
  async load(): Promise<Document[]> {
    const startTime = Date.now();
    this.log(`Loading VTT file: ${this.filePath}`);

    try {
      // Check file accessibility and size
      await this.checkFileSize(this.filePath);

      // Read VTT file with encoding detection
      const content = await fs.readFile(this.filePath, "utf-8");

      if (!content.trim()) {
        throw new Error("VTT file is empty");
      }

      // Parse VTT content
      const segments = this.parseVTT(content);

      if (segments.length === 0) {
        this.log("No valid segments found in VTT file");
        return [];
      }

      // Combine segments if requested
      const processedSegments = this.combineSegments(segments);

      // Extract metadata from path
      const pathMetadata = this.extractPathMetadata(this.filePath);

      // Convert to LangChain Documents
      const documents = processedSegments.map((segment, index) => {
        const metadata: Record<string, unknown> = {
          // Core metadata
          source: pathMetadata.pathAfterCourse,
          fileName: pathMetadata.fileName,
          technology: pathMetadata.technology,

          // Segment metadata
          segmentId: segment.id,
          startTime: segment.startTime,
          endTime: segment.endTime,
          startSeconds: segment.startSeconds,
          endSeconds: segment.endSeconds,
          duration: segment.duration,
          index: index,

          // Processing metadata
          loadedAt: new Date().toISOString(),
          processingOptions: {
            combineSegments: this.options.combineSegments,
            segmentsPerChunk: this.options.segmentsPerChunk,
            removeHtmlTags: this.options.removeHtmlTags,
            removePositionCues: this.options.removePositionCues,
          },

          // Custom metadata
          ...this.options.customMetadata,
        };

        // Add lesson information if available
        if (pathMetadata.lessonNumber) {
          metadata.lessonNumber = pathMetadata.lessonNumber;
          metadata.lessonTopic = pathMetadata.lessonTopic;
        }

        // Add course information if available
        if (pathMetadata.courseMarker) {
          metadata.courseMarker = pathMetadata.courseMarker;
          metadata.coursePath = pathMetadata.coursePath;
        }

        // Add additional metadata for combined segments
        if (segment.segmentCount) {
          metadata.segmentCount = segment.segmentCount;
          metadata.originalSegmentIds = segment.segmentIds;
          metadata.isCombinedSegment = true;
        }

        // Add cue settings if present
        if (segment.cueSettings) {
          metadata.cueSettings = segment.cueSettings;
        }

        return new Document({
          pageContent: segment.text,
          metadata: metadata,
        });
      });

      const processingTime = Date.now() - startTime;
      this.log(
        `Successfully loaded ${documents.length} documents in ${processingTime}ms`,
      );

      return documents;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.log(`Error loading VTT file: ${errorMessage}`);
      throw new Error(
        `Failed to load VTT file ${this.filePath}: ${errorMessage}`,
      );
    }
  }

  /**
   * Static method to load multiple VTT files
   * @param filePaths - Array of VTT file paths
   * @param options - Common options for all files
   * @returns Combined array of documents
   */
  static async loadMultiple(
    filePaths: string[],
    options: VTTLoaderOptions & { skipErrors?: boolean } = {},
  ): Promise<Document[]> {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      throw new Error("filePaths must be a non-empty array");
    }

    const allDocuments: Document[] = [];
    const errors: Array<{ filePath: string; error: string }> = [];

    for (const filePath of filePaths) {
      try {
        const loader = new VTTLoader(filePath, options);
        const documents = await loader.load();
        allDocuments.push(...documents);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        errors.push({ filePath, error: errorMessage });
        if (!options.skipErrors) {
          throw error;
        }
      }
    }

    if (errors.length > 0 && options.verbose) {
      console.log(
        `Encountered ${errors.length} errors while loading files:`,
        errors,
      );
    }

    return allDocuments;
  }

  /**
   * Static method to discover VTT files in a directory
   * @param directoryPath - Directory to search
   * @param recursive - Whether to search recursively
   * @returns Array of VTT file paths
   */
  static async discoverFiles(
    directoryPath: string,
    recursive: boolean = true,
  ): Promise<string[]> {
    const vttFiles: string[] = [];

    async function scanDirectory(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && recursive) {
            await scanDirectory(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (VTTLoader.SUPPORTED_EXTENSIONS.includes(ext)) {
              vttFiles.push(fullPath);
            }
          }
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code !== "ENOENT" &&
          error.code !== "EACCES"
        ) {
          throw error;
        }
      }
    }

    await scanDirectory(directoryPath);
    return vttFiles.sort();
  }
}

export default VTTLoader;
