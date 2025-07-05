import { BASE_API_URL, API_ENDPOINTS } from './apis/api.constants'
import { Notification } from '../types/notification'

export class WebSocketService {
    private ws: WebSocket | null = null
    private wsToken: string | null = null
    private reconnectTimeout: NodeJS.Timeout | null = null
    private onMessageCallback: ((notification: Notification) => void) | null = null
    private onConnectionChangeCallback: ((isConnected: boolean) => void) | null = null

    constructor(
        onMessage: (notification: Notification) => void,
        onConnectionChange: (isConnected: boolean) => void
    ) {
        this.onMessageCallback = onMessage
        this.onConnectionChangeCallback = onConnectionChange
    }

    private async getWebSocketToken(): Promise<string | null> {
        try {
            const token = localStorage.getItem('user_token')
            if (!token) return null

            const response = await fetch(`${BASE_API_URL}${API_ENDPOINTS.USER.WS_TOKEN}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error('Failed to get WebSocket token')

            const data = await response.json()
            this.wsToken = data.access
            return data.access
        } catch (error) {
            console.error('Error getting WebSocket token:', error)
            return null
        }
    }

    private async refreshWsToken(): Promise<void> {
        try {
            const wsToken = await this.getWebSocketToken()
            if (!wsToken) {
                throw new Error('Failed to refresh WebSocket token')
            }

            if (this.ws) {
                this.ws.close()
            }
            await this.connect()
        } catch (error) {
            console.error('Failed to refresh WebSocket token:', error)
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout)
            }
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000)
        }
    }

    public async connect(): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN) return

        const wsToken = await this.getWebSocketToken()
        if (!wsToken) {
            console.error('Failed to get WebSocket token')
            return
        }

        const wsUrl = `${BASE_API_URL.replace('http', 'ws')}/ws/notifications/`
        const socket = new WebSocket(wsUrl, ['Bearer', wsToken])
        this.ws = socket

        socket.onopen = () => {
            this.onConnectionChangeCallback?.(true)
            console.log('WebSocket connected')

            // Set up token refresh interval (25 minutes)
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout)
            }
            this.reconnectTimeout = setTimeout(() => this.refreshWsToken(), 25 * 60 * 1000)
        }

        socket.onclose = () => {
            this.onConnectionChangeCallback?.(false)
            console.log('WebSocket disconnected')

            // Attempt to reconnect
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout)
            }
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000)
        }

        socket.onmessage = (event) => {
            console.log(event)
            try {
                const data = JSON.parse(event.data)
                this.onMessageCallback?.(data)
            } catch (e) {
                console.error('Error parsing WebSocket message:', e)
            }
        }

        socket.onerror = (err) => {
            console.error('WebSocket error:', err)
            this.onConnectionChangeCallback?.(false)
        }
    }

    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
        }
        this.ws?.close()
        this.onConnectionChangeCallback?.(false)
    }

    public async markNotificationAsRead(notificationId: string): Promise<void> {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) return

            const response = await fetch(
                `${BASE_API_URL}${API_ENDPOINTS.USER.NOTIFICATION_MARK_READ(notificationId)}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!response.ok) throw new Error('Failed to mark notification as read')
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }
}
