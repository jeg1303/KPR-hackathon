export interface ParsedDiff {
  files: DiffFile[];
  summary: {
    filesChanged: number;
    additions: number;
    deletions: number;
  };
}

export interface DiffFile {
  filename: string;
  status: 'added' | 'deleted' | 'modified';
  additions: number;
  deletions: number;
  chunks: DiffChunk[];
  language: string;
}

export interface DiffChunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'delete' | 'context';
  content: string;
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function parseDiff(diffText: string): ParsedDiff {
  const files: DiffFile[] = [];
  const lines = diffText.split('\n');
  
  let currentFile: DiffFile | null = null;
  let currentChunk: DiffChunk | null = null;
  let oldLineNumber = 0;
  let newLineNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // New file
    if (line.startsWith('diff --git')) {
      if (currentFile && currentChunk) {
        currentFile.chunks.push(currentChunk);
      }
      if (currentFile) {
        files.push(currentFile);
      }
      
      const match = line.match(/b\/(.*?)(?:\s|$)/);
      if (match) {
        currentFile = {
          filename: match[1],
          status: 'modified',
          additions: 0,
          deletions: 0,
          chunks: [],
          language: detectLanguage(match[1]),
        };
      }
      currentChunk = null;
      continue;
    }
    
    // File status
    if (line.startsWith('new file')) {
      if (currentFile) currentFile.status = 'added';
      continue;
    }
    if (line.startsWith('deleted file')) {
      if (currentFile) currentFile.status = 'deleted';
      continue;
    }
    
    // Chunk header
    if (line.startsWith('@@')) {
      if (currentFile && currentChunk) {
        currentFile.chunks.push(currentChunk);
      }
      
      const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
      if (match) {
        oldLineNumber = parseInt(match[1]);
        const oldLines = match[2] ? parseInt(match[2]) : 1;
        newLineNumber = parseInt(match[3]);
        const newLines = match[4] ? parseInt(match[4]) : 1;
        
        currentChunk = {
          oldStart: oldLineNumber,
          oldLines,
          newStart: newLineNumber,
          newLines,
          lines: [],
        };
      }
      continue;
    }
    
    // Skip file headers
    if (line.startsWith('---') || line.startsWith('+++') || 
        line.startsWith('index ') || line.startsWith('Binary files')) {
      continue;
    }
    
    // Content lines
    if (currentChunk && currentFile) {
      if (line.startsWith('+')) {
        const content = line.substring(1);
        currentChunk.lines.push({
          type: 'add',
          content,
          lineNumber: newLineNumber,
          newLineNumber: newLineNumber,
        });
        currentFile.additions++;
        newLineNumber++;
      } else if (line.startsWith('-')) {
        const content = line.substring(1);
        currentChunk.lines.push({
          type: 'delete',
          content,
          lineNumber: oldLineNumber,
          oldLineNumber: oldLineNumber,
        });
        currentFile.deletions++;
        oldLineNumber++;
      } else if (line.startsWith(' ')) {
        const content = line.substring(1);
        currentChunk.lines.push({
          type: 'context',
          content,
          lineNumber: newLineNumber,
          oldLineNumber: oldLineNumber,
          newLineNumber: newLineNumber,
        });
        oldLineNumber++;
        newLineNumber++;
      }
    }
  }
  
  // Add last chunk and file
  if (currentFile && currentChunk) {
    currentFile.chunks.push(currentChunk);
  }
  if (currentFile) {
    files.push(currentFile);
  }
  
  // Calculate summary
  const summary = {
    filesChanged: files.length,
    additions: files.reduce((sum, f) => sum + f.additions, 0),
    deletions: files.reduce((sum, f) => sum + f.deletions, 0),
  };
  
  return { files, summary };
}

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rb': 'ruby',
    'php': 'php',
    'cs': 'csharp',
    'cpp': 'cpp',
    'c': 'c',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'sql': 'sql',
    'sh': 'bash',
    'yml': 'yaml',
    'yaml': 'yaml',
    'json': 'json',
    'xml': 'xml',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'md': 'markdown',
  };
  
  return languageMap[ext] || 'text';
}

export function getAddedLines(parsedDiff: ParsedDiff): Array<{
  file: string;
  line: number;
  content: string;
}> {
  const addedLines: Array<{ file: string; line: number; content: string }> = [];
  
  for (const file of parsedDiff.files) {
    for (const chunk of file.chunks) {
      for (const line of chunk.lines) {
        if (line.type === 'add' && line.newLineNumber) {
          addedLines.push({
            file: file.filename,
            line: line.newLineNumber,
            content: line.content,
          });
        }
      }
    }
  }
  
  return addedLines;
}

export function getFileContent(parsedDiff: ParsedDiff, filename: string): string {
  const file = parsedDiff.files.find(f => f.filename === filename);
  if (!file) return '';
  
  let content = '';
  for (const chunk of file.chunks) {
    for (const line of chunk.lines) {
      if (line.type !== 'delete') {
        content += line.content + '\n';
      }
    }
  }
  
  return content;
}

export function extractChangedFunctions(parsedDiff: ParsedDiff): Array<{
  file: string;
  functionName: string;
  startLine: number;
}> {
  const functions: Array<{ file: string; functionName: string; startLine: number }> = [];
  
  // Simple heuristic: look for function definitions in added/modified lines
  const functionPatterns = [
    /function\s+(\w+)\s*\(/,
    /const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/,
    /(\w+)\s*:\s*function\s*\(/,
    /def\s+(\w+)\s*\(/,  // Python
    /func\s+(\w+)\s*\(/,  // Go
    /fn\s+(\w+)\s*\(/,    // Rust
  ];
  
  for (const file of parsedDiff.files) {
    for (const chunk of file.chunks) {
      for (const line of chunk.lines) {
        if (line.type === 'add' && line.newLineNumber) {
          for (const pattern of functionPatterns) {
            const match = line.content.match(pattern);
            if (match) {
              functions.push({
                file: file.filename,
                functionName: match[1],
                startLine: line.newLineNumber,
              });
            }
          }
        }
      }
    }
  }
  
  return functions;
}
