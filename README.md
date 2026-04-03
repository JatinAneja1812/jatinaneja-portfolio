# Portfolio Template

This repository is now a generic portfolio template.

All profile content, links, timeline details, and blog data are centralized in a single file:

- src/config/templateConfig.ts

## Quick Start

1. Install dependencies:
   npm install

2. Update your content in:
   src/config/templateConfig.ts

3. Run locally:
   npm run dev

4. Build for production:
   npm run build

## What To Edit

Open src/config/templateConfig.ts and update:

- Site metadata and footer text
- About/profile content
- Contact email and social links
- Newsletter copy
- Ability/progress items
- Experience, education, and credentials timeline
- Blog post list and markdown content

## Notes

- Blog posts are local template data (no external provider integration).
- No personal data from the original project remains in source content.
- The previous provider-specific blog service was removed.

## Stack

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Vue Router
- Marked
