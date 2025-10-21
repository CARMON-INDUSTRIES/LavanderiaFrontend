<template>
  <q-dialog v-model="value" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Detalles del Pedido #{{ pedidoId }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="detalles"
          :columns="columns"
          row-key="id"
          :loading="loading"
          no-data-label="No hay detalles para este pedido"
          dense
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import { api } from 'boot/axios'

export default {
  name: 'ModalDetallesPedido',
  props: {
    modelValue: Boolean,
    pedidoId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const value = ref(props.modelValue)
    const detalles = ref([])
    const loading = ref(false)

    const columns = [
      { name: 'tipoPrenda', label: 'Tipo Prenda', field: 'tipoPrenda', align: 'left' },
      { name: 'servicio', label: 'Servicio', field: 'servicio', align: 'left' },
      {
        name: 'precio',
        label: 'Precio',
        field: 'precio',
        align: 'right',
        format: (val) => `$${val.toFixed(2)}`,
      },
    ]

    const obtenerDetalles = async () => {
      if (!props.pedidoId) return
      loading.value = true
      try {
        const { data } = await api.get(`/detallepedido`, {
          params: { pedidoId: props.pedidoId },
        })
        detalles.value = data
      } catch (error) {
        console.error('Error al obtener detalles del pedido', error)
      } finally {
        loading.value = false
      }
    }

    // Reaccionar a apertura del modal
    watch(
      () => props.modelValue,
      (val) => {
        value.value = val
        if (val) obtenerDetalles()
      },
    )

    // Emitir cambios para cerrar el modal
    watch(value, (val) => emit('update:modelValue', val))

    return {
      value,
      detalles,
      loading,
      columns,
    }
  },
}
</script>
