<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Stock de Pedidos</div>
        <q-space />
        <q-input
          v-model="search"
          outlined
          dense
          debounce="200"
          placeholder="Buscar (id, cliente, estado, fecha, prenda, servicio...)"
          class="q-ml-md"
          clearable
          style="max-width: 380px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator class="q-mt-sm" />

      <q-table
        :rows="visiblePedidos"
        :columns="columns"
        row-key="id"
        flat
        bordered
        dense
        :loading="loading"
        class="q-mt-md"
        no-data-label="No hay pedidos"
      >
        <!-- Columna Estado con chip clickeable -->
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip
              clickable
              outline
              dense
              @click.stop="cambiarEstado(props.row)"
              :color="props.row.estado === 'Entregado' ? 'green' : 'red'"
              text-color="white"
            >
              <template v-if="processingId === props.row.id">
                <q-spinner-dots size="18px" />
              </template>
              <template v-else>
                {{ props.row.estado }}
              </template>
            </q-chip>
          </q-td>
        </template>

        <!-- Columna Prendas -->
        <template v-slot:body-cell-prendas="props">
          <q-td :props="props">
            <div v-if="props.row.prendas?.length">
              <div v-for="(p, i) in props.row.prendas" :key="i" class="text-caption">
                • {{ p.nombre }} ({{ p.servicio || '—' }})
              </div>
            </div>
            <div v-else class="text-caption text-grey">—</div>
          </q-td>
        </template>

        <!-- Columna Último cambio -->
        <template v-slot:body-cell-fechaCambioEstado="props">
          <q-td :props="props">
            <span v-if="props.row.fechaCambioEstado">
              {{ formatDate(props.row.fechaCambioEstado) }}
            </span>
            <span v-else class="text-grey">—</span>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const pedidos = ref([])
const loading = ref(false)
const search = ref('')
const processingId = ref(null)

// 🧱 Columnas de la tabla
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  {
    name: 'cliente',
    label: 'Cliente',
    field: (row) => row.cliente?.nombre || '—',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fechaIngreso',
    label: 'Fecha Ingreso',
    field: (row) => formatDate(row.fechaIngreso),
    align: 'left',
    sortable: true,
  },
  {
    name: 'fechaEntrega',
    label: 'Fecha Entrega',
    field: (row) => formatDate(row.fechaEntrega),
    align: 'left',
    sortable: true,
  },
  { name: 'prendas', label: 'Prendas', field: 'prendas', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  {
    name: 'fechaCambioEstado',
    label: 'Último cambio',
    field: (row) => formatDate(row.fechaCambioEstado),
    align: 'left',
    sortable: true,
  },
]

// 🕒 Formateo de fecha
function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString()
}

// 📦 Cargar pedidos desde API
const cargarPedidos = async () => {
  loading.value = true
  try {
    const [resPedidos, resClientes] = await Promise.all([api.get('/pedido'), api.get('/cliente')])

    const pedidosData = resPedidos.data
    const clientesData = resClientes.data

    pedidos.value = pedidosData.map((pedido) => ({
      ...pedido,
      cliente: clientesData.find((c) => c.id === pedido.clienteId) || null,
    }))
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar pedidos' })
  } finally {
    loading.value = false
  }
}

// 🔁 Cambiar estado local y en backend
const cambiarEstado = async (pedido) => {
  if (processingId.value) return
  processingId.value = pedido.id

  const nuevoEstado = pedido.estado === 'Entregado' ? 'Pendiente' : 'Entregado'

  try {
    // PUT al backend
    const res = await api.put(
      `/pedido/${pedido.id}/estado`,
      { nuevoEstado },
      { headers: { 'Content-Type': 'application/json' } },
    )

    // Actualiza localmente sin recargar todo
    pedido.estado = nuevoEstado
    pedido.fechaCambioEstado = res.data?.fechaCambioEstado || new Date()

    $q.notify({
      type: 'positive',
      message: `Estado actualizado a "${nuevoEstado}"`,
    })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'No se pudo actualizar el estado' })
  } finally {
    processingId.value = null
  }
}

// 🔍 Filtro de búsqueda
const visiblePedidos = computed(() => {
  const term = (search.value || '').toLowerCase().trim()
  return pedidos.value.filter((p) => {
    if (!term) return true
    const prendasStr = (p.prendas || [])
      .map((x) => `${x.nombre || ''} ${x.servicio || ''}`)
      .join(' ')
    const clienteStr = `${p.cliente?.nombre || ''}`
    const combined = [
      String(p.id || ''),
      clienteStr,
      String(p.estado || ''),
      formatDate(p.fechaIngreso),
      formatDate(p.fechaEntrega),
      prendasStr,
    ]
      .join(' ')
      .toLowerCase()
    return combined.includes(term)
  })
})

onMounted(() => {
  cargarPedidos()
})
</script>
