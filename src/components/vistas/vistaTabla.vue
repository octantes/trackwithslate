<script>
import { filtrarRegistros, obtenerRegistros, guardarRegistros, testIgualdad } from '../funciones.js'
import renglonVistas from '../renglones/renglonVistas.vue'
import inputBuscar from '../inputs/inputBuscar.vue'
import csvTabla from '../main/csvTabla.vue'
export default
{
  name: 'vistaTabla',
  components: { csvTabla, inputBuscar, renglonVistas },
  emits: ['cambiarVista', 'seleccionarRegistro'],
  data()
  {
    return { busqueda: '', filtrados: null }
  },
  watch:
  {
    busqueda(nueva)
    {
      const resultado = filtrarRegistros(nueva)
      this.filtrados = Array.isArray(resultado) ? resultado : null
    },
  },
  methods:
  {
    editarEntrada(datos) 
    {
      this.$emit('cambiarVista', 'formularioRegistro')
      this.$emit('seleccionarRegistro', { datos })
    },
    bulkDelete()
    {
      if (!this.filtrados || !this.filtrados.length) return
      if (!confirm(`delete ${this.filtrados.length} filtered entries?`)) return
      const actuales = obtenerRegistros()
      const nuevo = actuales.filter(reg => !this.filtrados.some(f => testIgualdad(f, reg)))
      guardarRegistros(nuevo)
      this.filtrados = null
    },
  },
}
</script>

<template>
  <div class ="display">

    <div class="renglon" style="gap: .5em; align-items: center;">
      <inputBuscar v-model="busqueda" />
      <button class="inputTXT" v-if="busqueda && filtrados && filtrados.length" @click="bulkDelete" >delete</button>
    </div>

    <csvTabla :filtrados="filtrados" @registroEliminado="filtrados = null" @editarEntrada="editarEntrada" />
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
    
  </div>
</template>