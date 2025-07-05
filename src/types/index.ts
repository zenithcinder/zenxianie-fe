export interface User {
  id: number
  username: string
  email: string
  is_staff: boolean
}

export interface ParkingLocation {
  id: number
  name: string
  address: string
  total_slots: number
  available_slots_count: number
  created_at: string
  updated_at: string
}

export interface ParkingSlot {
  id: number
  location: number
  slot_number: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: number
  user: number
  slot: number
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
} 