<script>
import botonArchivoBajar from './components/botones/botonArchivoBajar.vue'
import botonArchivoSubir from './components/botones/botonArchivoSubir.vue'
import botonArchivoSumar from './components/botones/botonArchivoSumar.vue'
import botonArchivoVaciar from './components/botones/botonArchivoVaciar.vue'
export default
{
  name: 'renglonArchivo',
  components: { botonArchivoBajar, botonArchivoSubir, botonArchivoSumar, botonArchivoVaciar },
}
</script>

<template>
  <div class="renglon">
    <botonArchivoBajar />
    <botonArchivoSubir />
    <botonArchivoSumar />
    <botonArchivoVaciar />
  </div>
</template>