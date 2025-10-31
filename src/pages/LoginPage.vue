<template>
  <q-page
    class="flex flex-center"
    style="
      background-image: url('/images/wea.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      min-height: 100vh;
    "
  >
    <q-card
      class="row no-wrap shadow-2"
      style="width: 800px; max-width: 95vw; border-radius: 20px; overflow: hidden"
    >
      <q-card-section
        class="col-12 col-md-6 q-pa-xl flex flex-center"
        style="background-color: white"
      >
        <q-form
          @submit.prevent="handleLogin"
          ref="loginForm"
          class="q-gutter-md"
          style="width: 100%; max-width: 350px"
        >
          <!-- Logo -->
          <div class="flex flex-center q-mb-md">
            <q-img
              src="/images/logo.jpg"
              style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover"
            />
          </div>

          <!-- Títulos -->
          <div class="text-h5 text-dark text-bold text-center q-mb-sm">Iniciar Sesión</div>
          <div class="text-caption text-grey-7 text-center q-mb-lg" style="color: #555">
            Bienvenido, ingresa tus credenciales para continuar
          </div>

          <!-- Inputs -->
          <q-input
            filled
            v-model="usuario"
            label="Usuario"
            type="text"
            dense
            class="q-mb-md custom-input"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="grey-7" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            lazy-rules
            :rules="[(val) => !!val || 'Campo requerido']"
            dense
            class="q-mb-sm custom-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-7" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Botón login -->
          <q-btn
            label="INGRESAR"
            color="blue"
            text-color="white"
            class="custom-btn"
            unelevated
            type="submit"
            :loading="loading"
            style="width: 95%"
          />
        </q-form>
      </q-card-section>

      <!-- 🖼 Imagen decorativa: solo visible en pantallas medianas o mayores -->
      <q-card-section
        v-if="$q.screen.gt.sm"
        class="col-6 flex flex-center"
        style="background-color: white"
      >
        <q-img
          src="/images/lavadora.jpg"
          style="max-width: 100%; max-height: 400px; border-radius: 20px; object-fit: cover"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { jwtDecode } from 'jwt-decode'

const usuario = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const $q = useQuasar()
const loginForm = ref(null)

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loginForm.value?.submit()
    }
  })
})

const handleLogin = async () => {
  try {
    const response = await api.post('/Auth/login', {
      usuario: usuario.value,
      password: password.value,
    })

    const token = response.data.token
    localStorage.setItem('token', token)

    // Decodificar token para obtener el rol
    const decoded = jwtDecode(token)
    const rol = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    localStorage.setItem('rol', rol)

    $q.notify({ type: 'positive', message: `Buenos dias, Usuario!` })
    router.replace('/principal')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || 'Verifica tu conexión a internet o contacta a soporte',
    })
    console.error(error)
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: url('/images/bien.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  max-width: 900px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-side {
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.img-side {
  background: #fff;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.custom-input :deep(.q-field__control:hover),
.custom-input :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 2px rgba(105, 27, 49, 0.4);
}

.custom-btn {
  border-radius: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  background: linear-gradient(100deg, #0077ff, #ff00ff);
  color: #fff;
  box-shadow: 0 4px 12px rgba(105, 27, 49, 0.3);
  transition: all 0.2s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
}
</style>
