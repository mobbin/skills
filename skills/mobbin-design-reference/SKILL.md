---
name: mobbin-design-reference
description: Search Mobbin for real app UI screenshots and download them locally so Claude can visually analyze them. Use this skill whenever the user asks about UI/UX design patterns, wants to see how other apps handle a specific screen or flow, needs design inspiration or references, asks to compare UI approaches across apps, or mentions Mobbin. Trigger aggressively for any design-related question where seeing real-world examples would help — even if the user doesn't explicitly ask for screenshots.
---

# Mobbin Design Reference

Search Mobbin's library of real app screenshots, download them locally, and visually analyze them before responding to the user's design question.

## Why this skill exists

Claude can read images from local files but cannot view URLs directly. Without this skill, when the MCP tool returns image URLs, Claude tends to gloss over them and never actually looks at the image content. This skill ensures Claude **downloads and reads every image** so it can give informed, visually-grounded design feedback.

## Workflow

### 1. Understand the query

Figure out what the user is looking for. Extract:
- **Search query** — what to search Mobbin for (e.g., "onboarding flow", "settings page", "dark mode login")
- **Platform** — `ios` or `web`. Infer from context:
  - Building a Next.js/React/web app → `web`
  - Building a SwiftUI/React Native/mobile app → `ios`
  - Unclear → ask the user
- **Limit** — default to `5`. If the user asks for more variety or explicitly requests more, increase (max 100).

### 2. Search Mobbin

Call `mcp__mobbin__search_screens` with the query, platform, and limit. The `mode` defaults to `deep` (AI-powered relevance scoring) — use this unless the user needs fast results.

### 3. Download images locally

This is the critical step. For each screen returned:

1. Create a `mobbin-screens/` directory at the project root if it doesn't exist
2. Download each image using `curl` or `wget`:
   ```
   mobbin-screens/<AppName>-<first8chars-of-id>.webp
   ```
   Example: `mobbin-screens/N26-d2d13c6f.webp`

Use parallel downloads to save time (e.g., background curl commands or xargs).

If a download fails, retry once. If it still fails, skip that image and continue with the rest — note which images couldn't be downloaded so the user knows. Don't let one failed download block the entire workflow.

### 4. Read every image

Use the `Read` tool on **each downloaded image file**. Do not skip this step. Do not summarize without reading. The whole point is to visually inspect the actual screenshots.

### 5. Present findings and respond

After reading all images:

- **List the screens** with app name, a brief description of what you see in the screenshot, and the Mobbin URL so the user can click through for more context:
  ```
  1. **N26** — Clean single-field login with biometric option. [View on Mobbin](https://mobbin.com/screens/...)
  2. **Bluesky Social** — Social login buttons + email fallback. [View on Mobbin](https://mobbin.com/screens/...)
  ```
- **Then answer the user's actual question** using what you observed in the images. Compare patterns, highlight interesting approaches, call out design details — whatever the user's query demands.

**Ground every observation in what you actually see.** Reference concrete, specific details from the screenshots — exact copy text, element counts, color choices, layout measurements, specific icon styles, button labels. Avoid generic UX platitudes like "clean design" or "good hierarchy" unless you tie them to something visible in the image. If you recognize an app by name, resist the urge to describe what you *think* it looks like from prior knowledge — describe what the screenshot actually shows, which may differ from the app's current or well-known design.

The skill does not prescribe what to do with the images beyond ensuring they're seen. The user might want analysis, comparison, implementation code, or just inspiration. Follow their lead.

### 6. Handle "show me more" follow-ups

If the user wants more results after the initial batch:

1. Search again with a higher limit (e.g., 10-15)
2. Before downloading, check what's already in `mobbin-screens/` — match by the ID portion of the filename (the 8-char hex after the app name)
3. Skip downloading any images that already exist locally
4. Only read the **new** images — no need to re-read ones already discussed
5. Present the new screens alongside a note about which ones were already shown

This avoids duplicate downloads and wasted context while giving the user more variety.

### 7. Cleanup (optional)

The downloaded images remain in `mobbin-screens/` for the user to reference. If the folder is getting large or the user is done, offer to clean it up — but don't delete automatically.
