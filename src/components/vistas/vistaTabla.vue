<script>
import renglonVistas from '../renglones/renglonVistas.vue'
import csvTabla from '../tabla/csvTabla.vue'
import csvBuscar from '../tabla/csvBuscar.vue'
export default
{
  name: 'vistaTabla',
  components: { csvTabla, csvBuscar, renglonVistas },
  emits: ['cerrar', 'cambiarVista'],
  data()
  {
    return { filtrados: null }
  },
}
</script>

<template>
  <div class ="display">

    <csvBuscar @filtrar="filtrados = $event" />
    <csvTabla :filtrados="filtrados" :editable="true" @registroEliminado="filtrados = null"
    @editarEntrada="$emit('cambiarVista','formularioRegistro', { tipo:'entrada', propsFormulario:{ modo:'editar', datos:$event } })"/>
    
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
    
  </div>
</template>