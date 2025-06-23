<script>
import { XMarkIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonInterfazCerrar',
  components: { XMarkIcon },
  emits: ['cerrar'],
}
</script>

<template>
  <button type="button" class='botonUI' title="Close and forget changes" @click="$emit('cerrar')">
    <XMarkIcon class="iconoUI" />
  </button>
</template>