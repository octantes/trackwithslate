<script>
import botonInterfazAceptar from '../botones/botonInterfazAceptar.vue'
import botonInterfazCerrar from '../botones/botonInterfazCerrar.vue'
export default
{
  name: 'renglonAcciones',
  components: { botonInterfazAceptar, botonInterfazCerrar },
  emits: ['aceptar', 'cerrar'],
}
</script>

<template>
  <div class="renglon">
    <botonInterfazAceptar @aceptar="$emit('aceptar')" />
    <botonInterfazCerrar @cerrar ="$emit('cerrar')" />
  </div>
</template>