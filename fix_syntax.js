const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('main.js', 'utf8');

function countUnescapedQuotes(line) {
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      // Check if escaped
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && line[j] === '\\') { backslashes++; j--; }
      if (backslashes % 2 === 0) count++;
    }
  }
  return count;
}

let iter = 0;
while (iter < 50) {
  const noBom = code.startsWith('﻿') ? code.slice(1) : code;
  try {
    new vm.Script(noBom);
    console.log('Syntax OK after', iter, 'fixes');
    break;
  } catch (e) {
    const m = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
    if (!m) { console.log('No line info:', e.message); break; }
    const lineNum = parseInt(m[1]);
    const lines = code.split('\n');
    const badLine = lines[lineNum - 1];
    const qc = countUnescapedQuotes(badLine);

    console.log('Error line', lineNum, '(quotes:', qc, '):', JSON.stringify(badLine.slice(0, 80)));

    if (qc % 2 !== 0) {
      // Unclosed string - add closing quote before the trailing comma/semicolon
      const cr = badLine.endsWith('\r') ? '\r' : '';
      const trimmed = badLine.replace(/\r$/, '');
      const fixed = trimmed.replace(/([^",])([,;]\s*)$/, '$1"$2') + cr;
      if (fixed !== badLine) {
        lines[lineNum - 1] = fixed;
        code = lines.join('\n');
        console.log('  -> Fixed');
      } else {
        console.log('  -> Could not fix automatically, stopping');
        break;
      }
    } else {
      // Even quotes but error - might be multi-line string or different issue
      // Check surrounding context
      for (let i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 2); i++) {
        console.log('  L' + (i+1) + ':', JSON.stringify(lines[i].slice(0, 80)));
      }
      console.log('  -> Complex issue, stopping');
      break;
    }
    iter++;
  }
}

fs.writeFileSync('main.js', code, 'utf8');
console.log('File saved. Total fixes:', iter);
