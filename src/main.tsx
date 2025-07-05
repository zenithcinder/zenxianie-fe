import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true'

async function prepare() {
    if (TEST_MODE) {
        try {
            const { worker } = await import('./mocks/browser')
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js',
                    options: {
                        scope: '/'
                    }
                }
            })
            console.log('MSW started successfully')
        } catch (error) {
            console.error('Failed to start MSW:', error)
        }
    }
    return Promise.resolve()
}

// Initialize theme before rendering
const root = document.documentElement
const savedTheme = localStorage.getItem('vite-ui-theme')
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark')
} else {
    root.classList.add('light')
}

prepare().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
})
