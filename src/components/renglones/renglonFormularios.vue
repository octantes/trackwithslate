<script>
import botonFormularioCategoria from '../botones/botonFormularioCategoria.vue'
import botonFormularioRegistro from '../botones/botonFormularioRegistro.vue'
export default
{
  name: 'renglonFormularios',
  components: { botonFormularioCategoria, botonFormularioRegistro },
  emits: ['cambiarVista'],
}
</script>

<template>
  <div class="renglon">
    <botonFormularioCategoria @cambiarVista="$emit('cambiarVista', $event)"/>
    <botonFormularioRegistro @cambiarVista="$emit('cambiarVista', $event)"/>
  </div>
</template>