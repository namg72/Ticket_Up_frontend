import api from '@/api' // Tu instancia de axios configurada
import type { UpdateTicketPayload } from '@/types/ticket'
import { ChatLineRound } from '@element-plus/icons-vue'

export const getTickets = async (pageNumber: number = 1, filters = {}) => {
  const { data } = await api.get('/tickets', {
    params: {
      page: pageNumber,
      ...filters,
    },
  })
  return data
}

export const getTicketImage = async (ticketId: number): Promise<string> => {
  const response = await api.get(`/tickets/${ticketId}/image`, {
    responseType: 'blob', // Lo volvemos a poner porque es necesario
  })
  return window.URL.createObjectURL(response.data)
}

export const downloadTicketImage = async (ticketId: number, fileName: string = 'ticket.jpg') => {
  const response = await api.get(`/tickets/${ticketId}/image/download`, {
    responseType: 'blob',
  })

  // Lógica de descarga forzada
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  // Limpieza de memoria
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const getTicketById = async (id: number) => {
  return await api.get(`/ticket/show/${id}`)
}

export const updateTicket = async (id: number | string, payload: UpdateTicketPayload) => {
  try {
    const formData = new FormData()

    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('category_id', String(payload.category_id))
    formData.append('total_amount', String(payload.total_amount))

    // Solo adjuntamos la imagen si es una instancia de File (archivo nuevo)
    if (payload.image instanceof File) {
      formData.append('image', payload.image)
    }

    formData.append('_method', 'PUT')
    const { data } = await api.post(`ticket/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  } catch (error) {
    console.error('Error al actualizar el ticket:', error)
    throw error
  }
}
