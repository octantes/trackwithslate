<script>
import { obtenerColumnas, guardarColumnas, eliminarColumna, renombrarColumna, toggleCategoria } from '../funciones.js'
import inputRango from '../inputs/inputRango.vue'
import inputString from '../inputs/inputString.vue'
import inputSelector from '../inputs/inputSelector.vue'
import inputToggle from '../inputs/inputToggle.vue'
const formatosFecha = [
  'YYYY/MM/DD',
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'MM-DD-YYYY',
  'DD/MM/YYYY',
  'DD-MM-YYYY',
  'YYYY/MM/DD HH:mm',
  'YYYY-MM-DD HH:mm',
  'MM/DD/YYYY HH:mm',
  'MM-DD-YYYY HH:mm',
  'DD/MM/YYYY HH:mm',
  'DD-MM-YYYY HH:mm',
  'YYYY/MM/DD HH:mm:ss',
  'YYYY-MM-DD HH:mm:ss',
  'MM/DD/YYYY HH:mm:ss',
  'MM-DD-YYYY HH:mm:ss',
  'DD/MM/YYYY HH:mm:ss',
  'DD-MM-YYYY HH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss',
]
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
    crearColumna()
    {
      const columnas = obtenerColumnas()
      let i = 1
      let key
      do { key = `newColumn${i++}` }
      while (columnas[key])
      columnas[key] =
      {
        nombre: key,
        tipo: 'texto',
        width: 160,
        esCategoria: false,
        escondida: false,
      }
      guardarColumnas(columnas)
      this.slateColumnas = columnas
      this.categoriaSeleccionada = key
    },
  },
}
</script>

<template>

  <div class="selector">
    <inputSelector v-model="categoriaSeleccionada" :opciones="Object.keys(slateColumnas)" placeholder="Columns" />
    <button class="inputTXT" @click="crearColumna">Create new</button>
    <button v-if="categoriaSeleccionada" class="inputTXT" @click="eliminarSeleccionada">Delete</button>
  </div>
 
  <div class="opciones">

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">Name</div>
      <inputString v-model="slateColumnas[categoriaSeleccionada].nombre" @blur="renombrarSeleccionada" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">Type</div>
      <inputSelector v-model="categoriaActual.tipo" :opciones="['texto', 'numero', 'fecha', 'toggle']" placeholder="elegí un tipo" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">Hide column</div>
      <inputToggle v-model="categoriaActual.escondida" />
    </div>
    
    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">Set as category</div>
      <inputToggle :modelValue="categoriaActual.esCategoria" @update:modelValue="alternarCategoria" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">Column width: {{ categoriaActual.width }} px</div>
      <inputRango v-model="categoriaActual.width" :min="50" :max="500" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="divisor"></div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">Date format</div>
      <inputSelector v-model="categoriaActual.fechaFormato" :opciones="formatosFecha" placeholder="elegí un formato" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">Auto-fill date</div>
      <inputToggle v-model="categoriaActual.fechaAutomatica" />
    </div>
    
  </div>
</template>