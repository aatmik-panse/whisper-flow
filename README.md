# Whisper-Flow

A simple command-line toolkit for transcribing audio files using OpenAI's Whisper API.

## Features

- **Transcription**: Convert audio to text using OpenAI's Whisper model
- **Language Support**: Specify language for better transcription accuracy
- **Batch Processing**: Process multiple audio files in a directory
- **Audio Splitting**: Handle large files by splitting into smaller segments
  - Standard splitting with configurable durations
  - Interactive custom duration splitting
  - Optimized 29-minute segments for OpenAI
- **Transcription Combining**: Merge multiple transcription files into a single document
- **Command-line Interface**: Simple and intuitive CLI

## Prerequisites

- Node.js (v16 or higher)
- OpenAI API key
- ffmpeg (required for audio splitting features)

## Quick Start

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Set up API key**:
   Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Transcribe an audio file**:
   ```
   npm run transcribe -- path/to/audio.mp3
   ```

## Audio Transcription

### Basic Transcription

```bash
# Using npm script
npm run transcribe -- path/to/audio.mp3

# Direct command
node main.js path/to/audio.mp3
```

### Language-Specific Transcription

```bash
# Using npm script
npm run transcribe -- -l fr path/to/audio.mp3

# Direct command
node main.js --language es path/to/audio.mp3
```

Supported language codes follow [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard.

### Batch Processing

Process all audio files in a directory:

```bash
# Using npm script
npm run batch -- path/to/directory

# With language specification
npm run batch -- -l ja path/to/directory

# Direct command
node main.js --batch path/to/directory
```

## Handling Large Audio Files

OpenAI has a 25MB file size limit. For larger files, use our splitting tools:

### 1. Interactive Custom Splitting (Recommended)

```bash
# Using npm script
npm run split-custom -- path/to/large_audio.mp3

# Direct command
node split-custom.js path/to/large_audio.mp3 [output_directory]
```

This tool will prompt you to specify your desired segment duration in minutes.

### 2. Optimized 29-Minute Segments

```bash
# Using npm script
npm run split29min -- path/to/large_audio.mp3

# Direct command
node split29min.js path/to/large_audio.mp3 [output_directory]
```

### 3. Advanced Splitting Options

```bash
# Using npm script
npm run split -- --duration 300 --output custom_dir path/to/large_audio.mp3

# Direct command
node split-audio.js [options] path/to/large_audio.mp3
```

Options:
- `--output`, `-o`: Output directory (default: "split_audio")
- `--duration`, `-d`: Segment duration in seconds (default: 600)
- `--help`, `-h`: Show help message

## Complete Workflow for Large Files

1. **Split** the audio file:
   ```
   npm run split-custom -- large_recording.mp3
   ```

2. **Transcribe** all segments:
   ```
   npm run batch -- split_audio
   ```

3. **Combine** the transcriptions:
   ```
   npm run combine -- split_audio combined_transcript.txt
   ```

## Combining Transcriptions

After transcribing multiple segments, combine them into a single file:

```bash
# Using npm script
npm run combine -- input_directory output_file.txt

# Direct command
node combine-transcriptions.js [options] input_directory output_file.txt
```

Options:
- `--pattern`, `-p`: File pattern to match (default: "_transcription.txt")
- `--help`, `-h`: Show help message

## Supported File Formats

- mp3
- mp4
- mpeg
- mpga
- m4a
- wav
- webm

## Limitations

- Individual file size must be less than 25 MB (use splitting tools for larger files)
- Larger files require more processing time and API usage
- API usage is subject to OpenAI's pricing and rate limits

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run transcribe` | Transcribe a single audio file |
| `npm run batch` | Process all audio files in a directory |
| `npm run split` | Split audio with configurable options |
| `npm run split-custom` | Split audio with interactive duration selection |
| `npm run split29min` | Split audio into 29-minute segments |
| `npm run combine` | Combine multiple transcription files |

## License

MIT 