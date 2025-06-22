<script>
import renglonArchivo from '../renglones/renglonArchivo.vue'
import renglonVistas from '../renglones/renglonVistas.vue'
import opcionesColumna from '../opciones/opcionesColumna.vue'
import opcionesDesvinculadas from '../opciones/opcionesDesvinculadas.vue'
import opcionesGenerales from '../opciones/opcionesGenerales.vue'
export default
{
  name: 'vistaconfiguracion',
  emits: ['cambiarVista', 'cerrar', 'editarCategoria'],
  components: { opcionesColumna, opcionesDesvinculadas, opcionesGenerales, renglonArchivo, renglonVistas },
}
</script>

<template>
  <div class="display">
    <renglonArchivo />
    <div class="divisor"></div>
    <opcionesColumna />
    <div class="divisor"></div>
    <opcionesGenerales />
    <div class="divisor"></div>
    <opcionesDesvinculadas @editarCategoria="$emit('editarCategoria', $event)" />
    <div class="divisor"></div>
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
  </div>
</template>