<template>
  <q-page padding class="flex flex-center">
    <!-- Vista previa del ticket -->
    <div
      id="ticket"
      style="
        width: 59mm;
        font-family: 'Courier New', monospace;
        background: white;
        color: black;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      "
    >
      <div class="text-center">
        <div class="text-sub-2">
          Lavandería y <br />
          Tintorería <br />
          Burbu Clean
        </div>
        <div style="font-size: 10px">Tel: 55 3864 4860</div>
        <div style="font-size: 10px">Tel: 55 1894 4538</div>
        <div style="font-size: 10px">-------------------------------</div>
      </div>

      <div style="font-size: 10px; margin-top: 5px">
        <div><b>Folio:</b> {{ pedido.id }}</div>
        <div><b>Cliente:</b> {{ pedido.cliente?.nombre }}</div>
        <div><b>Recibido:</b> {{ formatDate(pedido.fechaIngreso) }}</div>
        <div><b>Entrega:</b> {{ formatDate(pedido.fechaEntrega) }}</div>
      </div>

      <div style="margin-top: 10px; font-size: 10px">
        <div class="text-center"><b>--- Detalle de prendas ---</b></div>
        <div
          v-for="(d, i) in pedido.detalles"
          :key="i"
          class="row justify-between"
          style="font-size: 10px"
        >
          <div>{{ d.tipoPrenda }} ({{ d.servicio }})</div>
        </div>
      </div>

      <div style="margin-top: 8px; font-size: 11px">
        <div style="text-align: right">
          <b>A Cuenta: ${{ pedido.aCuenta?.toFixed(2) }}ㅤㅤㅤ</b>
        </div>
        <div style="text-align: right">
          <b>Total: ${{ pedido.total?.toFixed(2) }}ㅤㅤㅤ</b>
        </div>
      </div>

      <div class="text" style="margin-top: 10px; font-size: 10px">
        • El agente no está <br />
        autorizado para entregar <br />
        ninguna orden si <br />
        no está liquidada. <br />
        • Toda prenda que venga al<br />
        servicio de esta casa se<br />
        considera usada.<br />
        • No respondemos por objetos<br />
        olvidados. <br />
        • Todo secado encoge. <br />
        • En caso de pérdida, <br />
        la casa pagará la cuarta<br />
        parte de la prenda. <br />
        • No nos hacemos responsables <br />
        por pérdida de ropa<br />
        interior. <br />
        • La carga mínima por cobrar<br />
        será de $50 pesos. <br />

        <div class="text-left" style="margin-top: 9px; font-size: 9px">
          ¡Gracias por su preferencia!
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="column q-ml-md">
      <q-btn color="primary" label="Imprimir ticket" @click="imprimirTicket" class="q-mb-sm" />
      <q-btn flat color="secondary" label="Volver" @click="router.back()" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const pedido = ref({})

// ==================== Cargar último pedido ====================
onMounted(async () => {
  await cargarUltimoPedido()
})

const cargarUltimoPedido = async () => {
  try {
    const res = await api.get('/pedido/ultimo')
    pedido.value = res.data
  } catch (error) {
    console.error('Error al cargar el último pedido:', error)
  }
}

const formatDate = (fecha) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
  })
}

// ==================== Impresión con ventana del navegador ====================
const imprimirTicket = () => {
  const ticket = document.getElementById('ticket').innerHTML

  const ventana = window.open('', '', 'width=400,height=600')
  ventana.document.write(`
    <html>
      <head>
        <title>Ticket</title>
        <style>
          @page {
            size: 59mm auto;
            margin: 0;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            #ticket {
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              width: 58mm;
            }
          }

          body {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            width: 58mm;
            margin: 0;
            padding: 0;
            color: black;
          }

          .text-center { text-align: center; }
          .row { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body onload="window.print();window.close();">
        <div id="ticket">
          ${ticket}
        </div>
      </body>
    </html>
  `)
  ventana.document.close()
}
</script>
