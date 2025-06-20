<script>
import { DocumentMinusIcon } from '@heroicons/vue/24/solid'
import { csvVaciar } from '../funciones.js'
export default 
{
  name: 'botonArchivoVaciar',
  components: { DocumentMinusIcon },
  methods: { csvVaciar },
}
</script>

<template>
  <button type="button" class='botonUI' @click="csvVaciar()">
    <DocumentMinusIcon class="iconoUI" />
  </button>
</template>