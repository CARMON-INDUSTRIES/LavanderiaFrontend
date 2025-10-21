const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/principal',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/MenuPrincipal.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/cliente',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/ClienteDatos.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/registro',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/RegistroUsuario.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/pedido',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/PedidoCliente.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/pedido-lista',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/PedidosLista.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/gasto',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/GastosGenerales.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/pago-empleados',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/PagoEmpleados.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/resumen-semanal',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/ResumenSemanal.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/stock-pendiente',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/StockPendiente.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
