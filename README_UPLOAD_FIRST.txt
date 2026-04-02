LIBBY REPO DRAG-DROP MASTER PACK

Purpose
- This pack is designed to be dropped directly into the root of `libbynatico/libby_live`.
- It is not a placeholder pack.
- It is a canon + automation + Patient Zero + operator pack.

What this pack assumes is already true
- Netlify deploy works
- Repo root is the publish root
- Netlify Functions live in `netlify/functions`
- Secrets are already stored in Netlify
- OpenRouter is called only from the serverless function
- Supabase public auth config already exists in `index.html`

Recommended upload order
1. Root files:
   - README.md
   - CHANGELOG.md
   - CLAUDE.md
   - .env.example
   - netlify.toml
2. docs/
3. .github/
4. Review in GitHub commit summary before merging

Do not do
- Do not paste secrets into GitHub
- Do not rotate secrets just because this pack exists
- Do not convert the app to Next.js
- Do not add packages or a build step unless a later round proves it is required

Primary next use
- Upload this pack into the repo
- Let Claude read CLAUDE.md and docs/ before touching the UI again
- Use docs/OPENROUTER_SETUP_AND_CHATBOT_WIRING.md if the chatbot needs to be rechecked
- Use docs/NEXT_ACTIONS_FOR_CLAUDE.md as the immediate run brief
