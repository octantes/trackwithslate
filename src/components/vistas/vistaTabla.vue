<script>
import botonInterfazVolver from './botonInterfazVolver.vue'
import csvTabla from './csvTabla.vue'
import csvBuscar from './csvBuscar.vue'
export default
{
  name: 'vistaTabla',
  components: { botonInterfazVolver, csvTabla, csvBuscar },
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
    
  </div>
</template>