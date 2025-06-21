<script>
import { filtrarRegistros } from '../funciones.js'
import renglonVistas from '../renglones/renglonVistas.vue'
import inputBuscar from '../inputs/inputBuscar.vue'
import csvTabla from '../main/csvTabla.vue'
export default
{
  name: 'vistaTabla',
  components: { csvTabla, inputBuscar, renglonVistas },
  emits: ['cerrar', 'cambiarVista', 'seleccionar'],
  data()
  {
    return { filtrados: null }
  },
  methods:
  {
    editarEntrada(datos) 
    {
      this.$emit('cambiarVista', 'formularioRegistro')
      this.$emit('seleccionar', { datos })
    }
  }
}
</script>

<template>
  <div class ="display">

    <inputBuscar @buscar="filtrados = filtrarRegistros($event)" />
    <csvTabla :filtrados="filtrados" @registroEliminado="filtrados = null" @editarEntrada="editarEntrada" />
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
    
  </div>
</template>