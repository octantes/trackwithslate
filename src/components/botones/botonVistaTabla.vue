<script>
import { TableCellsIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaTabla',
  components: { TableCellsIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' title="Change to table view" @click="$emit('cambiarVista', 'vistaTabla')">
    <TableCellsIcon class="iconoUI" />
  </button>
</template>