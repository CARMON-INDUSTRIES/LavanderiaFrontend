<template>
  <q-page padding class="flex flex-center">
    <div
      id="ticket"
      style="
        width: 58mm;
        font-family: 'Courier New', monospace;
        background: white;
        color: black;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      "
    >
      <div class="text-center">
        <div class="text-h6">
          Lavandería y Tintorería <br />
          Burbu Clean
        </div>
        <div style="font-size: 12px">Tel: 55 3864 4860</div>
        <div style="font-size: 12px">Tel: 55 1894 4538</div>
        <div style="font-size: 12px">--------------------------------</div>
      </div>

      <div style="font-size: 12px; margin-top: 5px">
        <div><b>Folio:</b> {{ pedido.id }}</div>
        <div><b>Cliente:</b> {{ pedido.cliente?.nombre }}</div>
        <div><b>Recibido:</b> {{ formatDate(pedido.fechaIngreso) }}</div>
        <div><b>Entrega:</b> {{ formatDate(pedido.fechaEntrega) }}</div>
      </div>

      <div style="margin-top: 10px; font-size: 12px">
        <div class="text-center"><b>--- Detalle de prendas ---</b></div>
        <div
          v-for="(d, i) in pedido.detalles"
          :key="i"
          class="row justify-between"
          style="font-size: 12px"
        >
          <div>{{ d.tipoPrenda }} ({{ d.servicio }})</div>
          <!-- <div>${{ d.precio.toFixed(2) }}</div> -->
        </div>
      </div>

      <div style="margin-top: 8px; font-size: 12px">
        <div style="text-align: right">
          <b>A Cuenta: ${{ pedido.aCuenta?.toFixed(2) }}</b>
        </div>
        <div style="text-align: right">
          <b>Total: ${{ pedido.total?.toFixed(2) }}</b>
        </div>
      </div>

      <div class="text" style="margin-top: 10px; font-size: 9px">
        • El agente no está autorizado para entregar ninguna orden si no está liquidada. <br />
        • Toda prenda que venga al servicio de esta casa se considera usada. <br />
        • No respondemos por objetos olvidados. <br />
        • Todo secado encoge. <br />
        • En caso de pérdida, la casa pagará la cuarta parte de la prenda. <br />
        • No nos hacemos responsables por pérdida de ropa interior. <br />
        • La carga mínima por cobrar será de $50 pesos. <br />

        <div class="text-center" style="margin-top: 10px; font-size: 9px">
          ¡Gracias por su preferencia!
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="column q-ml-md">
      <q-btn color="primary" label="Imprimir (Navegador)" @click="imprimirTicket" class="q-mb-sm" />
      <q-btn color="teal" label="Imprimir con QZ Tray" @click="imprimirConQZ" class="q-mb-sm" />
      <q-btn flat color="secondary" label="Volver" @click="router.back()" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import qz from 'qz-tray'

const router = useRouter()
const $q = useQuasar()
const pedido = ref({})

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

// ---------- Impresión con ventana del navegador ----------
const imprimirTicket = () => {
  const ticket = document.getElementById('ticket').innerHTML
  const ventana = window.open('', '', 'width=400,height=600')
  ventana.document.write(`
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            width: 58mm;
          }
          .text-center { text-align: center; }
          .row { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body onload="window.print();window.close();">
        ${ticket}
      </body>
    </html>
  `)
  ventana.document.close()
}

// ---------- Impresión directa con QZ Tray ----------
const imprimirConQZ = async () => {
  try {
    await qz.websocket.connect()
    const config = qz.configs.create(null) // null = impresora por defecto

    // Armar contenido del ticket en texto ESC/POS
    const data = [
      '\x1B\x40', // Reset
      'Lavandería y Tintorería \nBurbu Clean\n',
      'Tel: 55 3864 4860 / 55 1894 4538\n',
      '--------------------------------\n',
      `Folio: ${pedido.value.id}\n`,
      `Cliente: ${pedido.value.cliente?.nombre || ''}\n`,
      `Fecha Recibido: ${formatDate(pedido.value.fechaIngreso)}\n`,
      `Fecha Entrega: ${formatDate(pedido.value.fechaEntrega)}\n`,
      '--------------------------------\n',
      'Detalle de prendas:\n',
      ...(pedido.value.detalles?.map((d) => `${d.tipoPrenda} (${d.servicio})\n`) || []),
      '--------------------------------\n',
      `Total: $${pedido.value.total?.toFixed(2)}\n`,
      '• El agente no está autorizado para entregar ninguna orden si no está liquidada.\n',
      '• Toda prenda que venga al servicio de esta casa se considera usada.\n',
      '• No respondemos por objetos olvidados.\n',
      '• Todo secado encoge.\n',
      '• En caso de pérdida, la casa pagará la cuarta parte de la prenda.\n',
      '• No nos hacemos responsables por pérdida de ropa interior.\n',
      '• La carga mínima por cobrar será de $50 pesos.\n\n',
      '\n¡Gracias por su preferencia!\n',
      '\x1D\x56\x00', // Corte de papel
    ]

    await qz.print(config, data)
    $q.notify({ type: 'positive', message: 'Ticket enviado a la impresora térmica' })
  } catch (err) {
    console.error('Error al imprimir con QZ Tray:', err)
    $q.notify({
      type: 'negative',
      message: 'No se pudo imprimir con QZ Tray. Verifica que esté instalado y ejecutándose.',
    })
  } finally {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect()
    }
  }
}
</script>
