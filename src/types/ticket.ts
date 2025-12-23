export interface TicketUser {
  id?: number
  name?: string
  email?: string
}

export interface Ticket {
  id: number
  title: string
  description: string | null
  total_amount: number
  status: string | null
  need_revision: boolean
  created_at: string
  updated_at: string
  user: TicketUser
  category: String[]
  supervisor_id: string
  finalized_by_admin: boolean
  uri: string
}

export interface TicketRow {
  id: number
  uri?: string | null
}

export interface MonthlyExpense {
  month: string
  total: number
}

export interface StatusCounts {
  pending: number
  approved: number
  review: number
  rejected: number
}

export interface FiltersTickets {
  from?: string | null
  to?: string | null
  status?: string | null
  supervisor_id?: number | null
  user_name?: string | null
  category_id?: number | null
}

export interface UpdateTicketPayload {
  title: string
  description: string
  category_id: number | string
  total_amount: number | string
  image?: File | null
  // Añade aquí solo los campos que tu controlador Laravel espera en el Request
}
