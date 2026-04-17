import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import fuzzysort from 'fuzzysort';
import chalk from 'chalk';

const talksDir = 'talks';

// --- File Discovery ---

function formatLabel(label: string): string {
  if (!label || label === '[CREATE NEW]') return label;
  return label
    .split('/')
    .map(part => {
      const words = part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
      if (words.length > 1 && /^\d+$/.test(words[0])) {
        return `${words[0]} - ${words.slice(1).join(' ')}`;
      }
      return words.join(' ');
    })
    .join(' / ');
}

function getSlidevMetadata(filePath: string): { isSlidev: boolean; date?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim().startsWith('---')) return { isSlidev: false };
    
    // Frontmatter is usually between the first and second '---'
    const parts = content.split('---');
    if (parts.length < 3) return { isSlidev: true };
    const frontmatter = parts[1];
    
    const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n\r]+)["']?/i);
    return { isSlidev: true, date: dateMatch ? dateMatch[1].trim() : undefined };
  } catch {
    return { isSlidev: false };
  }
}

function getAllFiles(dir: string, base: string = ''): { path: string; display: string }[] {
  let results: { path: string; display: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const relPath = path.join(base, item.name);
    const absPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllFiles(absPath, relPath));
    } else if (item.name.endsWith('.md')) {
      const meta = getSlidevMetadata(absPath);
      if (meta.isSlidev) {
        results.push({ path: absPath, display: relPath.replace('.md', '') });
      }
    }
  }
  return results;
}

interface TreeItem {
  title: string;
  path: string;
  isDir: boolean;
  isSpacer?: boolean;
  depth: number;
  date?: string;
}

function buildFilteredTree(dir: string, allowedPaths: Set<string>, depth = 0): TreeItem[] {
  const items: TreeItem[] = [];
  if (!fs.existsSync(dir)) return items;
  
  const rawItems = fs.readdirSync(dir, { withFileTypes: true });
  rawItems.sort((a, b) => b.name.localeCompare(a.name));

  for (const item of rawItems) {
    const absPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      const children = getAllFiles(absPath);
      const hasAllowedChild = children.some(c => allowedPaths.has(c.path));
      
      if (hasAllowedChild) {
        items.push({ title: item.name, path: absPath, isDir: true, depth });
        items.push(...buildFilteredTree(absPath, allowedPaths, depth + 1));
      }
    } else if (item.name.endsWith('.md')) {
      const meta = getSlidevMetadata(absPath);
      if (meta.isSlidev && allowedPaths.has(absPath)) {
        items.push({ 
          title: item.name.replace('.md', ''), 
          path: absPath, 
          isDir: false, 
          depth,
          date: meta.date 
        });
      }
    }
  }
  return items;
}

// --- TUI State ---

let searchText = '';
let selectedIndex = 0;
let items: TreeItem[] = [];
const allFilesIndex = getAllFiles(talksDir);

function updateState() {
  if (searchText) {
    const results = fuzzysort.go(searchText, allFilesIndex, { key: 'display', limit: 50 });
    const matchPaths = new Set(results.map(res => res.obj.path));
    items = buildFilteredTree(talksDir, matchPaths);
  } else {
    const allPaths = new Set(allFilesIndex.map(f => f.path));
    items = buildFilteredTree(talksDir, allPaths);
  }

  items.push({ title: '', path: '__SPACER__', isDir: true, isSpacer: true, depth: 0 });
  items.push({ title: '[CREATE NEW]', path: 'CREATE_NEW', isDir: false, depth: 0 });

  if (items.length > 0) {
    if (selectedIndex >= items.length) selectedIndex = items.length - 1;
    if (selectedIndex < 0) selectedIndex = 0;
    
    if (items[selectedIndex].isDir) {
       const start = selectedIndex;
       let found = false;
       for (let i = selectedIndex; i < items.length; i++) {
         if (!items[i].isDir) {
           selectedIndex = i;
           found = true;
           break;
         }
       }
       if (!found) {
         for (let i = start; i >= 0; i--) {
           if (!items[i].isDir) {
             selectedIndex = i;
             break;
           }
         }
       }
    }
  }
}

function render() {
  process.stdout.write('\x1B[H\x1B[J');
  process.stdout.write(chalk.white(`Select presentation (Type to search): `) + chalk.cyan(searchText) + '\n\n');

  if (items.length === 0) {
    process.stdout.write(chalk.gray('  No matches found.\n'));
  }

  items.forEach((item, i) => {
    if (item.isSpacer) {
      process.stdout.write('\n');
      return;
    }

    // Adjust indentation: reduce file indentation by 2 spaces (item.depth - 1)
    const renderDepth = item.isDir ? item.depth : Math.max(0, item.depth - 1);
    const indent = '  '.repeat(renderDepth);

    if (item.isDir) {
      process.stdout.write(`${indent}${chalk.white(formatLabel(item.title))}\n`);
    } else {
      const cursor = i === selectedIndex ? chalk.cyan('❯ ') : '  ';
      const formattedTitle = formatLabel(item.title);
      const dateStr = item.date ? chalk.gray(` (${item.date})`) : '';
      const line = `${indent}${cursor}${formattedTitle}${dateStr}`;
      
      process.stdout.write(i === selectedIndex ? chalk.cyan(line) + '\n' : line + '\n');
    }
  });
}

// --- Input Handling ---

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

async function handleKeypress(chunk: any, key: any) {
  if (key && key.ctrl && key.name === 'c') {
    process.exit(0);
  }

  if (key.name === 'up') {
    if (items.length > 0) {
      let next = selectedIndex;
      do {
        next = (next - 1 + items.length) % items.length;
      } while (items[next].isDir && next !== selectedIndex);
      selectedIndex = next;
    }
  } else if (key.name === 'down') {
    if (items.length > 0) {
      let next = selectedIndex;
      do {
        next = (next + 1) % items.length;
      } while (items[next].isDir && next !== selectedIndex);
      selectedIndex = next;
    }
  } else if (key.name === 'return') {
    const selected = items[selectedIndex];
    if (selected) {
      if (selected.path === 'CREATE_NEW') {
        if (await createNew()) return;
      } else {
        launchSlidev(selected.path);
        return;
      }
    }
  } else if (key.name === 'backspace') {
    searchText = searchText.slice(0, -1);
    selectedIndex = 0;
    updateState();
  } else if (chunk && chunk.length === 1 && !key.ctrl && !key.meta) {
    searchText += chunk;
    selectedIndex = 0;
    updateState();
  }
  
  render();
}

process.stdin.on('keypress', handleKeypress);

async function createNew(): Promise<boolean> {
  process.stdin.setRawMode(false);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  process.stdout.write('\n');
  const speaker = await new Promise<string>(resolve => rl.question('Speaker name: ', resolve));
  const name = await new Promise<string>(resolve => rl.question('Talk name: ', resolve));
  rl.close();
  
  if (name && speaker) {
    const target = path.join(talksDir, speaker, name.endsWith('.md') ? name : `${name}.md`);
    if (!fs.existsSync(target)) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, '---\ntheme: seriph\n---\n# New Talk');
    }
    launchSlidev(target);
    return true;
  } else {
    process.stdin.setRawMode(true);
    return false;
  }
}

function launchSlidev(filePath: string) {
  process.stdin.removeListener('keypress', handleKeypress);
  process.stdin.removeAllListeners('data');
  process.stdin.pause();
  process.stdin.setRawMode(false);
  process.stdout.write('\x1B[H\x1B[J');
  
  const slidevBin = path.join(process.cwd(), 'node_modules', '.bin', 'slidev');
  const child = spawn(slidevBin, [filePath], { stdio: 'inherit' });
  
  child.on('exit', () => process.exit(0));
}

updateState();
render();
