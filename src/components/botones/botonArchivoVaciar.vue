<script>
import { DocumentMinusIcon } from '@heroicons/vue/24/solid'
import { csvVaciar } from '../funciones.js'
export default 
{
  name: 'botonArchivoVaciar',
  components: { DocumentMinusIcon },
  methods: { 
    vaciarConfirmacion()
    {
      if (confirm('Are you sure you want to delete everything? This button will reset the app!'))
      {
        csvVaciar()
      }
    },
  },
}
</script>

<template>
  <button type="button" class='botonUI' title="Delete all data" @click="vaciarConfirmacion">
    <DocumentMinusIcon class="iconoUI" />
  </button>
</template>