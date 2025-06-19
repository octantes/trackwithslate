<script>
import { inicializarSlate } from './components/funciones.js'
import formularioRegistro from './components/formularioRegistro.vue'
import formularioCategoria from './components/formularioCategoria.vue'
import vistaConfiguracion from './components/vistaConfiguracion.vue'
import vistaPrincipal from './components/vistaPrincipal.vue'
import vistaTabla from './components/vistaTabla.vue'
import modalArchivoInvalido from './components/modalArchivoInvalido.vue'
import './components/estilos.css'
export default {
  name: 'slate',
  components: { vistaConfiguracion, vistaPrincipal, vistaTabla, formularioRegistro, formularioCategoria, modalArchivoInvalido },
  methods: { vistaVolver() { this.vistaActual = 'vistaPrincipal' } },
  data() { return { vistaActual: 'vistaPrincipal', entradaActual: null } },
  mounted() { inicializarSlate() },
}
</script>

<template>
  <div class="pantalla">
    <div class="contenedor">
      <component
      :is="vistaActual"
      :entrada="entradaActual"
      @cerrar="vistaVolver"
      @cambiarVista="vistaActual = $event"
      @seleccionar="entradaActual = $event.datos"
      />
    </div>
  </div>  
</template>

<style>
* {
  font-family: 'Space Mono', sans-serif;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.pantalla {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #1a1c1c;
  overflow: hidden;
}
.contenedor {
  display: inline-block;
  padding: 2em;
  border-radius: 8px;
  background: #2b2c2c;
  transition: all 1s ease;
}
</style>