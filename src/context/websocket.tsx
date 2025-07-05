import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { Notification, NotificationStatus, WebSocketContextType } from '../types/notification'
import { WebSocketService } from '../lib/websocket'

// Create context with default values
const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    notifications: [],
    connect: async () => {},
    disconnect: () => {},
    markNotificationAsRead: async () => {},
    clearNotifications: () => {}
})

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const wsServiceRef = useRef<WebSocketService | null>(null)

    const handleNewNotification = useCallback((notification: Notification) => {
        console.log(notification)
        setNotifications((prev) => [notification, ...prev])
    }, [])

    const handleConnectionChange = useCallback((connected: boolean) => {
        setIsConnected(connected)
    }, [])

    const connect = useCallback(async () => {
        if (!wsServiceRef.current) {
            wsServiceRef.current = new WebSocketService(
                handleNewNotification,
                handleConnectionChange
            )
        }
        await wsServiceRef.current.connect()
    }, [handleNewNotification, handleConnectionChange])

    const disconnect = useCallback(() => {
        wsServiceRef.current?.disconnect()
    }, [])

    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        await wsServiceRef.current?.markNotificationAsRead(notificationId)
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === Number(notificationId)
                    ? { ...notification, status: NotificationStatus.READ }
                    : notification
            )
        )
    }, [])

    const clearNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [connect, disconnect])

    return (
        <WebSocketContext.Provider
            value={{
                isConnected,
                notifications,
                connect,
                disconnect,
                markNotificationAsRead,
                clearNotifications
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider')
    }
    return context
}
