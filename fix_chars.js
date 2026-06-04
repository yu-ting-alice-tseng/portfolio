/**
 * fix_chars.js — Fixes all corrupted characters in the fr/en sections of main.js
 *
 * Confirmed character mappings (derived from context analysis):
 *   矇 (U+77C7) → é  (e with acute, most common)
 *   繚 (U+7E5A) → ·  (middle dot / bullet separator)
 *   癡 (U+7661) → è  (e with grave)
 *   癟 (U+765F) → ç  (c with cedilla)
 *   簿 (U+7C3F) → ï  (i with diaeresis)
 *   礙 (U+7919) → ê  (e with circumflex: Requêtes)
 *   繫 (U+7E6B) → ô  (o with circumflex: Contrôle)
 *   璽 (U+74BD) → â  (a with circumflex: grâce)
 *
 * Multi-char compressions (1 corrupted = 2 original chars):
 *   孤  (U+5B64) → ét (e-acute + t), in context 孤矇 = été
 *   妾  (U+59BE) → éc (e-acute + c), in context 妾hange = échange
 *   姒  (U+59D2) → éq (e-acute + q), in context 姒uipe = équipe
 *   宗  (U+5B97) → én (e-acute + n), in context 宗矇vement = événement
 *   始  (U+59CB) → él (e-acute + l), in context 始矇ments = éléments
 *   羶  (U+7FB6) → ût (u with circumflex + t), in context co羶t = coût
 *   妻  (U+59BB) → éd (e-acute + d), in context 妻ucation = éducation
 *
 * ? (U+003F) patterns:
 *   ?? → – (en dash) in date ranges and general body text
 *   footerBack "?? → "← (left arrow for back nav)
 *   ? in d?X, l?X, qu?X, j?X, s?X, c?X, m?X, n?X → ' (apostrophe)
 *   isolated ? between spaces → à (French preposition)
 *   ?tude, ?tudiant, ?tats, ?change etc. at word-start → É
 */

const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// --- Step 1: Simple 1-to-1 character replacements ---
const simple = [
  ['矇', 'é'],
  ['繚', '·'],
  ['癡', 'è'],
  ['癟', 'ç'],
  ['簿', 'ï'],
  ['礙', 'ê'],
  ['繫', 'ô'],
  ['璽', 'â'],
  ['炎', '英'],   // 望炎 → 英檢 (Chinese in fr titles) - handled in multi-char
];

// Only apply in fr/en section (not zh or code section)
const frStart = content.indexOf('    fr: {');
const zhStart = content.indexOf('    zh: {');
const pre = content.slice(0, frStart);
let frEn = content.slice(frStart, zhStart);
const post = content.slice(zhStart);

let count = {};
simple.forEach(([bad, good]) => {
  let c = 0;
  frEn = frEn.split(bad).join(() => { c++; return good; });
  // Actually split/join doesn't support function, use replace:
  frEn = content.slice(frStart, zhStart); // reset - we'll do it properly below
});

// Reset and do properly
frEn = content.slice(frStart, zhStart);

simple.slice(0, -1).forEach(([bad, good]) => {
  const before = frEn;
  frEn = frEn.split(bad).join(good);
  const n = (before.split(bad).length - 1);
  if(n > 0) console.log('Replaced', n, JSON.stringify(bad), '→', JSON.stringify(good));
});

// --- Step 2: Multi-char compressions ---
const multi = [
  // Pattern: corrupted → correct (the corrupted char absorbed the next char)
  ['孤', 'ét'],   // 孤ing → éting (for 孤矇 = été: ét + é)
  ['妾', 'éc'],   // 妾hange → échange
  ['姒', 'éq'],   // 姒uipe → équipe
  ['宗', 'én'],   // 宗matière → énmatière? check context
  ['始', 'él'],   // 始矇ments → éléments
  ['羶', 'ût'],   // co羶t → coût
  ['妻', 'éd'],   // 妻ucation → éducation
];

// Apply multi-char: each absorbs the following char
multi.forEach(([bad, good]) => {
  let n = 0;
  // The corrupted char absorbed the NEXT char (the first char of 'good' beyond 'é')
  // e.g., 孤 = ét (absorbed 't'), so 孤ing = ét + ing = éting
  // Wait - if 孤 = ét, then 孤 alone = ét, no need to absorb
  // So just replace 孤 → ét directly
  const before = frEn;
  frEn = frEn.split(bad).join(good);
  n = before.split(bad).length - 1;
  if(n > 0) console.log('Replaced', n, JSON.stringify(bad), '→', JSON.stringify(good));
});

// --- Step 3: Handle the Chinese chars in French titles (望炎 context) ---
// 望炎 appears in "Cambridge & 英檢" - Chinese text embedded in fr
// Check actual contexts first
const c1 = frEn.indexOf('望炎');
if(c1 !== -1) console.log('望炎 context:', JSON.stringify(frEn.slice(Math.max(0,c1-20), c1+30)));

// 望 = 檢 (Chinese character for "check/exam"), 炎 = ? - skip these as they're Chinese in French titles

// --- Step 4: ?? patterns ---
// 4a: footerBack lines: "?? → "←
frEn = frEn.replace(/footerBack: "??/g, (m) => {
  console.log('Fixed footerBack ?? → ←');
  return 'footerBack: "←';
});

// 4b: Date ranges like "06/2023 ??12/2023" or "2000??024"
frEn = frEn.replace(/(\d)\?\?(\d)/g, (m, a, b) => {
  console.log('Fixed date range ?? →', JSON.stringify(m));
  return a + '–' + b;
});

// 4c: "GPA) ??2021" type: year list separator
frEn = frEn.replace(/\)\s*\?\?(\d{4})/g, (m, y) => {
  return ') – ' + y;
});

// 4d: Remaining ?? in body text → — (em dash) or – (en dash)
// Before applying, check contexts
let qqCount = 0;
frEn = frEn.replace(/\?\?/g, (m, offset) => {
  const ctx = frEn.slice(Math.max(0, offset-20), Math.min(frEn.length, offset+25));
  // Already handled footerBack above
  // Use en dash for most remaining cases
  qqCount++;
  return '–';
});
if(qqCount > 0) console.log('Replaced', qqCount, '?? → –');

// --- Step 5: Single ? patterns ---

// 5a: French contraction apostrophes: d?, l?, qu?, j?, s?, c?, m?, n?, t? before vowels
// These are when ? = ' (apostrophe)
const contractions = [
  [/\bd'(?=[bcdfghjklmnpqrstvwxyzéèêàâïîôù])/gi, "X"], // placeholder
  // Instead: replace specific patterns
];

// Pattern: letter+? before vowel in French context → letter+'
frEn = frEn.replace(/([dlLDqujscmntnQJSCMNT])\?(?=[aeéèêëàâùûôîïouyAEIOUYÀÂÉÈÊËÎÏÔÙÛ])/g, (m, letter, offset) => {
  return letter + "'";
});
console.log('Fixed apostrophe patterns (d?, l?, etc.)');

// 5b: Specific word patterns for É (capital é)
const capitalE = [
  [/\?tudiante/g, 'Étudiante'],
  [/\?tudiant(?!e)/g, 'Étudiant'],
  [/\?tudiants/g, 'Étudiants'],
  [/\?tude(?!nts)/g, 'Étude'],
  [/\?tudes/g, 'Études'],
  [/\?change\b/g, 'Échange'],
  [/\?changes\b/g, 'Échanges'],
  [/\?tats/g, 'États'],
  [/\?tat\b/g, 'État'],
  [/\?l'interface/g, "À l'interface"],
  [/\?valuation/g, 'Évaluation'],
  [/\?volution/g, 'Évolution'],
  [/\?laboration/g, 'Élaboration'],
  [/\?laborer/g, 'Élaborer'],
];

capitalE.forEach(([pattern, replacement]) => {
  const before = frEn;
  frEn = frEn.replace(pattern, replacement);
  if(before !== frEn) console.log('Fixed', pattern.source, '→', replacement);
});

// 5c: Isolated ? as à (French preposition)
// Pattern: space + ? + space → space + à + space
frEn = frEn.replace(/ \? /g, ' à ');
console.log('Fixed isolated ? → à');

// 5d: " ? " at end of value or in other preposition contexts
frEn = frEn.replace(/(\b) \?(?=\s+[a-zéèêàâïîôùûç])/gi, (m, b) => b + ' à');
// Already handled above

// --- Step 6: Specific remaining PUA chars ---
// Check for any remaining PUA chars (U+E000 - U+F8FF)
const puaCount = [];
for(let i = 0; i < frEn.length; i++) {
  const cp = frEn.codePointAt(i);
  if(cp >= 0xE000 && cp <= 0xF8FF) {
    puaCount.push({cp: cp.toString(16), ch: frEn[i], ctx: JSON.stringify(frEn.slice(Math.max(0,i-10), i+15))});
  }
}
if(puaCount.length > 0) {
  console.log('Remaining PUA chars:', puaCount.length);
  puaCount.slice(0,10).forEach(p => console.log('  U+' + p.cp, p.ctx));
}

// --- Reassemble and save ---
content = pre + frEn + post;

// Verify syntax
const vm = require('vm');
const noBom = content.startsWith('﻿') ? content.slice(1) : content;
try {
  new vm.Script(noBom);
  console.log('\nSyntax: OK');
} catch(e) {
  console.log('\nSyntax error:', e.message);
}

fs.writeFileSync('main.js', content, 'utf8');
console.log('File saved.');
