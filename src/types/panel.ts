import type { Ticket } from './ticket'
import type { User } from './user'

export interface PanelResponse {
  tickets: {
    current_page: number
    data: Ticket[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string | null
    prev_page_url: string | null
    total: number
    per_page: number
  }
  user_supervisor: User | null
  filters: {
    year: number | null
    month: number | null
    user_id: number | null
  }
  years: number[]
  users: User[]
  ticketsCounts: {
    totalTickets: number
    pending: number
    approved: number
    review: number
    rejected: number
  }
}
