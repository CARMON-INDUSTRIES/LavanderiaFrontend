<template>
  <q-page padding class="bg-grey-2">
    <q-form @submit.prevent="registrarUsuario" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md" style="max-width: 600px; margin: auto">
        <q-card-section>
          <div class="text-h5 text-center">Registro de Usuario</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.user" label="Usuario" filled required />
          <q-input v-model="form.password" label="Contraseña" type="password" filled required />
          <q-input v-model="form.email" label="Correo electrónico" type="email" filled />
          <q-input v-model="form.nombreCompleto" label="Nombre completo" filled />

          <q-select
            v-model="form.rol"
            :options="roles"
            label="Rol"
            filled
            emit-value
            map-options
            required
          />

          <q-select
            v-model="form.unidadAdministrativaId"
            :options="unidades"
            label="Unidad Administrativa"
            option-value="id"
            option-label="unidad"
            filled
            emit-value
            map-options
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Registrar" color="primary" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const form = ref({
  user: '',
  password: '',
  email: '',
  nombreCompleto: '',
  rol: '',
  unidadAdministrativaId: null,
})

const roles = ['Admin', 'Usuario']
const unidades = ref([])
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await api.get('/UnidadAdministrativa') // Asegúrate de tener este endpoint en tu API
    unidades.value = res.data
  } catch (error) {
    console.error('Error al cargar unidades:', error)
  }
})

async function registrarUsuario() {
  loading.value = true
  try {
    await api.post('/Cuentas/Registro', form.value)
    Notify.create({ type: 'positive', message: 'Usuario registrado exitosamente' })
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al registrar',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
