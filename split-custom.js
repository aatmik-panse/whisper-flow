#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if ffmpeg is installed
function checkFfmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    
    ffmpeg.on('error', () => {
      console.error('Error: ffmpeg not found. Please install ffmpeg to use this tool.');
      console.log('Installation instructions: https://ffmpeg.org/download.html');
      process.exit(1);
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        console.error('Error checking ffmpeg installation.');
        process.exit(1);
      }
    });
  });
}

// Split audio file into segments
function splitAudio(inputFile, outputDir, segmentDuration) {
  return new Promise((resolve, reject) => {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename = path.basename(inputFile, path.extname(inputFile));
    const outputPattern = path.join(outputDir, `${filename}_%03d${path.extname(inputFile)}`);
    
    console.log(`Splitting ${inputFile} into ${segmentDuration / 60} minute segments (${segmentDuration} seconds)...`);
    
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputFile,
      '-f', 'segment',
      '-segment_time', segmentDuration.toString(),
      '-c', 'copy',
      outputPattern
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      // FFmpeg sends progress information to stderr
      const output = data.toString();
      if (output.includes('Error')) {
        console.error(output);
      }
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('Audio splitting complete!');
        
        // List created files
        const files = fs.readdirSync(outputDir);
        const audioFiles = files.filter(file => file.startsWith(filename));
        
        console.log(`Created ${audioFiles.length} segments in ${outputDir}:`);
        audioFiles.forEach(file => console.log(`- ${file}`));
        
        resolve(audioFiles);
      } else {
        console.error(`FFmpeg process exited with code ${code}`);
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Custom Audio Splitter');
    console.log('');
    console.log('This tool splits audio files into segments of a specified duration.');
    console.log('');
    console.log('Usage:');
    console.log('  node split-custom.js <input_file> [output_directory]');
    console.log('');
    console.log('Arguments:');
    console.log('  input_file         The audio file to split');
    console.log('  output_directory   Where to save the segments (default: "split_audio")');
    console.log('');
    console.log('Example:');
    console.log('  node split-custom.js recording.mp3 my_segments');
    process.exit(0);
  }
  
  const inputFile = args[0];
  const outputDir = args[1] || 'split_audio';
  
  if (!inputFile) {
    console.error('Error: Please provide an input file.');
    console.log('Run with --help for usage information.');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }
  
  try {
    // Check if ffmpeg is installed
    await checkFfmpeg();
    
    // Ask user for desired segment duration
    rl.question('Enter segment duration in minutes (default is 10): ', async (answer) => {
      let durationMinutes = parseInt(answer, 10);
      
      // Use default if input is invalid
      if (isNaN(durationMinutes) || durationMinutes <= 0) {
        console.log('Using default duration of 10 minutes.');
        durationMinutes = 10;
      }
      
      // Convert minutes to seconds
      const durationSeconds = durationMinutes * 60;
      
      // Split the audio file
      await splitAudio(inputFile, outputDir, durationSeconds);
      
      console.log('\nNext steps:');
      console.log(`1. Process the segments with the transcription tool:`);
      console.log(`   node main.js -b ${outputDir}`);
      console.log(`2. Combine the transcription files if needed:`);
      console.log(`   node combine-transcriptions.js ${outputDir} combined_transcript.txt`);
      
      rl.close();
    });
  } catch (error) {
    console.error('Error during audio splitting:', error.message);
    rl.close();
    process.exit(1);
  }
}

main(); 