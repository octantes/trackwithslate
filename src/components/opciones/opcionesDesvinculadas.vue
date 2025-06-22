<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import botonCategoria from '../main/botonCategoria.vue'
import { obtenerCategorias, guardarCategorias, guardarRegistros, obtenerOpciones } from '../funciones.js'

export default {
  name: 'configDesvinculadas',
  components: { botonCategoria, ChevronDownIcon },
  emits: ['editarCategoria', 'eliminarCategoria'],
  data() {
    return {
      categorias: obtenerCategorias() || {},
      abierto: false,
    }
  },
  computed: {
    desvinculadas() {
      return Object.entries(this.categorias).flatMap(([col, cats]) =>
        Object.entries(cats)
          .filter(([, c]) => c.vinculada === false)
          .map(([nom, c]) => ({ columna: col, nombre: nom, emoji: c.emoji }))
      )
    },
    estiloGrid() {
      const limite = obtenerOpciones()?.limiteBotones || 8
      const columnas = Math.ceil(this.desvinculadas.length / limite) || 1
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columnas}, 1fr)`,
        gridAutoRows: 'auto',
        maxHeight: `${limite * 40}px`,
        overflowY: 'auto',
        gap: '.5em',
        width: '100%',
      }
    }
  },
  methods: {
    vincular(cat = null) {
      if (cat) {
        this.categorias[cat.columna][cat.nombre].vinculada = true
      } else {
        for (const col in this.categorias) {
          for (const nom in this.categorias[col]) {
            if (this.categorias[col][nom].vinculada === false)
              this.categorias[col][nom].vinculada = true
          }
        }
      }
      guardarCategorias(this.categorias)
    },
    emitirEditar(cat) {
      this.$emit('editarCategoria', {
        colKey: cat.columna,
        catKey: cat.nombre,
        nombre: cat.nombre,
        emoji: cat.emoji
      })
    },
    emitirEliminar(cat) {
      if (!confirm('¿eliminar categoría y registros asociados?')) return
      const registros = JSON.parse(localStorage.getItem('slateRegistros') || '[]')
      const filtrados = registros.filter(r => r[cat.columna] !== cat.nombre)
      guardarRegistros(filtrados)
      delete this.categorias[cat.columna][cat.nombre]
      if (Object.keys(this.categorias[cat.columna]).length === 0)
        delete this.categorias[cat.columna]
      guardarCategorias(this.categorias)
    },
    borrarTodas() {
      if (!confirm('¿eliminar TODAS las categorías inactivas y sus registros asociados?')) return
      let registros = JSON.parse(localStorage.getItem('slateRegistros') || '[]')
      for (const cat of this.desvinculadas) {
        const { columna, nombre } = cat
        registros = registros.filter(r => r[columna] !== nombre)
        delete this.categorias[columna][nombre]
        if (Object.keys(this.categorias[columna]).length === 0)
          delete this.categorias[columna]
      }
      guardarRegistros(registros)
      guardarCategorias(this.categorias)
    }
  }
}
</script>

<template>
  <div class="desvinculadas">
    <div class="inputWrapper" @click="abierto = !abierto">
      <div class="tituloToggle">Desvinculadas</div>
      <ChevronDownIcon class="arrow"/>
    </div>

    <template v-if="abierto">
      <div v-if="desvinculadas.length === 0" class="desvinculadasVacio">
        no hay categorías inactivas
      </div>

      <div v-else :style="estiloGrid">
        <botonCategoria
          v-for="cat in desvinculadas"
          :key="cat.columna + '_' + cat.nombre"
          :emoji="cat.emoji"
          :label="cat.nombre + '/' + cat.columna"
          @click="vincular(cat)"
          @editarCategoria="emitirEditar(cat)"
          @eliminarCategoria="emitirEliminar(cat)"
        />
      </div>

      <div v-if="desvinculadas.length > 0" class="desvinculadasAcciones">
        <button class="inputTXT" @click="vincular()">re-vincular todas</button>
        <button class="inputTXT" @click="borrarTodas()">borrar todas</button>
      </div>
    </template>
  </div>
</template>