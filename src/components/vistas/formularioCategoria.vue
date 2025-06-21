<script>
import renglonAcciones from '../renglones/renglonAcciones.vue'
import inputColor from '../inputs/inputColor.vue'
export default
{
  name: 'formularioCategoria',
  emits: ['cerrar'],
  components: { inputColor, renglonAcciones },
}
</script>

<template>
  <div class="formulario">

    <renglonAcciones @aceptar="$emit('aceptar')" @cerrar="$emit('cerrar')" />

  </div>
</template>