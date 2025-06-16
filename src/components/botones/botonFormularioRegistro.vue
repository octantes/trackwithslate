<script>
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonFormularioRegistro',
  components: { PlusCircleIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'formularioRegistro')">
    <PlusCircleIcon class="iconoUI" />
  </button>
</template>