<script>
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid'
import { csvBajar } from '../funciones.js'
export default
{
  name: 'botonArchivoBajar',
  components: { DocumentArrowDownIcon },
  methods:
  {
    bajar() { csvBajar() }
  },
}
</script>

<template>
  <button type="button" class='botonUI' @click="bajar">
    <DocumentArrowDownIcon class="iconoUI" />
  </button>
</template>