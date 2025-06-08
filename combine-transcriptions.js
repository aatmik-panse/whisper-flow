#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Sort file names numerically when they contain numbers
function naturalSort(files) {
  return files.sort((a, b) => {
    // Extract numbers from filenames
    const aMatch = a.match(/(\d+)/);
    const bMatch = b.match(/(\d+)/);
    
    if (aMatch && bMatch) {
      return parseInt(aMatch[0], 10) - parseInt(bMatch[0], 10);
    }
    
    return a.localeCompare(b);
  });
}

// Combine transcription files in a directory
function combineTranscriptions(inputDir, outputFile, filePattern = '_transcription.txt') {
  if (!fs.existsSync(inputDir)) {
    console.error(`Error: Directory not found: ${inputDir}`);
    process.exit(1);
  }
  
  // Get all files in the directory
  const files = fs.readdirSync(inputDir);
  
  // Filter transcription files
  const transcriptionFiles = files.filter(file => file.includes(filePattern));
  
  if (transcriptionFiles.length === 0) {
    console.error(`Error: No transcription files found in ${inputDir}`);
    process.exit(1);
  }
  
  // Sort files in natural order
  const sortedFiles = naturalSort(transcriptionFiles);
  
  console.log(`Found ${sortedFiles.length} transcription files to combine.`);
  
  // Combine files
  let combinedText = '';
  
  sortedFiles.forEach((file, index) => {
    const filePath = path.join(inputDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Processing (${index + 1}/${sortedFiles.length}): ${file}`);
    
    // Add a separator between segments
    if (index > 0) {
      combinedText += '\n\n--- Segment ' + (index + 1) + ' ---\n\n';
    } else {
      combinedText += '--- Segment 1 ---\n\n';
    }
    
    combinedText += content;
  });
  
  // Write combined text to output file
  fs.writeFileSync(outputFile, combinedText);
  console.log(`\nCombined transcription saved to: ${outputFile}`);
}

function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Transcription Combiner Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node combine-transcriptions.js [options] <input_directory> <output_file>');
    console.log('');
    console.log('Options:');
    console.log('  --pattern, -p <pattern>   File pattern to match (default: "_transcription.txt")');
    console.log('  --help, -h                Show this help message');
    console.log('');
    console.log('Example:');
    console.log('  node combine-transcriptions.js split_audio combined_transcript.txt');
    console.log('  node combine-transcriptions.js -p _en_transcription.txt split_audio combined_en.txt');
    process.exit(0);
  }
  
  let inputDir = null;
  let outputFile = null;
  let filePattern = '_transcription.txt';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pattern' || args[i] === '-p') {
      filePattern = args[i + 1];
      i++;
    } else if (!inputDir && !args[i].startsWith('-')) {
      inputDir = args[i];
    } else if (!outputFile && !args[i].startsWith('-')) {
      outputFile = args[i];
    }
  }
  
  if (!inputDir || !outputFile) {
    console.error('Error: Please provide both input directory and output file.');
    console.log('Run with --help for usage information.');
    process.exit(1);
  }
  
  combineTranscriptions(inputDir, outputFile, filePattern);
}

main(); 