import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

// Check if OpenAI API key is provided
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Process command line arguments
const args = process.argv.slice(2);
let filePath = null;
let language = null;
let isBatchMode = false;
let batchDirectory = null;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--language" || args[i] === "-l") {
    language = args[i + 1];
    i++;
  } else if (args[i] === "--batch" || args[i] === "-b") {
    isBatchMode = true;
    batchDirectory = args[i + 1];
    i++;
  } else if (!filePath && !args[i].startsWith("-")) {
    filePath = args[i];
  }
}

// Display help if no arguments provided
if (!filePath && !isBatchMode) {
  console.log("Audio Transcription Tool");
  console.log("");
  console.log("Usage:");
  console.log("  node main.js [options] <file_path>");
  console.log("  node main.js --batch <directory_path>");
  console.log("");
  console.log("Options:");
  console.log("  --language, -l <language>  Specify language (e.g., 'en', 'fr', 'es')");
  console.log("  --batch, -b <directory>    Process all audio files in directory");
  console.log("");
  console.log("Example:");
  console.log("  node main.js --language en samples/audio.mp3");
  process.exit(0);
}

// Ensure file exists if not in batch mode
if (!isBatchMode) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
}

// Check if batch directory exists
if (isBatchMode && !fs.existsSync(batchDirectory)) {
  console.error(`Error: Directory not found: ${batchDirectory}`);
  process.exit(1);
}

/**
 * Transcribe a single audio file
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<void>}
 */
async function transcribeAudio(audioFilePath) {
  try {
    console.log(`Transcribing: ${audioFilePath}`);
    
    // Prepare API request parameters
    const requestParams = {
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
    };
    
    // Add language if specified
    if (language) {
      requestParams.language = language;
      console.log(`Language specified: ${language}`);
    }
    
    const transcription = await openai.audio.transcriptions.create(requestParams);

    console.log("\nTranscription:");
    console.log(transcription.text);
    
    // Save transcription to a text file
    const outputPath = path.join(
      path.dirname(audioFilePath),
      `${path.basename(audioFilePath, path.extname(audioFilePath))}_transcription.txt`
    );
    
    fs.writeFileSync(outputPath, transcription.text);
    console.log(`\nTranscription saved to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`Error during transcription of ${audioFilePath}:`, error.message);
    if (error.response) {
      console.error("API error details:", error.response.data);
    }
    return false;
  }
}

/**
 * Process audio files in batch mode
 * @param {string} directory - Directory containing audio files
 * @returns {Promise<void>}
 */
async function processBatch(directory) {
  console.log(`Processing audio files in: ${directory}`);
  
  // Get all files in the directory
  const files = fs.readdirSync(directory);
  
  // Filter audio files (common audio extensions)
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mpeg', '.mpga', '.webm'];
  const audioFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return audioExtensions.includes(ext);
  });
  
  if (audioFiles.length === 0) {
    console.log("No audio files found in the directory.");
    return;
  }
  
  console.log(`Found ${audioFiles.length} audio files to process.`);
  
  // Process each audio file
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < audioFiles.length; i++) {
    const audioFile = path.join(directory, audioFiles[i]);
    console.log(`\nProcessing file ${i + 1}/${audioFiles.length}: ${audioFiles[i]}`);
    
    const success = await transcribeAudio(audioFile);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log("\nBatch processing complete.");
  console.log(`Successfully transcribed: ${successCount} files`);
  console.log(`Failed to transcribe: ${failCount} files`);
}

// Execute the appropriate function based on mode
if (isBatchMode) {
  processBatch(batchDirectory);
} else {
  transcribeAudio(filePath);
}