<script>
import botonVistaConfiguracion from '../botones/botonVistaConfiguracion.vue'
import botonVistaPrincipal from '../botones/botonVistaPrincipal.vue'
import botonVistaTabla from '../botones/botonVistaTabla.vue'
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