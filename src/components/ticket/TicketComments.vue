<script setup lang="ts">
import { watch } from 'vue'
import { Edit as IconEdit, Delete as IconDelete } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  comments: Array<any>
  ticketId: number | null
  status: string
}>()

console.log(props.comments)
console.log(props.status)

const auth = useAuthStore()

watch(
  () => props.comments, // 1. Fuente
  (newComments) => {
    // 2. Función que se ejecuta (FALTABA ESTO)
    console.log('Han llegado nuevos comentarios:', newComments)
  },
  { immediate: true, deep: true }, // 3. Opciones
)

const isCommentAvailable = () => {
  if (props.status === 'approved' || props.status === 'rejected') {
    return false
  } else {
    return true
  }
}
</script>

<template>
  <div v-if="props.comments.length === 0">
    <p>No existen comentarios de este ticket</p>
  </div>

  <div v-if="comments.length">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
    >
      <div class="text-xs text-gray-500 mb-1 m-4">
        {{ comment.user?.name ?? 'Usuario desconocido' }}
        ·
      </div>
      <div class="text-sm bg-white m-4 p-6 flex justify-between items-start">
        {{ comment.message }}

        <span v-if="comment.user_id === auth.user?.id">
          <el-button
            size="small"
            type="primary"
            :icon="IconEdit"
            circle
            :disabled="!isCommentAvailable()"
          />
        </span>
      </div>
    </div>
  </div>

  <div class="flex justify-end mt-8">
    <el-button type="success" :disabled="!isCommentAvailable()"> Crear comentario </el-button>
  </div>
</template>

<style scoped></style>
