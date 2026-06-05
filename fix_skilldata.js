/**
 * fix_skilldata.js — Apply same character fixes to the skillData section
 */
const fs = require('fs');
const vm = require('vm');
let c = fs.readFileSync('main.js', 'utf8');

const skillStart = c.indexOf('const skillData = {');
const skillEnd   = c.indexOf('\n  function updateSkillPreview', skillStart);

const pre   = c.slice(0, skillStart);
let   skill = c.slice(skillStart, skillEnd);
const post  = c.slice(skillEnd);

// --- Simple 1:1 replacements ---
const simpleMap = [
  ['矇', 'é'], ['繚', '·'], ['癡', 'è'], ['癟', 'ç'],
  ['簿', 'ï'], ['礙', 'ê'], ['繫', 'ô'], ['璽', 'â'],
];
simpleMap.forEach(([bad, good]) => {
  const n = skill.split(bad).length - 1;
  if (n > 0) { skill = skill.split(bad).join(good); console.log(n + 'x', bad, '→', good); }
});

// --- Multi-char compressions ---
const multiMap = [
  ['孤','ét'],['妾','éc'],['姒','éq'],['宗','én'],
  ['始','él'],['羶','ût'],['妻','éd'],
];
multiMap.forEach(([bad, good]) => {
  const n = skill.split(bad).length - 1;
  if (n > 0) { skill = skill.split(bad).join(good); console.log(n + 'x', bad, '→', good); }
});

// --- PUA chars ---
// Scan for PUA codepoints and replace with known mappings
const knownPUA = {
  0xE4FC: '‑T', 0xE9F1: "'a", 0xE9F5: "'e", 0xE9F8: "'h",
  0xE9F9: "'i", 0xEA05: "'u", 0xEA31: "'é",
  0xE4FB: "'",  0xE50D: "'",  0xE514: "'",  0xE9D5: "'",
  0xF1B2: "'",  0xE9D1: "'",  0xE50E: "'",  0xE9FF: "'",
  0xE50C: "'",  0xE51A: "'",  0xE4FD: "'",  0xE515: "'",
  0xF3C4: "'",  0xEA03: "'s", 0xE4EE: "'",  0xE518: "'",
  0xE50A: "'",  0xE4F5: "'",  0xE51C: "'",  0xF2B0: "'",
  0xF2AB: "'",  0xF2AF: "'",  0xF2BB: "'",  0xF2AC: "'",
  0xF2B7: "'",  0xE886: "'",
};

// Build replacement strings for each PUA char found
const puaFound = new Map();
for (let i = 0; i < skill.length; i++) {
  const cp = skill.codePointAt(i);
  if (cp >= 0xE000 && cp <= 0xF8FF) {
    const ch = skill[i];
    if (!puaFound.has(cp)) puaFound.set(cp, { ch, count: 0 });
    puaFound.get(cp).count++;
  }
}
puaFound.forEach(({ ch, count }, cp) => {
  const replacement = knownPUA[cp] || "'";
  skill = skill.split(ch).join(replacement);
  console.log('PUA U+' + cp.toString(16).toUpperCase(), count + 'x → ' + JSON.stringify(replacement));
});

// --- Fix broken footerBack pattern ---
skill = skill.replace(/"←"–/g, '"←');

// --- ?? patterns ---
skill = skill.replace(/(\d)\?\?(\d)/g, '$1–$2');   // date ranges
skill = skill.replace(/\?\?/g, '–');                // remaining → en dash
console.log('Fixed ?? → –');

// --- ? patterns ---
// Remove stray ? before apostrophe
skill = skill.replace(/\?'/g, "'");
// Remove stray ? before non-breaking hyphen
skill = skill.replace(/\?‑/g, '‑');
// Apostrophe contractions
skill = skill.replace(/([dlLDjJsScCmMnNtTqQ])\?(?=[aeéèêëàâùûôîïouyAEIOUYÀÂÉÈÊËÎÏÔÙÛ])/g, "$1'");
// Capital É patterns
[
  ['?tudiante','Étudiante'],['?tudiants','Étudiants'],['?tudiant','Étudiant'],
  ['?tudes','Études'],['?tude','Étude'],['?changes','Échanges'],['?change','Échange'],
  ['?tats-','États-'],['?tats ','États '],['?cole','École'],['?conomie','Économie'],
  ['?coutez','Écoutez'],['?crivez','Écrivez'],['?coute','Écoute'],['?quipe','Équipe'],
  ['?valuation','Évaluation'],
].forEach(([bad, good]) => {
  if (skill.includes(bad)) { skill = skill.split(bad).join(good); console.log(bad, '→', good); }
});
// Isolated ? → à
skill = skill.replace(/ \? /g, ' à ');

// Absorbed-char fixes
const wordFixes = [
  ["'ngoo", "'Engoo"], ["éété", "été"], ["'ffre", "'offre"],
  ["États'nis", "États-Unis"], ["non'rofit", "non-profit"],
  ["Master' student", "Master's student"], ["front'nd", "front-end"],
  ["Panthéon'orbonne", "Panthéon-Sorbonne"], ["Short'erm", "Short-term"],
  ["balanced'udget", "balanced-budget"], ["Co'ondatrice", "Co-fondatrice"],
  ["Co'ounder", "Co-Founder"], ["au'el", "au-del"],
  ["'l'objectif", "'objectif"], ["d'éété", "d'été"],
];
wordFixes.forEach(([bad, good]) => {
  if (skill.includes(bad)) { skill = skill.split(bad).join(good); console.log(bad, '→', good); }
});

// --- Remaining ? check ---
const remaining = (skill.match(/\?/g) || []).length;
console.log('\nRemaining ? in skillData:', remaining);

// --- Reassemble & verify ---
c = pre + skill + post;
const noBom = c.startsWith('﻿') ? c.slice(1) : c;
try { new vm.Script(noBom); console.log('Syntax: OK'); }
catch (e) {
  const m = e.stack.match(/anonymous>:(\d+)/);
  const ln = m ? parseInt(m[1]) : 0;
  console.log('Syntax error line', ln, ':', c.split('\n')[ln - 1]?.slice(0, 100));
}

fs.writeFileSync('main.js', c, 'utf8');
console.log('Saved.');
