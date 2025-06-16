<script>
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonFormularioCategoria',
  components: { PlusCircleIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'formularioCategoria')">
    <PlusCircleIcon class="iconoUI" />
  </button>
</template>