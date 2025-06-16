<script>
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaConfiguracion',
  components: { Cog6ToothIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'vistaConfiguracion')">
    <Cog6ToothIcon class="iconoUI" />
  </button>
</template>