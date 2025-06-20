<script>
import renglonAcciones from '../renglones/renglonAcciones.vue'
import inputColor from '../inputs/inputColor.vue'
export default
{
  name: 'formularioCategoria',
  emits: ['cerrar'],
  components: { inputColor, renglonAcciones },
  props:
  {
    categoria: Object,
  },
  data()
  {
    return {
      mostrarEmoji: false,
      nuevoEmoji: this.categoria?.emoji || '',
      nuevoNombre: this.categoria?.nombre || '',
    }
  },
}
</script>

<template>
  <div class="formulario">

    <botonCustomEmoji :emoji="nuevoEmoji" @click="mostrarEmoji = !mostrarEmoji" />
    <input v-model="nuevoNombre" class="inputNOMBRE" />
    <inputEmoji v-if="mostrarEmoji" v-model="nuevoEmoji" />

    <renglonAcciones @aceptar="$emit('aceptar')" @cerrar="$emit('cerrar')" />

  </div>
</template>