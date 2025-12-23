export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  supervisor_id: number | null
  is_active: number
  // Spatie devuelve un ARRAY de roles, no un objeto único
  role: string
  roles?: Role[]
  // El supervisor es un objeto con la misma estructura (o al menos id y name)
  supervisor?: User | null
}
