<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Lavandería Burbuclean</q-toolbar-title>

        <!-- Botones visibles según rol -->
        <q-btn flat label="Inicio" @click="irA('/principal')" />

        <q-btn flat label="Pedidos" @click="irA('/pedido-lista')" />
        <q-btn flat label="Stock" @click="irA('/stock-pendiente')" />

        <q-btn v-if="esAdmin" flat label="Gastos" @click="irA('/gasto')" />
        <q-btn v-if="esAdmin" flat label="Pagos Empleados" @click="irA('/pago-empleados')" />
        <q-btn v-if="esAdmin" flat label="Resumen Semanal" @click="irA('/resumen-semanal')" />

        <q-btn flat label="Cerrar Sesión" @click="cerrarSesion" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue' // 👈 Agregado aquí

const router = useRouter()
const rol = ref(null)

onMounted(() => {
  rol.value = localStorage.getItem('rol')
})

const esAdmin = computed(() => rol.value === 'Admin')

const irA = (ruta) => {
  router.push(ruta)
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('rol')
  router.replace('/')
}
</script>
