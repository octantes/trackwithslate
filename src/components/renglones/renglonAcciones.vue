<script>
import botonInterfazAceptar from './components/botones/botonInterfazAceptar.vue'
import botonInterfazCancelar from './components/botones/botonInterfazCancelar.vue'
export default
{
  name: 'renglonArchivo',
  components: { botonInterfazAceptar, botonInterfazCancelar },
  emits: ['aceptar', 'cancelar'],
}
</script>

<template>
  <div class="renglon">
    <botonInterfazAceptar @aceptar="$emit('aceptar')" />
    <botonInterfazCancelar @cancelar ="$emit('cancelar')" />
  </div>
</template>