<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import inputString from '../inputs/inputString.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputToggle from '../inputs/inputToggle.vue'
import { obtenerOpciones } from '../funciones.js'
export default
{
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
  
  <div class="tituloWrapper" @click="abierto = !abierto">
    <div class="tituloToggle">Main</div>
    <ChevronDownIcon :class="['tituloArrow', { rotado: abierto }]"/>
  </div>
  
  <div class="opciones">

    <template v-if="abierto">
      <div class="opcion">
        <div class="descripcion">CSV separation symbol</div>
        <inputString v-model="opciones.csvDelimitador" placeholder="CSV separation symbol" />
      </div>
      <div class="opcion">
        <div class="descripcion">Category buttons in each column</div>
        <inputNumero v-model="opciones.limiteBotones" :min="1" :max="100" placeholder="Category buttons in each column" />
      </div>
      <div class="opcion">
        <div class="descripcion">Entries in each table page</div>
        <inputNumero v-model="opciones.limiteEntradas" :min="1" :max="100" placeholder="Entries in each table page" />
      </div>
      <label class="opcion">
        <span class="descripcion">Add new entries to start?</span>
        <inputToggle v-model="opciones.sumarInicio" />
      </label>
    </template>
  </div>
</template>