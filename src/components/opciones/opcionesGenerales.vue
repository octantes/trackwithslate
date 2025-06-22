<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import inputString from '../inputs/inputString.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputToggle from '../inputs/inputToggle.vue'
import { obtenerOpciones } from '../funciones.js'

export default {
  name: 'opcionesGenerales',
  components: { inputString, inputNumero, inputToggle, ChevronDownIcon },
  data() {
    return {
      abierto: false,
      opciones: { ...obtenerOpciones() }
    }
  },
  watch: {
    opciones: {
      deep: true,
      handler(nuevas) {
        localStorage.setItem('slateOpciones', JSON.stringify(nuevas))
      }
    }
  }
}
</script>

<template>
  <div class="opciones">
    <div class="inputWrapper" @click="abierto = !abierto">
      <div class="tituloToggle">Generales</div>
      <ChevronDownIcon class="arrow" />
    </div>

    <template v-if="abierto">
      <div class="opcion">
        <div class="descripcion">simbolo de separacion del csv</div>
        <inputString v-model="opciones.csvDelimitador" placeholder="delimitador csv" />
      </div>
      <div class="opcion">
        <div class="descripcion">botones de categoria por columna</div>
        <inputNumero v-model="opciones.limiteBotones" :min="1" :max="100" placeholder="botones x columna" />
      </div>
      <div class="opcion">
        <div class="descripcion">entradas por página de la tabla</div>
        <inputNumero v-model="opciones.limiteEntradas" :min="1" :max="100" placeholder="limite de entradas" />
      </div>
      <label class="opcion">
        <span class="descripcion">sumar nuevos al inicio?</span>
        <inputToggle v-model="opciones.sumarInicio" />
      </label>
    </template>
  </div>
</template>