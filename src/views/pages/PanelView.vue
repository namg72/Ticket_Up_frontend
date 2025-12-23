<script setup lang="ts">
import { downloadTicketImage, getTicketImage, getTickets } from '@/services/ticketService'
import { useAuthStore } from '@/stores/auth'
import type { PanelResponse } from '@/types/panel'
import { onMounted, ref } from 'vue'
import {
  Picture as IconPicture,
  Edit as IconEdit,
  Download as IconDownload,
} from '@element-plus/icons-vue'
import { formatDate } from '@/Helpers/dateFormatter'

const dashboardData = ref<PanelResponse | null>(null)
const loading = ref(true)
const auth = useAuthStore()

// Estados para el Modal
const showImageDialog = ref(false)
const currentImageUrl = ref<string | null>(null)
const currentTicketId = ref<number | null>(null)
const loadingImage = ref(false)

const handleDownload = async () => {
  if (currentTicketId.value) {
    try {
      await downloadTicketImage(currentTicketId.value, `ticket_${currentTicketId.value}.jpg`)
    } catch (error) {
      console.error('Error en la descarga:', error)
    }
  }
}
const currentPage = ref(1)
const totalTickets = ref(0)
const pageSize = ref(10)

const fetchTickets = async (page = 1) => {
  loading.value = true
  try {
    const response = await getTickets(page)

    // IMPORTANTE: Según tu JSON, los datos están en la raíz de la respuesta
    dashboardData.value = response

    // Accedemos al objeto 'tickets' que viene en el JSON para la paginación
    totalTickets.value = response.tickets.total
    currentPage.value = response.tickets.current_page
    pageSize.value = response.tickets.per_page
  } catch (error) {
    console.error('Error cargando tickets:', error)
  } finally {
    loading.value = false
  }
}
const handlePageChange = (val: number) => {
  fetchTickets(val)
}

// En openImageModal, asegúrate de usar window.URL
const openImageModal = async (row: any) => {
  loadingImage.value = true
  currentTicketId.value = row.id
  try {
    if (currentImageUrl.value) window.URL.revokeObjectURL(currentImageUrl.value)
    currentImageUrl.value = await getTicketImage(row.id)
    showImageDialog.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loadingImage.value = false
  }
}
const handleCloseModal = () => {
  if (currentImageUrl.value) {
    // Aquí TypeScript reconoce window sin problemas
    window.URL.revokeObjectURL(currentImageUrl.value)
  }
  // Limpiamos los estados
  currentImageUrl.value = null
  currentTicketId.value = null
}

onMounted(() => {
  fetchTickets()
})
</script>
<template>
  <div class="py-8">
    <div class="w-4/5 mx-auto space-y-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <p class="text-sm text-gray-500">Usuario</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">
                {{ auth.user?.name }}
              </p>
            </div>
            <div v-if="auth.user?.roles?.some((r) => r.name === 'employee')">
              <p class="text-sm text-gray-500">Supervisor</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">
                {{ auth.user?.supervisor?.name }}
              </p>
            </div>
          </div>

          <p class="mt-4 text-sm text-gray-500">Tickets totales</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">
            {{ dashboardData?.ticketsCounts?.totalTickets }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <p class="text-lg font-semibold text-gray-900">Gastos Totales Mensuales</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-xs uppercase text-gray-500">Pendientes</p>
          <p class="mt-2 text-2xl font-bold text-gray-900">
            {{ dashboardData?.ticketsCounts?.pending }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-xs uppercase text-gray-500">En revisión</p>
          <p class="mt-2 text-2xl font-bold text-gray-900">
            {{ dashboardData?.ticketsCounts?.review }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-xs uppercase text-gray-500">Aprovados</p>
          <p class="mt-2 text-2xl font-bold text-gray-900">
            {{ dashboardData?.ticketsCounts?.approved }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-xs uppercase text-gray-500">Rechazados</p>
          <p class="mt-2 text-2xl font-bold text-gray-900">
            {{ dashboardData?.ticketsCounts?.rejected }}
          </p>
        </div>
      </div>

      <div class="mt-16"></div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <p class="text-lg font-semibold text-gray-900">Tickets</p>

          <el-link>
            <el-button type="success" v-if="auth.user?.roles?.some((r) => r.name === 'employee')">
              Subir Ticket
            </el-button>
          </el-link>
        </div>

        <div class="mt-4 overflow-x-auto">
          <el-table
            :data="dashboardData?.tickets?.data || []"
            style="width: 100%"
            border
            stripe
            v-loading="loading"
            empty-text="No hay tickets registrados."
          >
            <el-table-column label="Fecha" width="120" sortable>
              <template #default="scope">
                <span>{{ formatDate(scope.row.created_at) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="Empleado"
              width="200"
              v-if="auth.user?.roles?.some((r) => r.name !== 'employee')"
            >
              <template #default="scope">
                <span>{{ scope.row.user?.name || 'N/A' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="title" label="Gasto" width="300" />

            <el-table-column prop="description" label="Concepto" show-overflow-tooltip />

            <el-table-column label="Categoria" width="150">
              <template #default="scope">
                <span>{{ scope.row.category?.name || 'N/A' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="total_amount" label="Importe" width="120" align="right">
              <template #default="scope">
                <span>
                  {{
                    scope.row.total_amount
                      ? `${parseFloat(scope.row.total_amount).toFixed(2)}€`
                      : 'N/A'
                  }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="Estado" width="140">
              <template #default="scope">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full text-white"
                  :class="{
                    'bg-green-500': scope.row.status === 'approved',
                    'bg-red-500': scope.row.status === 'rejected',
                    'bg-yellow-500': scope.row.status === 'review',
                    'bg-violet-500': scope.row.status === 'pending',
                    'bg-gray-400': !scope.row.status,
                  }"
                >
                  <span v-if="scope.row.status === 'approved'">Aprobado</span>
                  <span v-else-if="scope.row.status === 'rejected'">Rechazado</span>
                  <span v-else-if="scope.row.status === 'review'">En revisión</span>
                  <span v-else-if="scope.row.status === 'pending'">Pendiente</span>
                  <span v-else>Desconocido</span>
                </span>
              </template>
            </el-table-column>

            <el-table-column
              label="Supervisor"
              width="200"
              v-if="auth.user?.roles?.some((r) => r.name === 'admin')"
            >
              <template #default="scope">
                <span>{{ scope.row.supervisor?.name || 'N/A' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Ticket" width="80" align="center">
              <template #default="scope">
                <el-button
                  v-if="scope.row.uri"
                  :icon="IconPicture"
                  size="small"
                  circle
                  @click="openImageModal(scope.row)"
                />
                <span v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column label="Acciones" width="160" fixed="right" align="center">
              <template #default="scope">
                <router-link :to="`/ticket/${scope.row.id}/edit`" class="mr-2">
                  <el-button size="small" type="primary" :icon="IconEdit" circle />
                </router-link>
              </template>
            </el-table-column>

            <div class="mt-4 flex justify-center">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="totalTickets"
                layout="prev, pager, next, total"
                background
                @current-change="handlePageChange"
              />
            </div>
          </el-table>
          <!-- Paginacion -->
          <div class="mt-4 flex justify-end">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="totalTickets"
              layout="prev, pager, next, jumper"
              background
              @current-change="handlePageChange"
            />
          </div>

          <!-- Modal de tickets -->

          <el-dialog
            v-model="showImageDialog"
            title="Imagen del ticket"
            width="600px"
            @closed="handleCloseModal"
          >
            <div v-loading="loadingImage" class="flex flex-col items-center min-h-75">
              <img
                v-if="currentImageUrl"
                :src="currentImageUrl"
                alt="Imagen del ticket"
                class="max-w-full max-h-100 object-contain rounded shadow"
              />

              <div class="mt-4" v-if="currentImageUrl">
                <el-button type="primary" @click="handleDownload"> Descargar Ticket </el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
