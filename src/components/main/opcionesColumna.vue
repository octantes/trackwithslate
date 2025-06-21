<script>
import { obtenerColumnas, guardarColumnas, eliminarColumna, renombrarColumna, toggleCategoria } from '../funciones.js'
import inputRango from '../inputs/inputRango.vue'
import inputString from '../inputs/inputString.vue'
import inputSelector from '../inputs/inputSelector.vue'
import inputToggle from '../inputs/inputToggle.vue'
const formatosFecha = [ 'DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD','DD-MM-YYYY','D-MMM-YYYY', 'YYYY/MM/DD','YYYY.MM.DD','Month DD, YYYY','DD Month, YYYY','Day DD Month YYYY' ]
export default
{
  name: 'opcionesColumna',
  components: { inputRango, inputString, inputToggle, inputSelector },
  computed:
  {
    categoriaActual() { return this.slateColumnas[this.categoriaSeleccionada] || {} },
  },
  watch:
  {
    slateColumnas: { deep: true, handler(nuevas) { guardarColumnas(nuevas) } }
  },
  data()
  {
    return { slateColumnas: obtenerColumnas(), categoriaSeleccionada: '', formatosFecha: formatosFecha}
  },
  methods:
  {
    alternarCategoria(nuevoValor)
    {
      this.slateColumnas[this.categoriaSeleccionada].esCategoria = nuevoValor
      toggleCategoria(this.categoriaSeleccionada)
      this.slateColumnas = obtenerColumnas()
    },
    eliminarSeleccionada()
    {
      eliminarColumna(this.categoriaSeleccionada)
      this.slateColumnas = obtenerColumnas()
      this.categoriaSeleccionada = null
    },
    renombrarSeleccionada()
    {
      const vieja = this.categoriaSeleccionada, nueva = this.slateColumnas[vieja].nombre.trim()
      if (!nueva || nueva === vieja || this.slateColumnas[nueva]) return
      renombrarColumna(vieja, nueva)
      this.slateColumnas = obtenerColumnas()
      this.categoriaSeleccionada = nueva
    },
  },
}
</script>

<template>
  <div class="opciones">
    
    <div class="selector">
      <inputSelector v-model="categoriaSeleccionada" :opciones="Object.keys(slateColumnas)" placeholder="Columna" />
      <button v-if="categoriaSeleccionada" class="inputTXT" @click="eliminarSeleccionada">eliminar columna</button>
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">nombre</div>
      <inputString v-model="slateColumnas[categoriaSeleccionada].nombre" @blur="renombrarSeleccionada" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">tipo</div>
      <inputSelector v-model="categoriaActual.tipo" :opciones="['texto', 'numero', 'fecha', 'toggle']" placeholder="elegí un tipo" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">es una categoría?</div>
      <inputToggle :modelValue="categoriaActual.esCategoria" @update:modelValue="alternarCategoria" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">width de la columna: {{ categoriaActual.width }} px</div>
      <inputRango v-model="categoriaActual.width" :min="50" :max="500" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="divisor"></div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">formato de fecha</div>
      <inputSelector v-model="categoriaActual.fechaFormato" :opciones="formatosFecha" placeholder="elegí un formato" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">fecha automática</div>
      <inputToggle v-model="categoriaActual.fechaAutomatica" />
    </div>
    
  </div>
</template>