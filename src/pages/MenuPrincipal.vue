<template>
  <q-page class="flex flex-center q-pa-lg">
    <div class="column items-center q-gutter-md" style="width: 100%; max-width: 400px">
      <q-btn
        label="Servicio Normal"
        color="primary"
        class="full-width q-pa-xl text-h6"
        @click="irAServicio"
      />

      <q-btn
        label="Autoservicio (Pendiente)"
        color="grey-7"
        class="full-width q-pa-xl text-h6"
        :disable="true"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irAServicio = () => {
  router.push('/pedido') // Ajusta esta ruta según cómo se llame tu página de servicio
}
</script>
