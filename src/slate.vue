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
    return { 
      vistaActual: 'vistaPrincipal',
      entradaActual: {},
      categoriaActual: {},
      vistaAnterior: null,
    }
  },
  methods:
  {
    vistaVolver() {
      if (this.vistaAnterior) {
        this.vistaActual = this.vistaAnterior
        this.vistaAnterior = null
      } else {
        this.vistaActual = 'vistaPrincipal'
      }
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
      this.cambiarVista('formularioCategoria')
    },
    guardarCategoria({ colKey, catKey, nombre, emoji })
    {
      const cats = obtenerCategorias()
      const keyNuevo = colKey || 'custom'
      const keyViejo = this.categoriaActual?.colKey || ''
      if (keyViejo && keyViejo !== keyNuevo && cats[keyViejo] && cats[keyViejo][catKey])
      {
        delete cats[keyViejo][catKey]
        if (Object.keys(cats[keyViejo]).length === 0) delete cats[keyViejo]
      }
      if (!cats[keyNuevo]) cats[keyNuevo] = {}
      if (catKey !== nombre && cats[keyNuevo][catKey])
      {
        delete cats[keyNuevo][catKey]
      }
      cats[keyNuevo][nombre] = { nombre, emoji, vinculada: true }
      editarCategoria(keyNuevo, nombre, { nombre, emoji })
      guardarCategorias(cats)
      this.vistaVolver()
    },
    cambiarVista(nuevaVista) {
      this.vistaAnterior = this.vistaActual
      this.vistaActual = nuevaVista
    },
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
      @cambiarVista="cambiarVista($event)"
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
  display: flex;
  padding: 1.5em;
  border-radius: 8px;
  background: #2b2c2c;
  justify-content: center;
}
</style>