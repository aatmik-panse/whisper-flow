#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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
function splitAudio(inputFile, outputDir, segmentDuration = 600) {
  return new Promise((resolve, reject) => {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename = path.basename(inputFile, path.extname(inputFile));
    const outputPattern = path.join(outputDir, `${filename}_%03d${path.extname(inputFile)}`);
    
    console.log(`Splitting ${inputFile} into ${segmentDuration} second segments...`);
    
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
    console.log('Audio Splitter Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node split-audio.js [options] <input_file>');
    console.log('');
    console.log('Options:');
    console.log('  --output, -o <directory>   Output directory (default: "split_audio")');
    console.log('  --duration, -d <seconds>   Segment duration in seconds (default: 600)');
    console.log('  --help, -h                 Show this help message');
    console.log('');
    console.log('Example:');
    console.log('  node split-audio.js -d 300 -o chunks longaudio.mp3');
    process.exit(0);
  }
  
  let inputFile = null;
  let outputDir = 'split_audio';
  let segmentDuration = 600; // 10 minutes by default
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
      outputDir = args[i + 1];
      i++;
    } else if (args[i] === '--duration' || args[i] === '-d') {
      segmentDuration = parseInt(args[i + 1], 10);
      i++;
    } else if (!inputFile && !args[i].startsWith('-')) {
      inputFile = args[i];
    }
  }
  
  if (!inputFile) {
    console.error('Error: Please provide an input file.');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Check if ffmpeg is installed
  await checkFfmpeg();
  
  try {
    await splitAudio(inputFile, outputDir, segmentDuration);
    console.log('\nNext steps:');
    console.log(`1. Process the segments with the transcription tool:`);
    console.log(`   node main.js -b ${outputDir}`);
    console.log(`2. Combine the transcription files if needed.`);
  } catch (error) {
    console.error('Error during audio splitting:', error.message);
    process.exit(1);
  }
}

main(); 