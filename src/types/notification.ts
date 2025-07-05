export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read'
}

export interface WebSocketContextType {
    isConnected: boolean
    notifications: Notification[]
    connect: () => Promise<void>
    disconnect: () => void
    markNotificationAsRead: (notificationId: string) => Promise<void>
    clearNotifications: () => void
}

export interface BaseNotification {
    id: number
    type: NotificationType
    message: string
    created_at: string
    is_read: boolean
    recipient: {
        id: number
        username: string
        email: string
    }
}

export enum NotificationType {
    RESERVATION_CREATED = 'reservation_created',
    RESERVATION_UPDATED = 'reservation_updated',
    RESERVATION_CANCELLED = 'reservation_cancelled',
    RESERVATION_COMPLETED = 'reservation_completed',
    RESERVATION_REJECTED = 'reservation_rejected',
    RESERVATION_APPROVED = 'reservation_approved',

    PARKING_LOT_CREATED = 'parking_lot_created',
    PARKING_LOT_UPDATED = 'parking_lot_updated',
    PARKING_LOT_DELETED = 'parking_lot_deleted',

    USER_CREATED = 'user_created',
    USER_UPDATED = 'user_updated',
    USER_DELETED = 'user_deleted',

    PAYMENT_RECEIVED = 'payment_received',
    PAYMENT_REFUNDED = 'payment_refunded',
    PAYMENT_FAILED = 'payment_failed',

    SYSTEM_MAINTENANCE = 'system_maintenance',
    SYSTEM_UPDATE = 'system_update'
}

export interface ReservationNotification extends BaseNotification {
    type:
        | NotificationType.RESERVATION_CREATED
        | NotificationType.RESERVATION_UPDATED
        | NotificationType.RESERVATION_CANCELLED
        | NotificationType.RESERVATION_COMPLETED
        | NotificationType.RESERVATION_REJECTED
        | NotificationType.RESERVATION_APPROVED
    data: {
        reservation_id: number
        parking_lot: {
            id: number
            name: string
            address: string
        }
        start_time: string
        end_time: string
        status: string
        total_amount?: number
    }
}

export interface ParkingLotNotification extends BaseNotification {
    type:
        | NotificationType.PARKING_LOT_CREATED
        | NotificationType.PARKING_LOT_UPDATED
        | NotificationType.PARKING_LOT_DELETED
    data: {
        parking_lot_id: number
        name: string
        address: string
        total_slots: number
        available_slots: number
        rate_per_hour: number
    }
}

export interface UserNotification extends BaseNotification {
    type:
        | NotificationType.USER_CREATED
        | NotificationType.USER_UPDATED
        | NotificationType.USER_DELETED
    data: {
        user_id: number
        username: string
        email: string
        role: string
    }
}

export interface PaymentNotification extends BaseNotification {
    type:
        | NotificationType.PAYMENT_RECEIVED
        | NotificationType.PAYMENT_REFUNDED
        | NotificationType.PAYMENT_FAILED
    data: {
        payment_id: number
        amount: number
        currency: string
        status: string
        reservation_id: number
        payment_method: string
    }
}

export interface SystemNotification extends BaseNotification {
    type: NotificationType.SYSTEM_MAINTENANCE | NotificationType.SYSTEM_UPDATE
    data: {
        maintenance_start?: string
        maintenance_end?: string
        update_version?: string
        update_description?: string
    }
}

export type Notification =
    | ReservationNotification
    | ParkingLotNotification
    | UserNotification
    | PaymentNotification
    | SystemNotification

export interface NotificationChannelMessage {
    type: 'notification'
    notification: Notification
}

export interface NotificationListResponse {
    count: number
    next: string | null
    previous: string | null
    results: Notification[]
}

export interface NotificationCountResponse {
    unread_count: number
    total_count: number
}
