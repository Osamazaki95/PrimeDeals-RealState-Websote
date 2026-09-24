/**
 * Some file transports cannot carry [brackets] in folder names, so dynamic
 * route folders ship as -slug- / -id- / -page- / -locale- and are renamed here.
 * Runs automatically on `npm install` (postinstall). Safe to re-run.
 */
import { readdir, rename, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const PATTERN = /^-(.+)-$/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const full = join(dir, e.name);
    await walk(full);
    const m = e.name.match(PATTERN);
    if (m) {
      const target = join(dir, '[' + m[1] + ']');
      try {
        await stat(target);
      } catch {
        await rename(full, target);
        console.log('renamed', e.name, '->', '[' + m[1] + ']');
      }
    }
  }
}

await walk(ROOT);
