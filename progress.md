# Progress — repo now matches the live site (2026-09-18)

## What happened

The repo and raybydays.com had drifted apart. The live site was uploaded straight from the
Vercel CLI as a single static page that never landed in git, while `main` held a Next.js 15 +
MDX app whose design was never deployed. Previewing `main` locally showed the wrong site.

## Done, committed and pushed

- Recovered the live page from Vercel deployment `dpl_4vtTQuaNZTgKmfE2zEDoWFnbnKw1`
  (`index.html` + `vercel.json`), verified byte-for-byte by checksum.
- Replaced the Next.js app with those two files at the repo root — commit `894a7c9`.
- Old app preserved on branch **`nextjs-backup`** (local only, never pushed), including the
  6 hero-redesign commits that had never reached GitHub.
- Rewrote `CLAUDE.md` for the single-page site: stack, palette, fonts, section order, deploy.
- Pushed `main`; Vercel is git-connected, so the push auto-deployed. Live site verified
  unchanged afterwards (same checksum). Deploy docs corrected in `3bd45fc`.

## Current shape

```
index.html     the whole site — inline CSS/JS, GSAP from cdnjs
vercel.json    static config: no framework, no build, output "."
CLAUDE.md      project notes
docs/          design docs from the Next.js era (kept for reference)
PROFILE.md     unanswered bio/voice questionnaire
```

Preview: `python3 -m http.server 3000`. Deploy: push to `main`.

## Follow-ups (optional)

- `nextjs-backup` exists only on this machine — push it if the old app is worth keeping.
- `docs/` still describes the retired Next.js design; delete or archive if it's just noise.
- `PROFILE.md` still unanswered; needed before writing About copy in Ray's voice.

## Standing preference

Show a visual preview (screenshot) before every commit of UI changes, each round — not just
once per task.
