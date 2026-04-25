import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function loadLocalEnv() {
  const envPath = resolve(__dirname, '.env')
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()
      value = value.replace(/^["']|["']$/g, '')
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
}
loadLocalEnv()

const localDevApi = (): PluginOption => ({
  name: 'local-dev-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/chat') || req.method !== 'POST') {
        return next()
      }

      const apiKey = process.env.GEMINI_API_KEY

      if (!apiKey || apiKey === 'your-api-key-here') {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        return res.end('GEMINI_API_KEY not configured. Copy .env.example to .env and set your key.')
      }

      try {
        const chunks: Buffer[] = []
        for await (const chunk of req as AsyncIterable<Buffer>) {
          chunks.push(chunk)
        }
        const body = JSON.parse(Buffer.concat(chunks).toString())
        const question = body?.question
        if (!question || typeof question !== 'string' || !question.trim()) {
          res.writeHead(400, { 'Content-Type': 'text/plain' })
          return res.end('Provide a non-empty "question" field.')
        }

        const cvPath = resolve(__dirname, 'public', 'cv.md')
        let cvContent = ''
        try {
          cvContent = readFileSync(cvPath, 'utf-8')
        } catch {
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          return res.end('Unable to load CV content.')
        }

        const systemInstruction = `You are a helpful assistant about Jatin Aneja's CV. Answer only from the provided context. If something isn't in the CV, say you don't know. Keep answers concise.`
        const userMessage = `CV CONTENT:\n---\n${cvContent}\n---\nQUESTION: ${question.trim()}`

        const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }],
          }),
        })

        if (!geminiResp.ok) {
          const errBody = await geminiResp.text()
          console.error('[Gemini Error]', geminiResp.status, errBody.slice(0, 200))
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          return res.end(`Gemini API failed (${geminiResp.status})`)
        }

        const data = await geminiResp.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        if (!text) {
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          return res.end('Empty response from Gemini API.')
        }

        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        return res.end(text)
      } catch (error) {
        console.error('[Chat Function Error]', error)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        return res.end(error instanceof Error ? error.message : 'Internal error')
      }
    })
  },
})

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/jatinaneja-portfolio/' : '/',
  plugins: [vue(), localDevApi()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
}))