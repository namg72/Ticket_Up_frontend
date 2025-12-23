<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getTicketById } from '@/services/ticketService'
import { useAuthStore } from '@/stores/auth'
import { computed } from '@vue/reactivity'
import FormTicket from '@/components/ticket/FormTicket.vue'
import TicketComments from '@/components/ticket/TicketComments.vue'

const route = useRoute()
const ticket = ref<any>(null)
const loading = ref(true)
const auth = useAuthStore()

onMounted(async () => {
  const id = Number(route.params.id) // Captura el ID de la URL
  try {
    ticket.value = await getTicketById(id)
    console.log(ticket.value.data.ticket.status)
  } catch (error) {
    console.error('Error al obtener el ticket', error)
  } finally {
    loading.value = false
  }
})
const isStatusDisabled = computed(() => {
  // 1. Verificamos primero si el ticket ya existe. Si no hay ticket, devolvemos true (deshabilitado)
  if (!ticket.value || !ticket.value.data) return true

  const userIsAdmin = auth.user?.roles?.some((r) => r.name === 'admin')
  const finalizedByAdmin = ticket.value.data.ticket.inalized_by_admin === true

  // 2. Si NO es admin y el ticket ya está finalizado, deshabilitamos (true)
  if (!userIsAdmin && finalizedByAdmin) {
    return true
  }

  return false
})

const handleStatus = (number: number) => {}
</script>

<template>
  <div class="w-[95%] lg:w-4/5 mx-auto p-2 md:p-6">
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <div class="w-full lg:basis-3/5 bg-white p-4 md:p-6 shadow rounded-lg">
        <div v-if="ticket">
          <div
            class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 w-full border-b pb-4 gap-4"
          >
            <div class="flex items-center gap-4">
              <h1 class="text-xl md:text-2xl font-bold text-gray-800">
                Ticket Nº {{ ticket.data.ticket.id }}
              </h1>
              <span
                class="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full text-white"
                :class="{
                  'bg-green-500': ticket.data.ticket.status === 'approved',
                  'bg-red-500': ticket.data.ticket.status === 'rejected',
                  'bg-yellow-500': ticket.data.ticket.status === 'review',
                  'bg-violet-500': ticket.data.ticket.status === 'pending',
                }"
              >
                {{ ticket.data.ticket.status }}
              </span>
            </div>

            <div
              v-if="auth.user?.roles?.some((r) => r.name !== 'employee')"
              class="flex flex-wrap gap-2"
            >
              <el-button
                size="small"
                md:size="default"
                type="warning"
                :disabled="isStatusDisabled"
                @click="handleStatus(2)"
              >
                Revisar
              </el-button>
              <el-button
                size="small"
                md:size="default"
                type="success"
                :disabled="isStatusDisabled"
                @click="handleStatus(3)"
              >
                Aprobar
              </el-button>
              <el-button
                size="small"
                md:size="default"
                type="danger"
                :disabled="isStatusDisabled"
                @click="handleStatus(4)"
              >
                Rechazar
              </el-button>
            </div>
          </div>

          <div class="mt-8">
            <form-ticket :ticketData="ticket" :mode="'update'" />
          </div>
        </div>

        <div v-else class="p-10">
          <el-skeleton :rows="5" animated />
        </div>
      </div>

      <div
        class="w-full lg:basis-2/5 bg-gray-50 p-6 shadow rounded-lg border border-gray-200 lg:sticky lg:top-6"
      >
        <h2 class="font-bold text-lg mb-4 text-gray-700 pb-2">Comentarios</h2>
        <TicketComments
          :comments="ticket?.data.ticket?.comments || []"
          :ticket-id="ticket?.data.ticket?.id || null"
          :status="ticket?.data.ticket?.status"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
