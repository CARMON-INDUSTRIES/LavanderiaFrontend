<template>
  <q-page padding style="background-color: #91ffff">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Resumen Semanal</div>
      </q-card-section>

      <q-separator class="q-mt-md q-mb-md" />

      <!-- Filtros de fecha -->
      <div class="row q-col-gutter-md q-mb-md">
        <q-input filled v-model="fechaInicio" type="date" label="Semana Inicio" outlined dense />
        <q-input filled v-model="fechaFin" type="date" label="Semana Fin" outlined dense />
        <q-btn label="Filtrar" color="primary" @click="obtenerResumenes" />
      </div>

      <!-- Barra de búsqueda -->
      <q-input filled v-model="filtro" label="Buscar" outlined dense class="q-mb-md" />

      <!-- Tabla resumen semanal -->
      <q-table
        :rows="resumenesFiltrados"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No hay resúmenes registrados"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const resumenes = ref([])
const loading = ref(false)
const filtro = ref('')
const fechaInicio = ref('')
const fechaFin = ref('')

// Columnas de la tabla
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  {
    name: 'semana',
    label: 'Semana',
    field: (row) =>
      `${new Date(row.semanaInicio).toLocaleDateString()} - ${new Date(row.semanaFin).toLocaleDateString()}`,
    align: 'left',
  },
  {
    name: 'totalIngresos',
    label: 'Total Ingresos',
    field: 'totalIngresos',
    align: 'right',
    format: (val) => `$${val.toFixed(2)}`,
  },
  {
    name: 'totalGastos',
    label: 'Total Gastos',
    field: 'totalGastos',
    align: 'right',
    format: (val) => `$${val.toFixed(2)}`,
  },
  {
    name: 'pedidosCompletados',
    label: 'Pedidos Completados',
    field: 'pedidosCompletados',
    align: 'center',
  },
  { name: 'pagosRealizados', label: 'Pagos Realizados', field: 'pagosRealizados', align: 'center' },
  {
    name: 'fechaGeneracion',
    label: 'Fecha Generación',
    field: (row) => new Date(row.fechaGeneracion).toLocaleDateString(),
    align: 'left',
  },
]

// Obtener resúmenes desde la API
const obtenerResumenes = async () => {
  loading.value = true
  try {
    const params = {}
    if (fechaInicio.value) params.fechaInicio = fechaInicio.value
    if (fechaFin.value) params.fechaFin = fechaFin.value

    const { data } = await api.get('/resumen', { params })
    resumenes.value = data
  } catch (error) {
    console.error('Error al obtener resúmenes', error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los resúmenes' })
  } finally {
    loading.value = false
  }
}

// Filtrado general por cualquier campo
const resumenesFiltrados = computed(() => {
  const term = filtro.value.toLowerCase()
  return resumenes.value.filter((r) =>
    Object.values(r).some((val) => String(val).toLowerCase().includes(term)),
  )
})

onMounted(() => {
  obtenerResumenes()
})
</script>
