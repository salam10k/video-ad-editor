---
name: voice
description: Teach Claude the business owner's writing voice, humor, opinions, stats and stories by extracting them from pasted samples (LinkedIn posts, emails, WhatsApp replies, video transcripts, articles they like) into the references/ files. Use when the user types /voice, pastes writing samples, or says the content doesn't sound like them.
---

# /voice — make every page sound like the owner

1. Ask for (or take what was pasted): 3–5 samples written by the owner, and optionally 1–2 passages by others whose style they love.
2. Extract and **update** (merge, don't wipe) these files:
   - `references/voice.md` — tone, sentence length, dialect, recurring phrases, how they address customers.
   - `references/humor.md` — the kind of jokes they make, examples quoted from the samples, limits.
   - `references/opinions.md` — strong views they expressed.
   - `references/stats.md` — any real numbers they mentioned (years, jobs, ratings, prices). Never infer numbers.
   - `references/stories.md` — anecdotes, summarized in the file's format.
3. Show a 3-line before/after: rewrite the opening of the newest blog post in the new voice, so they can approve it.
4. If they approve, offer to refresh existing posts with `/blog`'s on-page pass (keep keywords and links).
