<template>
  <q-page padding style="background-color: #91ffff">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Pagos a Empleados</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Formulario para agregar pago -->
        <q-form @submit.prevent="guardarPago" class="q-gutter-md">
          <q-input
            filled
            v-model="nuevoPago.nombreEmpleado"
            label="Nombre del Empleado"
            outlined
            dense
            :rules="[(val) => !!val || 'Campo requerido']"
          />

          <q-input
            filled
            v-model.number="nuevoPago.monto"
            type="number"
            label="Monto"
            outlined
            dense
            min="0"
            :rules="[(val) => val > 0 || 'Debe ser mayor a 0']"
          />

          <q-input
            filled
            v-model="nuevoPago.fechaPago"
            type="date"
            label="Fecha de Pago"
            outlined
            dense
          />

          <q-input filled v-model="nuevoPago.observaciones" label="Observaciones" outlined dense />

          <q-btn type="submit" label="Agregar Pago" color="primary" />
        </q-form>
      </q-card-section>

      <q-separator class="q-mt-md q-mb-md" />

      <!-- Barra de búsqueda -->
      <q-input filled v-model="filtro" label="Buscar" outlined dense class="q-mb-md" />

      <!-- Tabla de pagos -->
      <q-table
        :rows="pagosFiltrados"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No hay pagos registrados"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const pagos = ref([])
const loading = ref(false)
const filtro = ref('')

const nuevoPago = ref({
  nombreEmpleado: '',
  monto: 0,
  fechaPago: new Date().toISOString().substr(0, 10),
  observaciones: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nombreEmpleado', label: 'Empleado', field: 'nombreEmpleado', align: 'left' },
  {
    name: 'monto',
    label: 'Monto',
    field: 'monto',
    align: 'right',
    format: (val) => `$${val.toFixed(2)}`,
  },
  {
    name: 'fechaPago',
    label: 'Fecha',
    field: (row) => new Date(row.fechaPago).toLocaleDateString(),
    align: 'left',
  },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left' },
]

const obtenerPagos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/pagoempleado')
    pagos.value = data
  } catch (error) {
    console.error('Error al obtener pagos', error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los pagos' })
  } finally {
    loading.value = false
  }
}

const guardarPago = async () => {
  try {
    await api.post('/pagoempleado', nuevoPago.value)
    $q.notify({ type: 'positive', message: 'Pago agregado correctamente' })
    // reiniciar formulario
    nuevoPago.value = {
      nombreEmpleado: '',
      monto: 0,
      fechaPago: new Date().toISOString().substr(0, 10),
      observaciones: '',
    }
    obtenerPagos()
  } catch (error) {
    console.error('Error al guardar pago', error)
    $q.notify({ type: 'negative', message: 'No se pudo guardar el pago' })
  }
}

// Filtrado general por cualquier campo
const pagosFiltrados = computed(() => {
  const term = filtro.value.toLowerCase()
  return pagos.value.filter((p) =>
    Object.values(p).some((val) => String(val).toLowerCase().includes(term)),
  )
})

onMounted(() => {
  obtenerPagos()
})
</script>
