<script>
import { CheckIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonInterfazAceptar',
  components: { CheckIcon },
  emits: ['aceptar'],
}
</script>

<template>
  <button type="button" class='botonUI' title="Accept changes" @click="$emit('aceptar')">
    <CheckIcon class="iconoUI" />
  </button>
</template>