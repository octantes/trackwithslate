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
  components:
  {
    formularioCategoria,
    formularioRegistro,
    vistaConfiguracion,
    vistaPrincipal,
    vistaTabla,
  },
  mounted() { inicializarSlate() },
  data() { return { vistaActual: 'vistaPrincipal', entradaActual: {}, categoriaActual: {} } },
  methods:
  {
    vistaVolver() { this.vistaActual = 'vistaPrincipal'; this.entradaActual = {}, this.categoriaActual = {} },
    editarEntrada(nuevosDatos)
    {
      const registros = obtenerRegistros()
      const index = registros.findIndex(r => testIgualdad(r, this.entradaActual))
      if (index === -1) return
      editarRegistro(index, nuevosDatos)
    },
    editarCateg(nuevosDatos) {
      const categorias = obtenerCategorias()
      let { colKey, catKey, cambios } = nuevosDatos

      // clave de columna vacía → guardar en 'undefined'
      if (!colKey) colKey = 'undefined'

      // clave de categoría vacía → usar el nombre como key
      if (!catKey) catKey = cambios.nombre || 'sin_nombre'

      if (!categorias[colKey]) categorias[colKey] = {}

      const actual = categorias[colKey][catKey]
      if (actual) {
        editarCategoria(colKey, catKey, cambios)
      } else {
        categorias[colKey][catKey] = { ...cambios, vinculada: true }
        guardarCategorias(categorias)
      }
    },
  },
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
      @seleccionarCategoria="categoriaActual = $event.datos"
      @editarCategoria="editarCateg"
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