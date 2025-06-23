<script>
import { DocumentArrowUpIcon } from '@heroicons/vue/24/solid'
import { csvSubir } from '../funciones.js'
export default
{
  name: 'botonArchivoSubir',
  components: { DocumentArrowUpIcon },
  methods:
  {
    buscarArchivo() { this.$refs.fileInput.click() },
    manejarArchivo(event)
    {
      const file = event.target.files[0]
      event.target.value = ''
      if (!file) return
      csvSubir(file)
    },
  },
}
</script>

<template>
  <button title="Upload an existing CSV file" type="button" class='botonUI' @click="buscarArchivo">
    <DocumentArrowUpIcon class="iconoUI" />
  </button>
  <input type="file" accept=".csv" ref="fileInput" @change="manejarArchivo" style="display: none;" />
</template>