import compress from '@fastify/compress'
import middie from '@fastify/middie'
import fastifyStatic from '@fastify/static'
import fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import * as vite from 'vite'
import { renderPage } from 'vite-plugin-ssr/server'
import { appRouter, createContext } from './trpc'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`


const trpc = {
  prefix: '/api/trpc',
  useWSS: false,
  trpcOptions: { router: appRouter, createContext },
}

startServer()

async function startServer() {
  const app = fastify()

  await app.register(middie)
  await app.register(compress)
  await app.register(fastifyTRPCPlugin, trpc)

  if (isProduction) {
    const distPath = path.join(root, '/build/client/assets')
    app.register(fastifyStatic, {
      root: distPath,
      prefix: '/assets/'
    })
  } else {
    const viteServer = await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
    await app.use(viteServer.middlewares)
  }

  app.get('*', async (req, reply) => {
    const pageContextInit = {
      urlOriginal: req.url
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      return reply.code(404).type('text/html').send('Not Found')
    }

    const { body, statusCode, contentType } = httpResponse

    return reply.status(statusCode).type(contentType).send(body)
  })

  const port: number = process.env.PORT ? +process.env.PORT : 3000

  app.listen({ port })

  console.log(`Server running at http://localhost:${port}`)
}
