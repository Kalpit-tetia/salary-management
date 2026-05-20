import { createApp } from './app'
import prisma from './lib/prisma'

const PORT = process.env.PORT || 3001

const app = createApp()

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
