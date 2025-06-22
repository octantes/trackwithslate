<script>
import { inicializarSlate, obtenerRegistros, editarRegistro, testIgualdad, editarCategoria, obtenerCategorias, guardarCategorias } from './components/funciones.js'
import formularioCategoria from './components/vistas/formularioCategoria.vue'
import formularioRegistro from './components/vistas/formularioRegistro.vue'
import vistaConfiguracion from './components/vistas/vistaConfiguracion.vue'
import vistaPrincipal from './components/vistas/vistaPrincipal.vue'
import vistaTabla from './components/vistas/vistaTabla.vue'
export default
{
  name: 'slate',
  components: { formularioCategoria, formularioRegistro,  vistaConfiguracion, vistaPrincipal, vistaTabla },
  mounted() { inicializarSlate() },
  data()
  {
    return { vistaActual: 'vistaPrincipal', entradaActual: {}, categoriaActual: {} }
  },
  methods:
  {
    vistaVolver()
    {
      this.vistaActual = 'vistaPrincipal'
      this.entradaActual = {}
      this.categoriaActual = {}
    },
    editarEntrada(nuevosDatos)
    {
      const regs = obtenerRegistros()
      const idx = regs.findIndex(r => testIgualdad(r, this.entradaActual))
      if (idx === -1) return
      editarRegistro(idx, nuevosDatos)
    },
    editarCategoria({ colKey, catKey, nombre, emoji })
    {
      this.categoriaActual = { colKey, catKey, nombre, emoji }
      this.vistaActual = 'formularioCategoria'
    },
    guardarCategoria({ colKey, catKey, nombre, emoji })
    {
      const key = colKey || 'custom'
      const cats = obtenerCategorias()
      if (!cats[key]) cats[key] = {}
      if (catKey !== nombre && cats[key][catKey])
      {
        delete cats[key][catKey]
      }
      cats[key][nombre] = { nombre, emoji, vinculada: true }
      editarCategoria(key, nombre, { nombre, emoji })
      guardarCategorias(cats)
      this.vistaVolver()
    }
  }
}
</script>

<template>
  <div class="contenedor">
    <component
      :is="vistaActual"
      :entrada="entradaActual"
      :categoria="categoriaActual"
      :colKey="categoriaActual.colKey"
      :catKey="categoriaActual.catKey"
      @cerrar="vistaVolver"
      @cambiarVista="vistaActual = $event"
      @seleccionarRegistro="entradaActual = { ...$event.datos }"
      @editarEntrada="editarEntrada"
      @seleccionarCategoria="categoriaActual = $event"
      @editarCategoria="editarCategoria"
      @guardarCategoria="guardarCategoria"
    />
  </div>
</template>

<style scoped>
.contenedor
{
  display: inline-block;
  padding: 2em;
  border-radius: 8px;
  background: #2b2c2c;
}
</style>