<script>
import renglonAcciones from './renglonAcciones.vue'
import inputColor from './inputColor.vue'
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
  methods:
  {
    guardarCambios() { this.$emit('cerrar') },
  },
}
</script>

<template>
  <div class="formulario">

    <botonCustomEmoji :emoji="nuevoEmoji" @click="mostrarEmoji = !mostrarEmoji" />
    <input v-model="nuevoNombre" class="inputNOMBRE" />
    <inputEmoji v-if="mostrarEmoji" v-model="nuevoEmoji" />

    <renglonAcciones @aceptar="guardarCambios" @cancelar="$emit('cerrar')" />

  </div>
</template>