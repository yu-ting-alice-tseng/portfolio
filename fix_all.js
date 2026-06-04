/**
 * fix_all.js
 * 1. Fix syntax errors (unclosed strings in zh section)
 * 2. Fix corrupted characters in fr/en sections
 */
const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('main.js', 'utf8');

// ─── PHASE 1: Fix unclosed string syntax errors ────────────────────────────
function countUnescapedQuotes(line) {
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && line[j] === '\\') { backslashes++; j--; }
      if (backslashes % 2 === 0) count++;
    }
  }
  return count;
}

let syntaxFixes = 0;
for (let iter = 0; iter < 300; iter++) {
  const noBom = code.startsWith('﻿') ? code.slice(1) : code;
  try { new vm.Script(noBom); break; } catch (e) {
    const m = e.stack.match(/anonymous>:(\d+)/);
    if (!m) break;
    const lineNum = parseInt(m[1]);
    const lines = code.split('\n');
    const badLine = lines[lineNum - 1];
    const qc = countUnescapedQuotes(badLine);
    if (qc % 2 !== 0) {
      const cr = badLine.endsWith('\r') ? '\r' : '';
      const trimmed = badLine.replace(/\r$/, '');
      const fixed = trimmed.replace(/([^",])([,;]\s*)$/, '$1"$2') + cr;
      if (fixed !== badLine) { lines[lineNum - 1] = fixed; code = lines.join('\n'); syntaxFixes++; }
      else break;
    } else break;
  }
}
console.log('Phase 1: fixed', syntaxFixes, 'unclosed strings');

// ─── PHASE 2: Fix corrupted characters in fr/en sections ──────────────────
const frStart = code.indexOf('    fr: {');
const zhStart = code.indexOf('    zh: {');
const pre  = code.slice(0, frStart);
let   frEn = code.slice(frStart, zhStart);
const post = code.slice(zhStart);

// 2a. Simple 1-to-1 CJK → accent mappings
const simpleMap = [
  ['矇', 'é'],  // 矇 → é
  ['繚', '·'],  // 繚 → · (middle dot)
  ['癡', 'è'],  // 癡 → è
  ['癟', 'ç'],  // 癟 → ç
  ['簿', 'ï'],  // 簿 → ï
  ['礙', 'ê'],  // 礙 → ê
  ['繫', 'ô'],  // 繫 → ô
  ['璽', 'â'],  // 璽 → â
];
simpleMap.forEach(([bad, good]) => {
  const n = frEn.split(bad).length - 1;
  if (n > 0) { frEn = frEn.split(bad).join(good); console.log('  ' + n + 'x', JSON.stringify(bad), '→', JSON.stringify(good)); }
});

// 2b. Multi-char compressions (1 corrupted char = 2 original chars)
// Each of these chars absorbed the NEXT character into itself
const multiMap = [
  ['孤', 'ét'],  // 孤 → ét  (d'été: d?孤矇 → d'été)
  ['妾', 'éc'],  // 妾 → éc  (échange: 妾hange)
  ['姒', 'éq'],  // 姒 → éq  (équipe: 姒uipe)
  ['宗', 'én'],  // 宗 → én  (événement: 宗矇nement)
  ['始', 'él'],  // 始 → él  (éléments: 始矇ments)
  ['羶', 'ût'],  // 羶 → ût  (coût: co羶t)
  ['妻', 'éd'],  // 妻 → éd  (éducation: 妻ucation)
];
multiMap.forEach(([bad, good]) => {
  const n = frEn.split(bad).length - 1;
  if (n > 0) { frEn = frEn.split(bad).join(good); console.log('  ' + n + 'x', JSON.stringify(bad), '→', JSON.stringify(good)); }
});

// 2c. PUA (Private Use Area) chars — each represents apostrophe + absorbed next char
// Scan for PUA codepoints and build a map from context
const puaMap = new Map();
for (let i = 0; i < frEn.length; i++) {
  const cp = frEn.codePointAt(i);
  if (cp >= 0xE000 && cp <= 0xF8FF) {
    if (!puaMap.has(cp)) {
      // Find context to determine what this char should be
      const ctx = frEn.slice(Math.max(0, i-8), i+12);
      puaMap.set(cp, { ch: frEn[i], ctx, count: 0 });
    }
    puaMap.get(cp).count++;
  }
}

// Determine replacements for each PUA char from context
const puaReplacements = new Map();

// Known PUA mappings (derived from context analysis):
// U+E4FC in "Yu?ing Tseng" → "Yu‑Ting Tseng" → represents ‑T (non-breaking hyphen + T)
// U+E9F5 in "l?xpérience" → "l'expérience" → represents 'e
// U+E9F1 in "l?ctivité" → "l'activité" → represents 'a
// U+EA05 in "d?n profil" → "d'un profil" → represents 'u
// U+E9F9 in "l?nterface" → "l'interface" → represents 'i
// U+E9F8 in "Aujourd?ui" → "Aujourd'hui" → represents 'h
// U+EA31 in "d?échange" → "d'échange" → represents 'é (after fix: 'é → '' + 'é' = "'é")
// etc.

// Strategy: for PUA chars, the replacement = apostrophe (') + the char that follows in the word
// But since we don't know which char was absorbed, look at context.
// The simplest approach: replace PUA with just the apostrophe (')
// because the absorbed char is still present as the next char in text.
// E.g., "l[PUA]xpérience" → "l'xpérience" is WRONG (missing the 'e')
// We need to PREPEND the absorbed char.

// Looking at contexts, the absorbed char is the one AFTER the PUA in the file:
// "l?xpérience" has PUA + "x" but original is "l'e" + "xpérience" → the PUA absorbed 'e'
// So replacement = "'" + absorbed_char, and we REMOVE the next char from the string.
// This is complex. Alternative: the PUA codepoint ENCODES the absorbed char.

// Pattern analysis: PUA codepoint - 0xE000 = some offset related to absorbed char
// U+E9F5: E9F5 - E000 = 0x9F5. ASCII of 'e' = 0x65. Not obvious.
// U+EA05: EA05 - E000 = 0xA05. ASCII of 'u' = 0x75. Also not obvious.

// Better approach: replace PUA + following_char with ' + following_char
// i.e., insert the apostrophe and keep everything else.
// BUT the absorbed char is MISSING from the file - only the char AFTER the absorbed one is there.

// For "l?xpérience": PUA absorbed 'e', so we have PUA + "xpérience"
// Replace: PUA → "'" then insert 'e' → "'e" + "xpérience" = "'expérience"
// But wait: in the file it shows as PUA + 'x' (where 'x' = what follows 'e' in 'experience')
// Actually: "l?xpérience" → l + PUA + x + p + é + r... The 'e' IS missing.

// So the fix is: PUA → "'" + absorbed_char
// But what is the absorbed char? It's ENCODED in the PUA codepoint.
// After mapping: U+E9F5 - absorbed 'e', U+EA05 - absorbed 'u', U+E9F1 - absorbed 'a', etc.
// Looking at pattern: U+E9F5 = 0xE9F5. 0xF5 = 245 = 'e' + 180? 0x65 + 0x90 = 0xF5? No.
// 0xE9F5 in Big5: not obvious.

// Manual mapping from context:
const knownPUA = {
  0xE4FC: '‑T',  // ‑T (non-breaking hyphen + T) in Yu‑Ting
  0xE9F1: "'a",       // 'a in l'activité, l'analyse
  0xE9F5: "'e",       // 'e in l'expérience
  0xE9F8: "'h",       // 'h in Aujourd'hui
  0xE9F9: "'i",       // 'i in l'interface
  0xEA05: "'u",       // 'u in d'un, d'une
  0xEA31: "'é",       // 'é in d'échange (after é fix)
};

// For unknown PUA chars, fall back to just '
puaMap.forEach((info, cp) => {
  const replacement = knownPUA[cp] || "'";
  puaReplacements.set(info.ch, replacement);
  console.log('  PUA U+' + cp.toString(16).toUpperCase(), info.count + 'x', JSON.stringify(info.ctx.slice(0,30)), '→', JSON.stringify(replacement));
});

// Apply PUA replacements
puaReplacements.forEach((replacement, ch) => {
  frEn = frEn.split(ch).join(replacement);
});

// 2d. ?? (double question mark) patterns
// First: footerBack lines → ← (left arrow)
frEn = frEn.replace(/footerBack:\s*"\?\?/g, 'footerBack: "←');
// Count and replace remaining date ranges
frEn = frEn.replace(/(\d)\?\?(\d)/g, '$1–2');  // digit??digit → digit–digit

// Remaining ?? → – (en dash) for body text
let qqCount = 0;
frEn = frEn.replace(/\?\?/g, () => { qqCount++; return '–'; });
console.log('  ' + qqCount + 'x ?? → –');

// 2e. Single ? patterns
// Apostrophes: [dlLDjJsSqQcCmMnNtT]? before vowel → [letter]'
frEn = frEn.replace(/([dlLDjJsScCmMnNtTqQ])\?(?=[aeéèêëàâùûôîïouyAEIOUYÀÂÉÈÊËÎÏÔÙÛ])/g, "$1'");

// Capital É patterns
const capitalPatterns = [
  ['?tudiante', 'Étudiante'],
  ['?tudiants', 'Étudiants'],
  ['?tudiant', 'Étudiant'],
  ['?tudes', 'Études'],
  ['?tude', 'Étude'],
  ['?changes', 'Échanges'],
  ['?change', 'Échange'],
  ['?tats-', 'États-'],
  ['?tats ', 'États '],
  ['?valuation', 'Évaluation'],
  ['?volution', 'Évolution'],
];
capitalPatterns.forEach(([bad, good]) => {
  const n = frEn.split(bad).length - 1;
  if (n > 0) { frEn = frEn.split(bad).join(good); console.log('  ' + n + 'x', JSON.stringify(bad), '→', JSON.stringify(good)); }
});

// Isolated ? → à (between spaces, as French preposition)
frEn = frEn.replace(/ \? /g, ' à ');
// ? at start of string value before preposition targets
frEn = frEn.replace(/": "\?(?= )/g, '": "à');  // "? word" → "à word"
frEn = frEn.replace(/\? partir/g, 'à partir');
frEn = frEn.replace(/\? Ta/g, 'à Ta');  // à Taïwan

// 2f. Check for remaining unusual chars
let remaining = [];
for (let i = 0; i < frEn.length; i++) {
  const cp = frEn.codePointAt(i);
  if ((cp >= 0x4E00 && cp <= 0x9FFF) || (cp >= 0xE000 && cp <= 0xF8FF)) {
    const ctx = frEn.slice(Math.max(0,i-10), i+15);
    remaining.push({ cp: 'U+' + cp.toString(16).toUpperCase(), ctx: JSON.stringify(ctx) });
  }
}
if (remaining.length > 0) {
  console.log('Remaining unusual chars:', remaining.length);
  remaining.slice(0, 15).forEach(r => console.log(' ', r.cp, r.ctx));
}

// ─── PHASE 3: Reassemble and verify ────────────────────────────────────────
code = pre + frEn + post;

const noBom = code.startsWith('﻿') ? code.slice(1) : code;
try {
  new vm.Script(noBom);
  console.log('\nSyntax: OK');
} catch (e) {
  const m = e.stack.match(/anonymous>:(\d+)/);
  const lines = code.split('\n');
  const ln = m ? parseInt(m[1]) : 0;
  console.log('\nSyntax error at line', ln, ':', e.message);
  if (ln) console.log(JSON.stringify(lines[ln-1].slice(0, 100)));
}

fs.writeFileSync('main.js', code, 'utf8');
console.log('File saved.');
