<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { commonRules } from '@/utils/validators/authRules' // Importamos las reglas base
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '', // Campo para repetir
})

const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await auth.register(registerForm)
        router.push('/')
      } catch (error) {
        console.error('Error de login')
      } finally {
        loading.value = false
      }
    }
  })
}

// 1. Función que compara los dos campos
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Por favor, repite la contraseña'))
  } else if (value !== registerForm.password) {
    callback(new Error('Las contraseñas no coinciden'))
  } else {
    callback() // Todo ok
  }
}

// 2. Creamos el objeto de reglas específico para este formulario
const rules = reactive<FormRules>({
  name: commonRules.name,
  email: commonRules.email,
  password: commonRules.password,
  password_confirmation: [
    { required: true, message: 'Confirma tu contraseña', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }, // <--- Usamos la función de arriba
  ],
})
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="text-center font-bold text-xl text-primary">TickeUP Registro</h2>
      </template>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleRegister(registerFormRef)"
      >
        <el-form-item label="Nombre" prop="name">
          <el-input v-model="registerForm.name" type="text" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" type="email" />
        </el-form-item>
        <el-form-item label="Contraseña" prop="password">
          <el-input v-model="registerForm.password" type="password" show-password />
        </el-form-item>

        <el-form-item label="Repetir Contraseña" prop="password_confirmation">
          <el-input v-model="registerForm.password_confirmation" type="password" show-password />
        </el-form-item>

        <el-button type="primary" class="w-full mt-4" @click="handleRegister(registerFormRef)">
          Crear Cuenta
        </el-button>
      </el-form>
      <div class="mt-6 text-center">
        <span class="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
        <router-link
          to="/Login"
          class="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
        >
          Ingresa aquí
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
