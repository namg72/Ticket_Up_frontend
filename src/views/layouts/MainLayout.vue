<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  // 1. Llamamos a la acción logout del store (que limpia el estado y localStorage)
  auth.logout()

  // 2. Redirigimos al login
  router.push('/login')
}
</script>

<template>
  <div class="common-layout">
    <el-container class="min-h-screen bg-gray-100">
      <el-header
        class="bg-white border-b border-gray-200 flex items-center justify-between px-8 h-20"
      >
        <div class="flex items-center gap-8">
          <div class="font-bold text-primary text-xl tracking-tight">TickeUP</div>

          <nav class="hidden md:flex gap-4">
            <router-link to="/" class="text-sm font-medium text-gray-600 hover:text-primary">
              Panel
            </router-link>
          </nav>
        </div>

        <div class="flex items-center">
          <el-dropdown trigger="click">
            <div class="flex items-center cursor-pointer outline-none gap-2">
              <el-avatar :size="32" class="bg-primary text-white font-bold">
                {{ auth.user?.name?.charAt(0).toUpperCase() }}
              </el-avatar>

              <div class="flex flex-col items-start leading-tight">
                <span class="text-sm font-semibold text-gray-700">
                  {{ auth.user?.name || 'Cargando...' }}
                </span>
                <span class="text-xs text-gray-500 capitalize">
                  {{ auth.user?.role || 'Usuario' }}
                </span>
              </div>
              <el-icon class="text-gray-400"><ArrowDown /></el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')"> Mi Perfil </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout" class="text-danger">
                  Cerrar Sesión
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <div class="mx-auto max-w-7xl">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped></style>
