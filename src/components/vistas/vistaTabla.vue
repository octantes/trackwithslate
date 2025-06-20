<script>
import { filtrarRegistros } from '../funciones.js'
import renglonVistas from '../renglones/renglonVistas.vue'
import inputBuscar from '../inputs/inputBuscar.vue'
import csvTabla from '../tabla/csvTabla.vue'
export default
{
  name: 'vistaTabla',
  components: { csvTabla, inputBuscar, renglonVistas },
  emits: ['cerrar', 'cambiarVista'],
  data()
  {
    return { filtrados: null }
  },
}
</script>

<template>
  <div class ="display">

    <inputBuscar @buscar="filtrados = filtrarRegistros($event)" />
    
    <csvTabla :filtrados="filtrados" :editable="true" @registroEliminado="filtrados = null"
    @editarEntrada="$emit('cambiarVista','formularioRegistro', { tipo:'entrada', propsFormulario:{ modo:'editar', datos:$event } })"/>
    
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
    
  </div>
</template>