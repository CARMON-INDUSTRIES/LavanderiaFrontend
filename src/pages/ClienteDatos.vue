<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="guardarCliente" class="q-gutter-md">
      <q-input v-model="cliente.nombre" label="Nombre del cliente" filled />
      <q-input v-model="cliente.telefono" label="Teléfono" filled />
      <q-input v-model="cliente.direccion" label="Direccion" filled />
      <q-btn label="Guardar cliente" color="primary" type="submit" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const cliente = ref({
  nombre: '',
  telefono: '',
  direccion: '',
})

const $q = useQuasar()
const router = useRouter()

const guardarCliente = async () => {
  try {
    await api.post('/cliente', cliente.value)
    $q.notify({ type: 'positive', message: 'Cliente guardado' })
    router.push('/pedido')
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al guardar cliente' })
  }
}
</script>
