<script>
import inputString from '../inputs/inputString.vue'
import inputColor from '../inputs/inputColor.vue'
import inputSelector from '../inputs/inputSelector.vue'
import renglonAcciones from '../renglones/renglonAcciones.vue'
import { obtenerCategorias } from '../funciones.js'
export default
{
  name: 'formularioCategoria',
  emits: ['cerrar', 'editarCategoria', 'guardarCategoria'],
  components: { inputString, inputColor, inputSelector, renglonAcciones },
  props:
  {
    categoria: { type: Object, default: () => ({}) },
    colKey: {type: String, default: '' },
    catKey: { type: String, default: '' }
  },
  data()
  {
    const cats = obtenerCategorias()
    const columnas = Object.keys(cats).filter(c => c !== 'custom')
    return {
      nombre: this.categoria?.nombre || '',
      emoji: this.categoria?.emoji || '🔴',
      columnas,
      colKeyLocal: this.colKey || '',
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
        this.colKeyLocal = this.colKey || ''
      }
    },
  },
  methods:
  {
    aceptar()
    {
      this.$emit('guardarCategoria',
      {
        colKey: this.colKeyLocal || 'custom',
        catKey: this.catKey,
        nombre: this.nombre,
        emoji: this.emoji,
      })
      this.$emit('cerrar')
    }
  },
}
</script>

<template>
  <div class="formularioCategoria">
    <inputColor v-model="emoji" />
    <inputString v-model="nombre" placeholder="nombre de categoría" />
    <inputSelector :opciones="columnas" v-model="colKeyLocal" placeholder="vincular a" />
    <renglonAcciones @aceptar="aceptar" @cerrar="$emit('cerrar')" />
  </div>
</template>