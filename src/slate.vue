<script>
import BotonArchivoBajar from './components/botones/botonArchivoBajar.vue'
export default
{
  name: 'slate',
  components: { BotonArchivoBajar },
  methods: {},
  emits: {},
  data() {},
  mounted() {},
}
</script>

<template>
  <div class="contenedor">
    <BotonArchivoBajar />
    <component
      :is="vistaActual"
      :entrada="entradaActual"
      @cerrar="vistaVolver"
      @cambiarVista="vistaActual = $event"
      @seleccionar="entradaActual = $event.datos"
    />
  </div>
</template>

<style scoped>
.contenedor
{
  display: inline-block;
  padding: 2em;
  border-radius: 8px;
  background: #2b2c2c;
}
</style>