import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// This is needed for development
if (process.env.NODE_ENV === 'development') {
    worker.events.on('unhandledException', (error) => {
        console.error('MSW Error:', error)
    })
} 