import type { FormRules } from 'element-plus'

// Reglas básicas reutilizables
export const commonRules: FormRules = {
  name: [
    { required: true, message: 'El nombre es obligatorio', trigger: 'blur' },
    { min: 3, message: 'El nombre debe tener al menos 3 caracteres', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'El correo electrónico es obligatorio', trigger: 'blur' },
    { type: 'email', message: 'Por favor, introduce un correo válido', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'La contraseña es obligatoria', trigger: 'blur' },
    { min: 8, message: 'La contraseña debe tener al menos 8 caracteres', trigger: 'blur' },
  ],
}

// Reglas específicas para el Login
export const loginRules: FormRules = {
  email: commonRules.email,
  password: commonRules.password,
}
