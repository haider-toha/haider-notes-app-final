---
name: review-haider-voice
description: Audits an existing blog post, note, or passage and returns a marked-up list of voice violations and AI-writing tells with concrete suggested fixes, plus an overall verdict. Use whenever the user asks to review, audit, check, clean up, or "de-slop" a note or blog post for Haider's voice, to find the AI tells in a draft, to make prose "sound more like Haider / like me", or to check whether something reads as him or as AI. Runs an ordered audit - surface mechanics, rhythm, specificity, banned AI patterns, ending - and supplies the rewrite for each finding. Self-contained - carries the full rule set, tell list, and a before/after example inline; no other file needs to be read.
---

# review prose for haider's voice (de-slopify)

This skill audits a draft against Haider's house style and returns actionable findings. Everything you need is here - you do not need to read the corpus, `constants.tsx`, or any `writing-style/` file. Quotes below are real, verbatim from his essays.

> This document is written in normal sentence case because it is a reference. **His prose, and every fix you propose, is all lowercase.**

## what you return (the output contract)

Read the draft, run the audit below, then return:

1. **a marked-up findings list**, most severe first. each finding is one line:
   `[must-fix | judgement] "the offending span" - <rule broken> → fix: "<the rewrite>"`
   quote the actual text so the location is unambiguous; always supply the concrete rewrite, never just a flag.
2. **one before/after**: pick the worst paragraph, show it, then show it repaired.
3. **an overall verdict**: 1-3 sentences - does it read as him, and what are the top two or three things to change. keep it blunt and short.

If the draft is clean, say so plainly and name the one or two things that make it land, so the signal is reusable.

## the audit - run these passes in order (cheap deterministic checks first, judgement last)

**pass 1 - surface mechanics (each miss is must-fix).** scan for:
- any capital letter in prose - sentence starts, `i`, proper nouns ("London", "OpenAI"), acronyms ("API", "GPU"), the title. all must be lowercase. only real exceptions: math/science eponyms and notation (`Euler-Lagrange`, `RK4`, `xG`), formal codes (`DODD 3000.09`), text inside a quotation, urls.
- em-dashes `—` or en-dashes `–` (should be zero).
- an oxford comma - "a, b, and c" (should be "a, b and c"). a comma before "but" is fine, leave it.
- a colon in personal / reflective prose (banned; the test is register, not topic - a technical *subject* written in the reflective voice still gets no colons). colons are ok in scaffolded technical notes.
- curly quotes `" "` `' '`; exclamation marks; `$` in prose (want "usd"/"£"); `&` in running prose (want "and").
- american spelling where British is wanted (optimize→optimise, analyzer→analyser, center→centre, color→colour); leave entrenched CS jargon (optimization, modeling, synthesize).
- numbers: lived/bodily/rounded quantities should be spelled out ("twenty-three", "nine weeks"); cited real-world data should be digits, even in a personal essay ("1,701 civilians", "96,000 tweets").

**pass 2 - rhythm / burstiness (read it aloud in your head).** does the sentence length vary hard, or does it march at a uniform ~14-24 words? the target is long `and`-chained sentences (35-52 words) landed by short ones (1-9 words); the median is ~12-18 with 30+-word swings between neighbours. flag any run of three-plus sentences in the same length band. **do not** flag his long comma-spliced run-ons or `and`-chains as errors - the sprawl is the voice; only flag *uniformity*.

**pass 3 - specificity (the most important check).** flag every abstract claim not anchored to a named, dated or numbered particular. flag "studies show", "experts argue", "research suggests", "many people" and any source-free attribution - the fix is to name the real source (a person, paper, year) or cut the claim. also flag **fake specificity**: a stuffed-in identity or biography *label* ("as an engineer i…", "growing up between two cultures…", "my background is aeronautics, so i…") reads more robotic, not less. flag it **even when the label leads into a real method** - "my background is aeronautics, so i started from the failure modes" is still a tell; the credential does no work the concrete habit can't do alone. the fix is to cut the label and let the *scene* stand on its own - the specific dated moment, dish, match or bug, or here the bare habit ("before writing a line i listed the ways this could lose data").

**pass 4 - banned AI patterns (each is must-fix; see the table below for fixes).** hunt the five: "not X but Y", tricolon, staccato-for-drama, rhetorical question, "here's the thing". then the clause-level tells: participial `-ing` tails, nominalization-in-place-of-a-verb, subject-position "that"-clauses, expletive/dummy-subject openers, latinate signposting.

**pass 5 - ending.** does it undercut, or does it bow? flag any cosmic "in the end…" uplift, any "this taught me…" / "bridge between two worlds" lesson-learned closer, any tidy universal resolution. the fix is to earn the synthesis then deflate it, ground it in a plain action, or leave it open.

## the rule set you audit against (identical to the writer skill)

**surface non-negotiables (binary):** all lowercase incl. sentence starts / `i` / proper nouns / acronyms / titles; no em/en-dashes (use spaced hyphen `" - "`, parens, or comma); no oxford comma; no colons in personal prose; straight quotes; no exclamation marks; no `$` or `&` in prose; british spelling; digits for cited data, words for lived quantities.

**sounds-like-him signature:** bursty long-chain-then-short-landing rhythm; personal openings on `i` + a concrete anchor, technical on a wide "we/i have been" claim; the anti-bow ending; the "the part … is" cleft frame; the "so [wh] … ." full-stop pivot instead of a rhetorical "?"; comma-apposition as the main pause (his colon/dash replacement); one dry deflating line; jargon and Islamic/philosophical terms glossed inline; secular and Islamic ideas paired as two readings of one truth.

**the two un-fakeable things:** relentless concreteness (name/date/number everything; never "studies show"), and the technical-emotional-faith blend.

## banned outright - no earned version, one use is a tell

- **"not X but Y" / negative parallelism** - the #1 macro-shape AI tell; manufactures a fake turn. includes the split variant "this isn't X. it's Y."
- **rule of three / tricolon** - a third item added for balance where two exist.
- **short staccato sentence for drama** - a punchy fragment planted after a generic claim to sound decisive. (a short sentence carrying a specific concrete fact is fine - do not flag those.)
- **rhetorical question** - setup-payoff hand-holding.
- **"here's the thing" / "the real question is" / an unearned reflective beat** ("something shifted.").

## fix-pattern table (common tell → concrete rewrite)

| tell in the draft | rewrite as |
|---|---|
| em-dash `—` | spaced hyphen `" - "`, parentheses, or a comma |
| "the doubt was not a destination but a method" | plain statement: "the doubt was a method" |
| a tricolon padded for rhythm | say the real number of things (two, or four) |
| "it serves as / stands as / represents / plays a crucial role in" | plain "is": "that number is a trap" |
| "studies show" / "experts argue" | name the source (person, paper, year) or cut the claim |
| stuffed-in identity/biography label, even one that leads into a real method ("my background is aeronautics, so i…") | cut the credential; keep the concrete habit or scene on its own |
| "the router, leaning on cached state, forgets…" (participial `-ing` tail) | split into finite verbs / an `and`-chain: "the router leans on cached state and forgets…" |
| "provides an improvement to" / "is a reflection of" (nominalization) | a strong finite verb: "improves" / "reflects" |
| "that the system fails here is telling" (subject-position that-clause) | "the system fails here, and that's telling" |
| "it is worth considering" / "there is a sense in which" (expletive opener) | make the real noun the subject |
| "moreover / furthermore / additionally / thus" | "and" / "but" / "so" |
| a rhetorical question as setup | state the claim, or use the "so [wh] … ." full-stop pivot |
| a cosmic "in the end…" bow | earn the synthesis, then deflate or ground it |
| bold-label-colon wall in prose | let it flow as sentences |
| any capital, curly quote, `$`, `&`, `!` in prose | lowercase / straight quote / "usd" / "and" / cut |

## worked before/after (real target text)

**before - a slopped-up draft:**

> "The underlying mechanism, once you examine it closely, is surprisingly straightforward. Each new agent feels essentially free — you're already paying for it, and it sits there idle — so you delegate the tedious little task you've been avoiding, and then the next one, and then the one after that. It's not laziness; it's simple economics."

**findings:**
1. `[must-fix]` "The underlying mechanism…" and every sentence start, plus "It's" - capitals in prose → lowercase throughout.
2. `[must-fix]` "— you're already paying for it, and it sits there idle —" - em-dashes → use commas (or parentheses).
3. `[must-fix]` "It's not laziness; it's simple economics." - "not X but Y" negative parallelism, and a manufactured aphoristic bow → cut it, or state one plain fact. also a semicolon doing antithesis, out of register.
4. `[judgement]` "once you examine it closely, is surprisingly straightforward" / "essentially free" / "delegate" / "tedious" - measured-excess and elevated diction stacked → plainer words ("once you lay it out", "feels free", "hand it", "annoying").
5. `[judgement]` cadence is uniform (three ~18-24-word sentences in a row) → land the paragraph on a short line.

**after - the real passage (`holding-has-no-shape`), which fixes all of the above:**

> "the mechanism is fairly dumb once you lay it out. every new agent feels free, because you're already paying for it and it's sitting there idle, so you hand it the annoying little task you've been avoiding and then the one after that."

Note what the real version does: all lowercase; zero em-dashes (commas and an `and`-chain instead); plain diction ("fairly dumb", "feels free", "hand it", "annoying"); no manufactured aphorism; and it rides one long `and`/`so`/`because` chain rather than three even sentences. **verdict on the before:** does not read as him - capitals and em-dashes break it on sight, and the "not laziness; it's economics" bow is the loudest AI tell. lowercase it, kill the dashes, cut the closing aphorism.

## severity and false positives (do not over-flag)

- **must-fix:** any surface-mechanics miss (pass 1); any of the five banned patterns; "studies show" / unnamed source.
- **judgement:** the measured-excess words (delve, robust, seamless, nuanced, leverage, myriad, testament, realm, pivotal, crucial) are **not** auto-fails - they are ordinary English. flag them only when **stacked** (three-plus clustering in a passage) or when clearly the reflex rather than a chosen word. one "robust" is not a finding.
- **do not flag as errors:** his long comma-splices and `and`-chain run-ons (the sprawl is the voice); a short sentence that carries a real concrete fact (that is his rhythm, not staccato-for-drama); a comma before "but"; entrenched-CS-jargon american spellings (optimization, modeling); the near-miss qualifier ("almost exactly"), the "so [wh] … ." pivot, and paragraph-initial "and"/"but"/"so"/"which" - all of these are *his*, not tells.
- if the draft was produced by Claude, look hardest at the **ending and the edge**: newer models drift warm, agreeable and resolved, sanding off the undercut ending and the willingness to leave a real edge. a draft that "reads pleasant and resolved" usually needs the ungenerous judgement and the unresolved doubt put back.

## the two-second gate (if you check only three things)

1. is it **all lowercase with no em-dashes**? 2. does the **rhythm swing hard**, or march at one length? 3. is it **full of specific real named/dated/numbered things**, by scene and not by label? those three carry most of the voice and most of the anti-AI signal at once.

---

Companion skill: **`write-haider-voice`** drafts new prose in this voice from scratch. Use it when generating rather than auditing.
