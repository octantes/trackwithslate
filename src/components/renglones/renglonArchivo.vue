<script>
import botonArchivoBajar from '../botones/botonArchivoBajar.vue'
import botonArchivoSubir from '../botones/botonArchivoSubir.vue'
import botonArchivoSumar from '../botones/botonArchivoSumar.vue'
import botonArchivoVaciar from '../botones/botonArchivoVaciar.vue'
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