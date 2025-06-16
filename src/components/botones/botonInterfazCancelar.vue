<script>
import { XMarkIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonInterfazCancelar',
  components: { XMarkIcon },
  emits: ['cancelar'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cancelar')">
    <XMarkIcon class="iconoUI" />
  </button>
</template>