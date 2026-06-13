# Portfolio Website — Claude Guidelines

These rules apply to **every task** on this project. Read and follow them before making any change, writing any content, or editing any file.

---

## 1. Capitalization

- The **first letter of every word** in a title or sub-title must be capitalized (title case), **except prepositions** (e.g. de, sur, en, in, of, à, pour, etc.) which stay lowercase.
- Follow the capitalization convention already in use on the specific page for body text (typically sentence case).

---

## 2. Punctuation

- Match the punctuation style already in use on the page — do not introduce new patterns.
- Always put **a space before and after `-`** when used as a separator.
  - ✅ `Excel - TOSA 950/1000`
  - ❌ `Excel-TOSA 950/1000`
- Do **not** use dots/periods as separators to add detail.
  - ❌ `Excel. TOSA 950/1000`
- **Em dash `—` is only allowed in titles and subtitles.** Never use `—` in body text, sentences, paragraphs, or list items. Use `:`, `,`, or parentheses `( )` instead as appropriate.

---

## 3. Font, Writing Style & Color Palette

- New content must use the page's existing fonts, writing tone, CSS variables, and color palette.
- Each page has its own color scheme — **never copy colors verbatim** from another page. Always replace hardcoded colors with the target page's own CSS variables.
  - Finance page: `--fi-accent`, etc.
  - Marketing page: `--mk-accent`, etc.
  - Data/Luxury page: `--lx-gold`, etc.
- After porting a component's shape/structure, check the page's `:root` or top-level style block and replace all colors with the correct page variables.

---

## 4. Completeness

- Before finalizing, ask: would a reader feel confused or sense that the page is incomplete?
- If yes, add the missing context. Do not stop at a technically correct but insufficient result.

---

## 5. Consistency — Never Fabricate Information

- If new information could contradict something already on the site, **flag the conflict and ask** the user before proceeding.
- **Never invent, assume, or fill in information** that was not explicitly provided by the user. Always ask if unsure.

---

## 6. No Garbled Text

Proofread every piece of new content for:
- Encoding issues (e.g. `â€™` instead of `'`)
- Leftover placeholder text (e.g. `Lorem ipsum`, `[INSERT HERE]`)
- Broken or unrecognized characters
- Copy-paste artifacts

---

## 7. Correct Placement & Organization

- Every piece of content must be placed in the **right section** and well-organized within the page structure.
- Do not drop content into a convenient but semantically wrong location.

---

## 8. Language Correctness Per Page

- Match the language of the page — do not place English content on a French page or vice versa.
- **Exception:** some terms are intentionally kept in their original language (e.g. "SEO", specific tool names the user has chosen to keep). When in doubt about whether a term should be translated, **ask the user**.

---

## 9. Experience Reframing — Never Delete Entries

- **Never remove** an experience or education entry, even if it seems unrelated to the page's domain.
- Instead, **reframe the description** to highlight the transferable skills relevant to that page's domain (finance, marketing, data, teaching, etc.).
- Do not invent fictional tasks — only reframe or emphasize real aspects of the experience from a different angle.

---

## 10. Self-Updating Rules

- If the user mentions a new rule, correction, or preference at any point during a session, **immediately update this `CLAUDE.md` file** to include it.
- Also update the corresponding memory file under `memory/` if one exists (e.g. `feedback_content_creation_rules.md`).
- Do not wait to be asked — treat any new guideline as a standing rule and record it right away.

---

## Quick Pre-Publish Checklist

Before finalizing any new text, component, or section:

- [ ] Title/subtitle words are all capitalized
- [ ] Punctuation matches page style; dashes have spaces; no dot-separators
- [ ] Colors use the correct page CSS variables
- [ ] Content is complete and not confusing on its own
- [ ] No contradiction with existing content (or user has been asked)
- [ ] No fabricated information
- [ ] No garbled/placeholder text
- [ ] Content is in the correct section
- [ ] Language matches the page's language version
