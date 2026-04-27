import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import fuzzysort from 'fuzzysort';
import chalk from 'chalk';
import enquirer from 'enquirer';
// @ts-ignore
import datePrompt from './custom-date-prompt.cjs';

// @ts-ignore
const { Input, Toggle } = enquirer;

const talksDir = 'talks';
const configFile = '.config.json';

const titleTemplates = [
  "{name}'s Amazing Talk",
  "{name}'s Journey from Zero to Hero",
  "{name} Builds Cool Shit",
  "Inside {name}'s Tech Stack",
  "{name} YOLO Deploys on a Friday Afternoon"
];

function getPlaceholderTitle(speaker: string) {
  const namePart = speaker.split(/[\s-]+/)[0];
  const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  return template.replace(/{name}/g, firstName);
}

function sanitize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getConfig() {
  if (fs.existsSync(configFile)) {
    try {
      return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    } catch { return {}; }
  }
  return {};
}

function saveConfig(config: any) {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

// --- File Discovery ---

function formatLabel(label: string, isLastOpened = false): string {
  if (!label || label === '[NEW TALK]' || label === '[SEE DEMO]') return label;
  const separator = isLastOpened ? ' - ' : ' / ';
  return label
    .split('/')
    .map(part => {
      const words = part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
      if (words.length > 1 && /^\d+$/.test(words[0])) {
        return `${words[0]} - ${words.slice(1).join(' ')}`;
      }
      return words.join(' ');
    })
    .join(separator);
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

function getAllFiles(dir: string, base: string = ''): { path: string; display: string; date?: string }[] {
  let results: { path: string; display: string; date?: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const relPath = path.join(base, item.name);
    const absPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllFiles(absPath, relPath));
    } else if (item.name.endsWith('.md')) {
      if (base === '' && item.name === 'demo.md') continue;
      const meta = getSlidevMetadata(absPath);
      if (meta.isSlidev) {
        results.push({
          path: absPath,
          display: relPath.replace('.md', ''),
          date: meta.date
        });
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
  isLastOpened?: boolean;
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
      if (depth === 0 && item.name === 'demo.md') continue;
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
  items = [];
  const config = getConfig();
  const lastOpenedPath = config['last-opened-path'];
  const absLastOpened = lastOpenedPath
    ? (path.isAbsolute(lastOpenedPath) ? lastOpenedPath : path.join(process.cwd(), talksDir, lastOpenedPath))
    : null;

  if (!searchText && absLastOpened && fs.existsSync(absLastOpened) && lastOpenedPath !== 'demo.md') {
    const meta = getSlidevMetadata(absLastOpened);
    // Determine relative path for display: should be person/file
    const rel = path.relative(path.join(process.cwd(), talksDir), absLastOpened).replace('.md', '');

    items.push({
      title: rel,
      path: absLastOpened,
      isDir: false,
      isLastOpened: true,
      depth: 0,
      date: meta.date
    });
    items.push({ title: '', path: '__SPACER__', isDir: true, isSpacer: true, depth: 0 });
  }

  if (searchText) {
    const results = fuzzysort.go(searchText, allFilesIndex, { keys: ['display', 'date'], limit: 50 });
    const matchPaths = new Set(results.map(res => res.obj.path));
    items.push(...buildFilteredTree(talksDir, matchPaths));
  } else {
    const allPaths = new Set(allFilesIndex.map(f => f.path));
    items.push(...buildFilteredTree(talksDir, allPaths));
  }

  items.push({ title: '', path: '__SPACER__', isDir: true, isSpacer: true, depth: 0 });
  items.push({ title: '[NEW TALK]', path: 'CREATE_NEW', isDir: false, depth: 0 });
  items.push({ title: '[SEE DEMO]', path: 'SEE_DEMO', isDir: false, depth: 0 });

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
  process.stdout.write(chalk.white(`Select Presentation (type to search): `) + chalk.cyan(searchText) + '\n\n');

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
      const formattedTitle = formatLabel(item.title, item.isLastOpened);
      const dateStr = item.date ? chalk.gray(` (${item.date})`) : '';
      const prefix = item.isLastOpened ? chalk.yellow('[LAST OPENED] ') : '';
      const line = `${indent}${cursor}${prefix}${formattedTitle}${dateStr}`;

      process.stdout.write(i === selectedIndex ? chalk.cyan(line) + '\n' : line + '\n');
    }
  });
  process.stdout.write('\n');
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
      } else if (selected.path === 'SEE_DEMO') {
        launchSlidev(path.join(process.cwd(), talksDir, 'demo.md'));
        return;
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
  // Prevent selector keypresses from interfering with the form
  process.stdin.removeListener('keypress', handleKeypress);
  process.stdin.setRawMode(false);

  // Clear screen and show form
  process.stdout.write('\x1B[H\x1B[J');

  const config = getConfig();
  const defaultPresenter = config['default-presenter-name'] || 'paul-yun';

  try {
    const speakerPrompt = new Input({
      message: 'Presenter Name:',
      initial: defaultPresenter
    });
    const speaker = await speakerPrompt.run();
    if (speaker === undefined) throw new Error('Canceled');

    // Save the new default presenter
    if (speaker && speaker !== defaultPresenter) {
      config['default-presenter-name'] = speaker;
      saveConfig(config);
    }

    const titlePrompt = new Input({
      message: 'Talk Title:',
      initial: getPlaceholderTitle(speaker)
    });
    const talkName = await titlePrompt.run();
    if (talkName === undefined) throw new Error('Canceled');

    if (!speaker || !talkName) {
      throw new Error('Speaker and Talk Name are required');
    }

    const togglePrompt = new Toggle({
      message: 'Add Talk Date?',
      enabled: 'Yes',
      disabled: 'Skip'
    });
    const shouldAddDate = await togglePrompt.run();
    if (shouldAddDate === undefined) throw new Error('Canceled');

    let dateStr = '';
    if (shouldAddDate) {
      process.stdin.setRawMode(false); // Let date-prompt take over
      const rawDate = await datePrompt('Talk Date');

      const date = new Date(rawDate);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      dateStr = `${yyyy}-${mm}-${dd}`;
    }

    const safeSpeaker = sanitize(speaker);
    const speakerDir = path.join(talksDir, safeSpeaker);
    if (!fs.existsSync(speakerDir)) {
      fs.mkdirSync(speakerDir, { recursive: true });
    }

    // Auto-increment numbering: find the highest number in the directory
    let nextNum = 1;
    try {
      const files = fs.readdirSync(speakerDir);
      const existingNums = files
        .map(f => f.match(/^(\d+)-/))
        .filter((m): m is RegExpMatchArray => m !== null)
        .map(m => parseInt(m[1], 10));

      if (existingNums.length > 0) {
        nextNum = Math.max(...existingNums) + 1;
      }
    } catch {
      // Directory might be new or empty
    }

    const prefix = nextNum.toString().padStart(2, '0');
    const safeTitle = sanitize(talkName);
    const filename = `${prefix}-${safeTitle}.md`;
    const target = path.join(speakerDir, filename);

    const boilerplate = [
      '---',
      `theme: seriph`,
      `title: "${talkName.replace(/"/g, '\\"')}"`,
      dateStr ? `date: ${dateStr}` : null,
      '---',
      '',
      `# ${talkName}`,
      '',
      `Presented by **${formatLabel(safeSpeaker)}**`,
      '',
      '---',
      '',
      '# Overview',
      '',
      '- Introduction',
      '- Main Topic',
      '- Conclusion',
      '',
      '---',
      '',
      '# Thank You!',
      '',
      'Questions?',
    ].filter(line => line !== null).join('\n');

    fs.writeFileSync(target, boilerplate);

    launchSlidev(target);
    return true;
  } catch (err) {
    // Restore raw mode and re-attach selector keypress listener
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on('keypress', handleKeypress);
    render();
    return false;
  }
}

function launchSlidev(filePath: string) {
  // Save last opened as relative path (excluding 'talks/')
  const config = getConfig();
  const relPath = path.relative(path.join(process.cwd(), talksDir), filePath);
  if (relPath !== 'demo.md') {
    config['last-opened-path'] = relPath;
    saveConfig(config);
  }

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
