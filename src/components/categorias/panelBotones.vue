<script>
import { obtenerCategorias, obtenerOpciones } from '../funciones.js'
import botoncustomcategoria from './botoncustomcategoria.vue'

export default { name: 'panelbotones',
  components: { botoncustomcategoria },
  data() { return { categorias: {}, limiteBotones: 8, columnasGrid: 1 } },
  created() { 
    this.cargarCategorias(); const opts = obtenerOpciones()
    this.limiteBotones = opts.limiteBotones || 8; this.actualizarColumnasGrid()
  },
  methods: {
    cargarCategorias() { this.categorias = obtenerCategorias() || {}; this.actualizarColumnasGrid() },
    manejarClick(colKey, catKey) { const entrada = { [colKey]: catKey }; this.$emit('categoria-seleccionada', { datos: entrada }) },
    actualizarColumnasGrid() {
      const totalCategorias = Object.values(this.categorias).reduce((acc, cats) => acc + Object.keys(cats).length, 0)
      this.columnasGrid = Math.ceil(totalCategorias / this.limiteBotones) || 1
    },
    manejarEditar(colKey, catKey) {
      const cat = this.categorias[colKey]?.[catKey]; if (!cat) return
      const entrada = { ...cat, [colKey]: catKey }; this.$emit('editar-categoria', { datos: entrada })
    },
    manejarEliminar(colKey, catKey) {
      if (this.categorias[colKey]?.[catKey]) { this.categorias[colKey][catKey].vinculada = false }
      this.$emit('eliminar-categoria', { columna: colKey, categoria: catKey })
    }
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
        'max-height': `${this.limiteBotones * 40}px`,
        'overflow-y': 'auto',
        'gap': '8px',
        'width': '100%'
      }
    }
  }
}
</script>

<template>
  <div class="panelBotones" :style="estiloGrid">
    <botoncustomcategoria v-for="cat in categoriasPlanas"
      :key="cat.colKey + '_' + cat.catKey" :label="cat.nombre" :emoji="cat.emoji" :editable="true"
      @click="manejarClick(cat.colKey, cat.catKey)"
      @editar="manejarEditar(cat.colKey, cat.catKey)"
      @eliminar="manejarEliminar(cat.colKey, cat.catKey)"
    />
  </div>
</template>
