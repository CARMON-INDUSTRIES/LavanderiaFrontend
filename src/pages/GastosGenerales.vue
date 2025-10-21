<template>
  <q-page padding style="background-color: #91ffff">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Gastos</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Formulario para agregar gasto -->
        <q-form @submit.prevent="guardarGasto" class="q-gutter-md">
          <q-input
            filled
            v-model="nuevoGasto.descripcion"
            label="Descripción"
            outlined
            dense
            :rules="[(val) => !!val || 'Campo requerido']"
          />

          <q-input
            filled
            v-model.number="nuevoGasto.monto"
            type="number"
            label="Monto"
            outlined
            dense
            min="0"
            :rules="[(val) => val > 0 || 'Debe ser mayor a 0']"
          />

          <q-input filled v-model="nuevoGasto.fecha" type="date" label="Fecha" outlined dense />

          <q-input filled v-model="nuevoGasto.categoria" label="Categoría" outlined dense />

          <q-btn type="submit" label="Agregar Gasto" color="primary" />
        </q-form>
      </q-card-section>

      <q-separator class="q-mt-md q-mb-md" />

      <!-- Tabla de gastos -->
      <q-input filled v-model="filtro" label="Buscar" outlined dense class="q-mb-md" />

      <q-table
        :rows="gastosFiltrados"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No hay gastos registrados"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const gastos = ref([])
const loading = ref(false)
const filtro = ref('')

const nuevoGasto = ref({
  descripcion: '',
  monto: 0,
  fecha: new Date().toISOString().substr(0, 10), // fecha actual
  categoria: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
  {
    name: 'monto',
    label: 'Monto',
    field: 'monto',
    align: 'right',
    format: (val) => `$${val.toFixed(2)}`,
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: (row) => new Date(row.fecha).toLocaleDateString(),
    align: 'left',
  },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
]

const obtenerGastos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/gasto')
    gastos.value = data
  } catch (error) {
    console.error('Error al obtener gastos', error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los gastos' })
  } finally {
    loading.value = false
  }
}

const guardarGasto = async () => {
  try {
    await api.post('/gasto', nuevoGasto.value)
    $q.notify({ type: 'positive', message: 'Gasto agregado correctamente' })
    // reiniciar formulario
    nuevoGasto.value = {
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().substr(0, 10),
      categoria: '',
    }
    obtenerGastos()
  } catch (error) {
    console.error('Error al guardar gasto', error)
    $q.notify({ type: 'negative', message: 'No se pudo guardar el gasto' })
  }
}

// Filtrado general por cualquier campo
const gastosFiltrados = computed(() => {
  const term = filtro.value.toLowerCase()
  return gastos.value.filter((g) =>
    Object.values(g).some((val) => String(val).toLowerCase().includes(term)),
  )
})

onMounted(() => {
  obtenerGastos()
})
</script>
