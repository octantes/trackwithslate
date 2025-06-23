<script>
import { obtenerCategorias, obtenerOpciones, guardarCategorias } from '../funciones.js'
import botonCategoria from './botonCategoria.vue'
export default
{
  name: 'panelbotones',
  components: { botonCategoria },
  emits: ['categoriaSeleccionada', 'editarCategoria', 'eliminarCategoria'],
  data() { return { categorias: {}, limiteBotones: 8, columnasGrid: 1 } },
  created()
  {
    const opts = obtenerOpciones()
    this.limiteBotones = opts.limiteBotones || 8
    this.cargarCategorias()
  },
  methods: {
    cargarCategorias()
    {
      this.categorias = obtenerCategorias() || {}
      this.actualizarColumnasGrid()
    },
    manejarClick(colKey, catKey) {
      this.$emit('categoriaSeleccionada', { colKey, catKey })
    },
    actualizarColumnasGrid()
    {
      const totalCategorias = Object.values(this.categorias).reduce((acc, cats) => acc + Object.keys(cats).length, 0)
      this.columnasGrid = Math.ceil(totalCategorias / this.limiteBotones) || 1
    },
    manejarEditar(colKey, catKey)
    {
      const cat = this.categorias[colKey]?.[catKey]
      if (!cat) return
      this.$emit('editarCategoria', { colKey, catKey, nombre: cat.nombre, emoji: cat.emoji })
    },
    manejarEliminar(colKey, catKey)
    {
      const cats = this.categorias
      if (cats[colKey]?.[catKey])
      {
        cats[colKey][catKey].vinculada = false
        guardarCategorias(cats)
        this.cargarCategorias()
      }
    },
  },
  computed: {
    categoriasPlanas() { let arr = []
      Object.entries(this.categorias).forEach(([colKey, cats]) => {
        Object.entries(cats).forEach(([catKey, cat]) => { 
          if (cat.vinculada !== false) { arr.push({ colKey, catKey, nombre: cat.nombre, emoji: cat.emoji || '' })}
        })
      }); return arr
    },
    estiloGrid() {
      return {
        display: 'grid',
        'grid-template-columns': `repeat(${this.columnasGrid}, 1fr)`,
        'grid-auto-rows': 'auto',
        'overflow-y': 'auto',
        'gap': '.5em',
        'width': '100%',
      }
    }
  }
}
</script>

<template>
  <div class="panelBotones" :style="estiloGrid">
    <botonCategoria v-for="cat in categoriasPlanas"
      :key="cat.colKey + '_' + cat.catKey" :label="cat.nombre" :emoji="cat.emoji"
      @click="manejarClick(cat.colKey, cat.catKey)"
      @editarCategoria="manejarEditar(cat.colKey, cat.catKey)"
      @eliminarCategoria="manejarEliminar(cat.colKey, cat.catKey)"
    />
  </div>
</template>