<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

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
      <div class="bg-white border-b border-gray-200 h-20">
        <div class="w-[80%] mx-auto h-full flex items-center justify-start">
          <nav class="hidden md:flex gap-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out h-full"
              active-class="border-indigo-400 text-gray-900 focus:border-indigo-700"
            >
              Panel
            </router-link>
            <router-link
              to="/users"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out h-full"
              active-class="border-indigo-400 text-gray-900 focus:border-indigo-700"
            >
              Gestión de usuarios
            </router-link>
            <router-link
              to="/categories"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out h-full"
              active-class="border-indigo-400 text-gray-900 focus:border-indigo-700"
            >
              Gestión de Gastos
            </router-link>
          </nav>
        </div>
      </div>

      <main class="py-10 bg-gray-100 min-h-screen">
        <div class="w-[80%] mx-auto"><router-view /></div>
      </main>
    </el-container>
  </div>
</template>

<style scoped></style>
