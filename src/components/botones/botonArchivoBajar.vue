<script>
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid'
import { csvBajar } from '../funciones.js'
export default
{
  name: 'botonArchivoBajar',
  components: { DocumentArrowDownIcon },
  methods: { csvBajar },
}
</script>

<template>
  <button title="Export your entries to CSV" type="button" class='botonUI' @click="csvBajar()">
    <DocumentArrowDownIcon class="iconoUI" />
  </button>
</template>