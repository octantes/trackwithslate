<script>
import { DocumentPlusIcon } from '@heroicons/vue/24/solid'
import { csvSumar } from '../funciones.js'
export default
{
  name: 'botonArchivoSumar',
  components: { DocumentPlusIcon },
  methods:
  {
    buscarArchivo() { this.$refs.fileInput.click() },
    manejarArchivo(event)
    {
      const file = event.target.files[0]
      event.target.value = ''
      if (!file) return
      csvSumar(file)
    },
  },
}
</script>

<template>
  <button type="button" class='botonUI' title="Add another CSV file" @click="buscarArchivo">
    <DocumentPlusIcon class="iconoUI" />
  </button>
  <input type="file" accept=".csv" ref="fileInput" @change="manejarArchivo" style="display: none;"/>
</template>