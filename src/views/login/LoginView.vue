<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { loginRules } from '@/utils/validators/authRules'

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()
const rules = loginRules

// 1. Datos del formulario
const loginForm = reactive({
  email: '',
  password: '',
})

// 3. Lógica de envío
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid: any) => {
    if (valid) {
      loading.value = true
      try {
        await auth.login(loginForm)
        router.push('/')
      } catch (error) {
        // Aquí podrías usar ElMessage para errores
        console.error('Error de login')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="text-center font-bold text-xl text-primary">TickeUP Login</h2>
      </template>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        @keyup.enter="submitForm(loginFormRef)"
      >
        <el-form-item label="Correo Electrónico" prop="email">
          <el-input v-model="loginForm.email" placeholder="admin@tickeup.com" />
        </el-form-item>

        <el-form-item label="Contraseña" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="********"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full mt-4"
          :loading="loading"
          @click="submitForm(loginFormRef)"
        >
          Iniciar Sesión
        </el-button>
      </el-form>
      <div class="mt-6 text-center">
        <span class="text-gray-500 text-sm">¿No tienes cuenta? </span>
        <router-link
          to="/Register"
          class="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
        >
          Regístrate aquí
        </router-link>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
@reference "../../assets/main.css";
.login-container {
  @apply flex min-h-screen items-center justify-center bg-gray-100;
}
.login-card {
  @apply w-full max-w-md shadow-lg;
}
</style>
