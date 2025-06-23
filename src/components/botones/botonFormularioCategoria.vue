<script>
import { TagIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonFormularioCategoria',
  components: { TagIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' title="Create a new category" @click="$emit('cambiarVista', 'formularioCategoria')">
    <TagIcon class="iconoUI" />
  </button>
</template>