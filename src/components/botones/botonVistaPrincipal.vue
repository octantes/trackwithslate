<script>
import { HomeIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaPrincipal',
  components: { HomeIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' title="Change to main view" @click="$emit('cambiarVista', 'vistaPrincipal')">
    <HomeIcon class="iconoUI" />
  </button>
</template>