<div align="center">

# 🔊 Whisper-Flow 📝

### Seamlessly convert audio to text using OpenAI's Whisper API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Whisper-orange)](https://openai.com/)

</div>

---

## ✨ Features

<table>
  <tr>
    <td>🎤 <b>Transcription</b></td>
    <td>Convert audio to text using OpenAI's Whisper model</td>
  </tr>
  <tr>
    <td>🌐 <b>Language Support</b></td>
    <td>Specify language for better transcription accuracy</td>
  </tr>
  <tr>
    <td>📊 <b>Batch Processing</b></td>
    <td>Process multiple audio files in a directory</td>
  </tr>
  <tr>
    <td>✂️ <b>Audio Splitting</b></td>
    <td>Handle large files by splitting into smaller segments</td>
  </tr>
  <tr>
    <td>🔄 <b>Transcription Combining</b></td>
    <td>Merge multiple transcription files into a single document</td>
  </tr>
  <tr>
    <td>⌨️ <b>Command-line Interface</b></td>
    <td>Simple and intuitive CLI</td>
  </tr>
</table>

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **OpenAI API key**
- **ffmpeg** (required for audio splitting features)

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up API key**:
   Create a `.env` file in the project root:
   ```bash
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Transcribe an audio file**:
   ```bash
   npm run transcribe -- path/to/audio.mp3
   ```

## 📋 Usage Guide

### 🎯 Basic Transcription

```bash
# Using npm script
npm run transcribe -- path/to/audio.mp3

# Direct command
node main.js path/to/audio.mp3
```

### 🌍 Language-Specific Transcription

```bash
# Using npm script
npm run transcribe -- -l fr path/to/audio.mp3

# Direct command
node main.js --language es path/to/audio.mp3
```

Supported language codes follow [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard.

### 📦 Batch Processing

Process all audio files in a directory:

```bash
# Using npm script
npm run batch -- path/to/directory

# With language specification
npm run batch -- -l ja path/to/directory

# Direct command
node main.js --batch path/to/directory
```

## 📂 Handling Large Audio Files

OpenAI has a 25MB file size limit. For larger files, use our splitting tools:

### 1️⃣ Interactive Custom Splitting (Recommended)

```bash
# Using npm script
npm run split-custom -- path/to/large_audio.mp3

# Direct command
node split-custom.js path/to/large_audio.mp3 [output_directory]
```

This tool will prompt you to specify your desired segment duration in minutes.

### 2️⃣ Advanced Splitting Options

```bash
# Using npm script
npm run split -- --duration 300 --output custom_dir path/to/large_audio.mp3

# Direct command
node split-audio.js [options] path/to/large_audio.mp3
```

**Options:**
- `--output`, `-o`: Output directory (default: "split_audio")
- `--duration`, `-d`: Segment duration in seconds (default: 600)
- `--help`, `-h`: Show help message

## 🔄 Complete Workflow for Large Files

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Step 1</b></td>
      <td align="center"><b>Step 2</b></td>
      <td align="center"><b>Step 3</b></td>
    </tr>
    <tr>
      <td align="center">🔪 Split</td>
      <td align="center">🎤 Transcribe</td>
      <td align="center">🔗 Combine</td>
    </tr>
    <tr>
      <td><code>npm run split-custom -- large_recording.mp3</code></td>
      <td><code>npm run batch -- split_audio</code></td>
      <td><code>npm run combine -- split_audio combined_transcript.txt</code></td>
    </tr>
  </table>
</div>

## 🔗 Combining Transcriptions

After transcribing multiple segments, combine them into a single file:

```bash
# Using npm script
npm run combine -- input_directory output_file.txt

# Direct command
node combine-transcriptions.js [options] input_directory output_file.txt
```

**Options:**
- `--pattern`, `-p`: File pattern to match (default: "_transcription.txt")
- `--help`, `-h`: Show help message

## 🎵 Supported File Formats

<div align="center">
  <table>
    <tr>
      <td align="center"><code>mp3</code></td>
      <td align="center"><code>mp4</code></td>
      <td align="center"><code>mpeg</code></td>
      <td align="center"><code>mpga</code></td>
      <td align="center"><code>m4a</code></td>
      <td align="center"><code>wav</code></td>
      <td align="center"><code>webm</code></td>
    </tr>
  </table>
</div>

## ⚠️ Limitations

- Individual file size must be less than 25 MB (use splitting tools for larger files)
- Larger files require more processing time and API usage
- API usage is subject to OpenAI's pricing and rate limits

## 🛠️ Available Scripts

<table>
  <tr>
    <th>Script</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>npm run transcribe</code></td>
    <td>Transcribe a single audio file</td>
  </tr>
  <tr>
    <td><code>npm run batch</code></td>
    <td>Process all audio files in a directory</td>
  </tr>
  <tr>
    <td><code>npm run split</code></td>
    <td>Split audio with configurable options</td>
  </tr>
  <tr>
    <td><code>npm run split-custom</code></td>
    <td>Split audio with interactive duration selection</td>
  </tr>
  <tr>
    <td><code>npm run combine</code></td>
    <td>Combine multiple transcription files</td>
  </tr>
</table>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for audio transcription</p>
</div> 