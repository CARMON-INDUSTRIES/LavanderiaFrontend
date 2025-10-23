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
      <!-- 🧩 Formulario (izquierda en desktop, único en móvil) -->
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
            lazy-rules
            :rules="[(val) => !!val || 'Campo requerido']"
            autofocus
            dense
            class="q-mb-sm"
          />

          <q-input
            filled
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            lazy-rules
            :rules="[(val) => !!val || 'Campo requerido']"
            dense
            class="q-mb-sm"
          >
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
            class="full-width q-mt-lg"
            unelevated
            type="submit"
            style="border-radius: 15px; height: 45px"
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

    $q.notify({ type: 'positive', message: `Inicio de sesión exitoso (${rol})` })
    router.replace('/principal')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al iniciar sesión',
    })
    console.error(error)
  }
}
</script>
