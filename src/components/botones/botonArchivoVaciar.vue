<script>
import { DocumentMinusIcon } from '@heroicons/vue/24/solid'
import { csvVaciar } from '../funciones.js'
export default 
{
  name: 'botonArchivoVaciar',
  components: { DocumentMinusIcon },
  methods:
  {
    vaciar() { csvVaciar() }
  },
}
</script>

<template>
  <button type="button" class='botonUI' @click="vaciar">
    <DocumentMinusIcon class="iconoUI" />
  </button>
</template>