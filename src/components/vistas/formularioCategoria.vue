<script>
import inputString from '../inputs/inputString.vue'
import inputColor from '../inputs/inputColor.vue'
import renglonAcciones from '../renglones/renglonAcciones.vue'

export default {
  name: 'formularioCategoria',
  emits: ['cerrar', 'editarCategoria', 'guardarCategoria'],
  components: { inputString, inputColor, renglonAcciones },
  props:
  {
    categoria: { type: Object, default: () => ({}) },
    colKey: {type: String, default: '' },
    catKey: { type: String, default: '' }
  },
  data()
  {
    return {
      nombre: this.categoria?.nombre || '',
      emoji: this.categoria?.emoji || '🔴',
    }
  },
  watch:
  {
    categoria:
    {
      immediate: true,
      deep: true,
      handler(nueva)
      {
        this.nombre = nueva?.nombre || ''
        this.emoji = nueva?.emoji || '🔴'
      }
    },
  },
  methods:
  {
    aceptar() {
      this.$emit('guardarCategoria',
      {
        colKey: this.colKey,
        catKey: this.catKey,
        nombre: this.nombre,
        emoji: this.emoji,
      })
      this.$emit('cerrar')
    }
  }
}
</script>

<template>
  <div class="formularioCategoria">
    <inputColor v-model="emoji" />
    <inputString v-model="nombre" placeholder="nombre de categoría" />
    <renglonAcciones @aceptar="aceptar" @cerrar="$emit('cerrar')" />
  </div>
</template>