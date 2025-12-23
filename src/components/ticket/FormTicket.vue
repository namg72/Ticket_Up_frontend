<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { formatDate } from '@/Helpers/dateFormatter'
import { updateTicket } from '@/services/ticketService'
import router from '@/router'

const props = defineProps<{
  ticketData: any
  mode: string
}>()

const auth = useAuthStore()
const userRole = computed(() => (auth.user as any)?.role)

console.log(props.ticketData)
console.log(auth.user)

// 1. Definimos la estructura del formulario con valores por defecto
const mapTicketData = (apiResponse: any) => {
  // Extraemos el ticket de la estructura anidada de tu JSON
  const ticket = props.ticketData?.data?.ticket

  return {
    created_at: ticket?.created_at ? formatDate(ticket.created_at) : '',
    updated_at: ticket?.updated_at ? formatDate(ticket.updated_at) : '',
    user: ticket?.user?.name || '',
    supervisor: ticket?.supervisor.name || '',
    title: ticket?.title || '',
    total_amount: ticket?.amount ? Number(ticket.amount) : 0,
    description: ticket?.description || '',
    category: ticket?.category.name || '',
    category_id: ticket?.category.id || '',
    imageUri: ticket?.uri || '',
    rawFile: null as File | null, // Para guardar el archivo binario
    newFileName: '',
  }
}

// 2. Inicializamos el formulario (estará vacío al principio si ticketData es null)
const form = ref(mapTicketData(props.ticketData))

// 3. Vigilamos cuando ticketData cambie (cuando llegue la respuesta de la API)
watch(
  () => props.ticketData,
  (newVal) => {
    if (newVal) {
      form.value = mapTicketData(newVal)
    }
  },
  { deep: true, immediate: true },
)

const handleUploadFile = (file: any) => {
  console.log('Evento on-change disparado', file) // <-- Añade este log para probar

  if (!file) return

  // En Element Plus, el archivo seleccionado está en file.raw
  if (file.raw) {
    form.value.rawFile = file.raw
    form.value.newFileName = file.name
    console.log('Archivo capturado con éxito:', file.name)
  }
}

const handleSubmit = async () => {
  // 1. Creamos el objeto con los campos precisos
  const payload = {
    title: form.value.title,
    description: form.value.description,
    category_id: form.value.category_id,
    total_amount: form.value.total_amount,
    // Si usas Element Plus u otro, asegúrate de pasar el archivo File real
    image: form.value.rawFile,
  }

  try {
    // 2. Mandamos solo lo necesario
    const result = await updateTicket(props.ticketData.data.ticket.id, payload)
    form.value.imageUri = result.ticket.uri
    form.value.newFileName = '' // Limpiamos el nombre temporal
    form.value.rawFile = null // Limpiamos el archivo
    toPanelRoute()
  } catch (error) {
    console.error('Error al guardar')
  }
}

const toPanelRoute = () => {
  router.push('/')
}
</script>

<template>
  <el-form :model="form" label-position="top" class="p-4">
    <el-form-item label="Fecha de Alta">
      <el-input v-model="form.created_at" readonly disabled />
    </el-form-item>

    <!-- Visible solo si se ha actualizado (comparando las fechas formateadas) -->
    <el-form-item
      label="Última Actualización"
      v-if="form.updated_at && form.updated_at !== form.created_at"
    >
      <el-input v-model="form.updated_at" readonly disabled />
    </el-form-item>
    <el-form-item label="Título">
      <el-input v-model="form.title" placeholder="Introduce el título" />
    </el-form-item>

    <el-form-item label="Concepto">
      <el-input v-model="form.description" type="textarea" :rows="3" />
    </el-form-item>

    <el-form-item label="Empleado" v-if="userRole !== 'employee'">
      <el-input v-model="form.user" type="text" :rows="3" />
    </el-form-item>
    <el-form-item label="Supervisor" v-if="userRole === 'admin'">
      <el-input v-model="form.supervisor" type="text" :rows="3" />
    </el-form-item>

    <div class="grid grid-cols-2 gap-4">
      <el-form-item label="Importe">
        <el-input-number
          v-model="form.total_amount"
          :precision="2"
          class="w-full"
          :min="1"
          :max="9999"
        />
      </el-form-item>

      <el-form-item label="Categoría">
        <el-select v-model="form.category_id" placeholder="Selecciona" class="w-full">
          <el-option
            v-for="cat in props.ticketData?.data?.categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item label="* Documento">
      <el-upload drag :auto-upload="false" :show-file-list="false" :on-change="handleUploadFile">
        <div class="el-upload__text">
          Arrastra el archivo aquí o
          <em>haz clic para seleccionar</em>
        </div>

        <!-- Mostrar el nombre del archivo nuevo si existe -->
        <div v-if="form.newFileName" class="mt-4 text-blue-600 font-bold">
          <p>Nuevo archivo seleccionado: {{ form.newFileName }}</p>
        </div>

        <div v-else-if="form.imageUri" class="mt-4 text-gray-500">
          <p>Archivo actual en servidor: {{ form.imageUri.split('/').pop() }}</p>
        </div>
        <template #tip>
          <div class="el-upload__tip">Formatos permitidos: PDF, JPG, PNG. Tamaño máximo 2MB.</div>
        </template>
      </el-upload>
    </el-form-item>

    <div class="flex justify-end mt-4" v-if="auth.user?.role === 'employee'">
      <el-button type="primary" @click="handleSubmit">Guardar Ticket</el-button>
    </div>

    <div class="flex justify-end mt-4" v-if="auth.user?.role === 'employee'">
      <el-button type="danger" @click="toPanelRoute">Cancelar</el-button>
    </div>
  </el-form>
</template>
