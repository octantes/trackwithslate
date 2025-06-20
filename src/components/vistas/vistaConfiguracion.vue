<script>
import { obtenerOpciones } from '../funciones.js'
import renglonVistas from '../renglones/renglonVistas.vue'
import inputString from '../inputs/inputString.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputToggle from '../inputs/inputToggle.vue'
import opcionesColumna from '../categorias/opcionesColumna.vue'
export default
{
  name: 'vistaconfiguracion',
  emits: ['cambiarVista', 'cerrar'],
  components: { inputString, inputNumero, opcionesColumna, inputToggle, renglonVistas },
  watch:
  {
    opciones:
    {
      deep: true,
      handler(nuevas) { localStorage.setItem('slateOpciones', JSON.stringify(nuevas)) },
    }
  },
  data()
  {
    return {
      opciones: { ...obtenerOpciones() }
    }
  },
}
</script>

<template>
  <div class="display">

    <opcionesColumna />

    <div class="divisor"></div>
    
    <div class="opciones">
      <div class="opcion">
        <div class="descripcion">simbolo de separacion del csv</div>
        <inputString v-model="opciones.csvDelimitador" placeholder="delimitador csv" />
      </div>
      <div class="opcion">
        <div class="descripcion">botones de categoria por columna</div>
        <inputNumero v-model="opciones.limiteBotones" placeholder="botones x columna" />
      </div>
      <div class="opcion">
        <div class="descripcion">entradas por página de la tabla</div>
        <inputNumero v-model="opciones.limiteEntradas" placeholder="limite de entradas" />
      </div>
      <label class="opcion">
        <span class="descripcion">sumar nuevos al inicio?</span>
        <inputToggle v-model="opciones.sumarInicio" />
      </label>
    </div>

    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />

  </div>
</template>