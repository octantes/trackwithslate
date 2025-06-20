<script>
import { inicializarSlate } from './components/funciones.js'
import formularioCategoria from './components/vistas/formularioCategoria.vue'
import formularioRegistro from './components/vistas/formularioRegistro.vue'
import vistaConfiguracion from './components/vistas/vistaConfiguracion.vue'
import vistaPrincipal from './components/vistas/vistaPrincipal.vue'
import vistaTabla from './components/vistas/vistaTabla.vue'
export default
{
  name: 'slate',
  components:
  {
    formularioCategoria,
    formularioRegistro,
    vistaConfiguracion,
    vistaPrincipal,
    vistaTabla,
  },
  data() { return { vistaActual: 'vistaPrincipal', entradaActual: null } },
  methods: { vistaVolver() { this.vistaActual = 'vistaPrincipal' } },
  mounted() { inicializarSlate() },
}
</script>

<template>
  <div class="contenedor">
    <component
      :is="vistaActual"
      :entrada="entradaActual"
      @cerrar="vistaVolver"
      @cambiarVista="vistaActual = $event"
      @seleccionar="entradaActual = $event.datos"
    />
  </div>
</template>

<style scoped>
.contenedor
{
  display: inline-block;
  padding: 2em;
  border-radius: 8px;
  background: #2b2c2c;
}
</style>