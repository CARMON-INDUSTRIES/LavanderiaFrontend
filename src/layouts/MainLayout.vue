<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar superior -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Lavandería Burbuclean</q-toolbar-title>

        <!-- Botones de navegación -->
        <q-btn flat label="Inicio" @click="irA('/principal')" />
        <q-btn flat label="Pedidos" @click="irA('/pedido-lista')" />
        <q-btn flat label="Stock" @click="irA('/stock-pendiente')" />
        <q-btn flat label="Gastos" @click="irA('/gasto')" />
        <q-btn flat label="Pagos Empleados" @click="irA('/pago-empleados')" />
        <q-btn flat label="Resumen Semanal" @click="irA('/resumen-semanal')" />
        <q-btn flat label="Cerrar Sesion" @click="irA('/login')" />
      </q-toolbar>
    </q-header>

    <!-- Contenedor de páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irA = (ruta) => {
  router.push(ruta)
}
</script>

<style scoped>
/* Estilos opcionales para botones de la navbar */
.q-toolbar .q-btn {
  margin-left: 8px;
}
</style>
