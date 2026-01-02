<template>
  <q-page padding style="background-color: #91ffff">
    <q-card flat bordered>
      <q-card-section class="row items-center">
        <div class="text-h6">Lista de Clientes</div>
        <q-space />
        <q-btn color="primary" icon="refresh" label="Recargar" flat @click="obtenerClientes" />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="clientes"
          :columns="columns"
          row-key="id"
          :loading="loading"
          no-data-label="No hay clientes registrados"
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" align="center">
              <q-btn
                color="negative"
                icon="delete"
                size="sm"
                flat
                round
                @click="confirmarBorrado(props.row)"
              >
                <q-tooltip>Eliminar cliente</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

export default {
  name: 'ListaClientes',
  setup() {
    const $q = useQuasar()

    const clientes = ref([])
    const loading = ref(false)

    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'left' },
      { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
      { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' },
      { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
      { name: 'acciones', label: 'Acciones', align: 'center' },
    ]

    const obtenerClientes = async () => {
      loading.value = true
      try {
        const { data } = await api.get('/cliente')
        clientes.value = data
      } catch (error) {
        console.error('Error al obtener clientes', error)
        $q.notify({
          type: 'negative',
          message: 'Error al cargar clientes',
        })
      } finally {
        loading.value = false
      }
    }

    const confirmarBorrado = (cliente) => {
      $q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Eliminar al cliente "${cliente.nombre}"?`,
        cancel: true,
        persistent: true,
      }).onOk(() => borrarCliente(cliente.id))
    }

    const borrarCliente = async (id) => {
      try {
        await api.delete(`/cliente/${id}`)
        clientes.value = clientes.value.filter((c) => c.id !== id)
        $q.notify({
          type: 'positive',
          message: 'Cliente eliminado correctamente',
        })
      } catch (error) {
        console.error('Error al borrar cliente', error)
        $q.notify({
          type: 'negative',
          message: 'No se pudo eliminar el cliente',
        })
      }
    }

    onMounted(() => {
      obtenerClientes()
    })

    return {
      clientes,
      columns,
      loading,
      obtenerClientes,
      confirmarBorrado,
    }
  },
}
</script>
