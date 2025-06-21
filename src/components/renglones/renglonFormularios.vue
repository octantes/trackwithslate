<script>
import botonFormularioRegistro from '../botones/botonFormularioRegistro.vue'
import botonFormularioCategoria from '../botones/botonFormularioCategoria.vue'
export default
{
  name: 'renglonFormularios',
  components: { botonFormularioRegistro, botonFormularioCategoria },
  emits: ['cambiarVista', 'seleccionarRegistro', 'seleccionarCategoria'],
  methods:
  {
    crearEntrada() {
      this.$emit('cambiarVista', 'formularioRegistro')
      this.$emit('seleccionarRegistro', { datos: {} })
    },
    crearCategoria() {
      this.$emit('cambiarVista', 'formularioCategoria')
      this.$emit('seleccionarCategoria', { datos: {} })
    },
  },
}
</script>

<template>
  <div class="renglon">
    <botonFormularioRegistro @cambiarVista="crearEntrada"/>
    <botonFormularioCategoria @cambiarVista="crearCategoria"/>
  </div>
</template>