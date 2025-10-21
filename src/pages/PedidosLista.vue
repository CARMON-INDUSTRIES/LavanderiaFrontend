<template>
  <q-page padding style="background-color: #91ffff">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Lista de Pedidos</div>
      </q-card-section>

      <q-card-section>
        <!-- Barra de búsqueda -->
        <q-input v-model="search" label="Buscar..." dense outlined clearable class="q-mb-md">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          :rows="filteredPedidos"
          :columns="columns"
          row-key="id"
          :loading="loading"
          no-data-label="No hay pedidos registrados"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                size="sm"
                label="Ver Detalles"
                @click="abrirModal(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de detalles integrado -->
    <q-dialog v-model="mostrarModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Detalles del Pedido</div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="pedidoSeleccionado?.detalles || []"
            :columns="detalleColumns"
            row-key="tipoPrenda"
            no-data-label="No hay detalles"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="mostrarModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'

export default {
  name: 'ListaPedidos',
  setup() {
    const pedidos = ref([])
    const clientes = ref([])
    const loading = ref(false)
    const mostrarModal = ref(false)
    const pedidoSeleccionado = ref(null)
    const search = ref('')

    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'left' },
      {
        name: 'cliente',
        label: 'Cliente',
        field: (row) => row.cliente?.nombre || '—',
        align: 'left',
      },
      {
        name: 'fechaIngreso',
        label: 'Fecha Ingreso',
        field: (row) => new Date(row.fechaIngreso).toLocaleDateString(),
        align: 'left',
      },
      {
        name: 'fechaEntrega',
        label: 'Fecha Entrega',
        field: (row) => new Date(row.fechaEntrega).toLocaleDateString(),
        align: 'left',
      },
      { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
      {
        name: 'total',
        label: 'Total',
        field: 'total',
        align: 'right',
        format: (val) => `$${val.toFixed(2)}`,
      },
      { name: 'acciones', label: 'Acciones', align: 'center' },
    ]

    const detalleColumns = [
      { name: 'tipoPrenda', label: 'Prenda', field: 'tipoPrenda', align: 'left' },
      { name: 'servicio', label: 'Servicio', field: 'servicio', align: 'left' },
      {
        name: 'precio',
        label: 'Precio',
        field: 'precio',
        align: 'right',
        format: (val) => `$${val.toFixed(2)}`,
      },
    ]

    // Cargar clientes
    const obtenerClientes = async () => {
      try {
        const { data } = await api.get('/cliente')
        clientes.value = data
      } catch (error) {
        console.error('Error al obtener clientes', error)
      }
    }

    // Cargar pedidos y asociar cliente
    const obtenerPedidos = async () => {
      loading.value = true
      try {
        const { data } = await api.get('/pedido')
        pedidos.value = data.map((pedido) => ({
          ...pedido,
          cliente: clientes.value.find((c) => c.id === pedido.clienteId) || null,
        }))
      } catch (error) {
        console.error('Error al obtener pedidos', error)
      } finally {
        loading.value = false
      }
    }

    // Abrir modal y pasar pedido completo
    const abrirModal = (pedido) => {
      pedidoSeleccionado.value = pedido
      mostrarModal.value = true
    }

    const filteredPedidos = computed(() => {
      if (!search.value) return pedidos.value
      const term = search.value.toLowerCase()
      return pedidos.value.filter((pedido) =>
        Object.values(pedido).some((val) => {
          if (val === null || val === undefined) return false
          if (typeof val === 'object') {
            return Object.values(val).some((inner) => String(inner).toLowerCase().includes(term))
          }
          return String(val).toLowerCase().includes(term)
        }),
      )
    })

    onMounted(async () => {
      await obtenerClientes()
      await obtenerPedidos()
    })

    return {
      pedidos,
      loading,
      columns,
      detalleColumns,
      abrirModal,
      mostrarModal,
      pedidoSeleccionado,
      search,
      filteredPedidos,
    }
  },
}
</script>
