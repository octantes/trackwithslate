

<script>
import botonVistaConfiguracion from './components/botones/botonVistaConfiguracion.vue'
import botonVistaPrincipal from './components/botones/botonVistaPrincipal.vue'
import botonVistaTabla from './components/botones/botonVistaTabla.vue'
export default
{
  name: 'renglonVistas',
  components: { botonVistaConfiguracion, botonVistaPrincipal, botonVistaTabla },
  emits: ['cambiarVista'],
}
</script>

<template>
  <div class="renglon">
    <botonVistaConfiguracion @cambiarVista="$emit('cambiarVista', $event)"/>
    <botonVistaPrincipal @cambiarVista="$emit('cambiarVista', $event)"/>
    <botonVistaTabla @cambiarVista="$emit('cambiarVista', $event)"/>
  </div>
</template>