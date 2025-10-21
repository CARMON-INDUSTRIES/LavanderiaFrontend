<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Registrar Pedido</div>
        <!-- Botón para abrir modal -->
        <q-btn label="Agregar Cliente" color="primary" @click="modalCliente = true" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="guardarPedido" class="q-gutter-md">
          <!-- Cliente -->
          <q-select
            v-model="pedido.clienteId"
            :options="clientes"
            option-label="nombre"
            option-value="id"
            label="Seleccionar Cliente"
            outlined
            dense
            emit-value
            map-options
            :loading="cargandoClientes"
            use-input
            @filter="filtrarClientes"
          />

          <!-- Fecha de entrega -->
          <q-input
            v-model="pedido.fechaEntrega"
            type="date"
            label="Fecha de entrega"
            outlined
            dense
          />

          <!-- Fecha y hora de recibimiento -->
          <q-input
            v-model="pedido.fechaRecibido"
            label="Fecha y hora de recibimiento"
            outlined
            dense
            readonly
          />

          <!-- Kilos de ropa -->
          <q-input
            v-model.number="pedido.kilos"
            type="number"
            label="Kilos de ropa"
            outlined
            dense
            min="0"
          />

          <!-- Prendas individuales con servicio -->
          <div>
            <div class="q-mb-sm">Prendas individuales</div>
            <div
              v-for="(prenda, index) in pedido.prendas"
              :key="index"
              class="row items-center q-mb-sm q-col-gutter-sm"
            >
              <q-input v-model="prenda.nombre" label="Nombre prenda" outlined dense class="col" />
              <q-input v-model="prenda.servicio" label="Servicio" outlined dense class="col" />
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="removerPrenda(index)"
                class="q-ml-sm"
              />
            </div>
            <q-btn flat icon="add" label="Agregar prenda" color="primary" @click="agregarPrenda" />
          </div>

          <!-- Estado -->
          <q-select
            v-model="pedido.estado"
            :options="['Pendiente', 'Urgente']"
            label="Estado"
            outlined
            dense
          />

          <!-- Método de pago -->
          <q-option-group
            v-model="pedido.metodoPago"
            :options="[
              { label: 'Transferencia', value: 'transferencia' },
              { label: 'Efectivo', value: 'efectivo' },
            ]"
            label="Método de pago"
            type="radio"
            inline
          />

          <!-- Total -->
          <q-input
            v-model.number="pedido.total"
            type="number"
            label="Total"
            outlined
            dense
            min="0"
          />

          <!-- A cuenta -->
          <q-input
            v-model.number="pedido.aCuenta"
            type="number"
            label="A cuenta"
            outlined
            dense
            min="0"
          />

          <q-btn label="Guardar" type="submit" color="primary" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Modal para agregar cliente -->
    <q-dialog v-model="modalCliente" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Agregar Cliente</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCliente" class="q-gutter-md">
            <q-input v-model="nuevoCliente.nombre" label="Nombre del cliente" filled />
            <q-input v-model="nuevoCliente.telefono" label="Teléfono" filled />
            <q-input v-model="nuevoCliente.direccion" label="Dirección" filled />
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancelar"
                color="secondary"
                @click="modalCliente = false"
                class="q-mr-sm"
              />
              <q-btn label="Guardar" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Pedido con nuevos campos
const pedido = ref({
  clienteId: null,
  fechaEntrega: '',
  kilos: 0,
  prendas: [],
  estado: '',
  total: 0,
  aCuenta: 0,
  metodoPago: '',
  fechaRecibido: new Date().toLocaleString(),
})

const clientes = ref([])
const cargandoClientes = ref(false)

// Modal y nuevo cliente
const modalCliente = ref(false)
const nuevoCliente = ref({ nombre: '', telefono: '', direccion: '' })

onMounted(() => {
  obtenerClientes()
})

const obtenerClientes = async () => {
  cargandoClientes.value = true
  try {
    const res = await api.get('/cliente')
    clientes.value = res.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los clientes' })
  } finally {
    cargandoClientes.value = false
  }
}

// 🔥 Guardar pedido y sus detalles
const guardarPedido = async () => {
  try {
    // 1️⃣ Guardar pedido
    const resPedido = await api.post('/pedido', pedido.value)
    const pedidoId = resPedido.data.id

    // 2️⃣ Guardar detalles de las prendas
    for (const prenda of pedido.value.prendas) {
      await api.post('/detallePedido', {
        pedidoId,
        tipoPrenda: prenda.nombre,
        servicio: prenda.servicio,
        precio: prenda.precio || 0, // si quieres agregar precio individual
      })
    }

    $q.notify({ type: 'positive', message: 'Pedido guardado correctamente' })

    // Resetear formulario
    pedido.value = {
      clienteId: null,
      fechaEntrega: '',
      kilos: 0,
      prendas: [],
      estado: '',
      total: 0,
      aCuenta: 0,
      metodoPago: '',
      fechaRecibido: new Date().toLocaleString(),
    }
  } catch (error) {
    console.error('Error al guardar pedido:', error)
    $q.notify({ type: 'negative', message: 'Error al guardar el pedido' })
  }
}

const filtrarClientes = (val, update) => {
  const filtro = val?.toLowerCase() || ''
  update(() => clientes.value.filter((c) => c.nombre.toLowerCase().includes(filtro)))
}

const agregarPrenda = () => {
  pedido.value.prendas.push({ nombre: '', servicio: '' })
}

const removerPrenda = (index) => {
  pedido.value.prendas.splice(index, 1)
}

// Guardar cliente desde el modal
const guardarCliente = async () => {
  try {
    const res = await api.post('/cliente', nuevoCliente.value)
    clientes.value.push(res.data) // agregamos cliente recién creado
    pedido.value.clienteId = res.data.id // seleccionamos automáticamente
    $q.notify({ type: 'positive', message: 'Cliente guardado' })
    nuevoCliente.value = { nombre: '', telefono: '', direccion: '' }
    modalCliente.value = false
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al guardar cliente' })
  }
}
</script>
