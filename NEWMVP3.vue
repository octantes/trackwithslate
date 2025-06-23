[=|=|"funciones.js"|=|=]

export function inicializarSlate() {
  if (localStorage.getItem('slateColumnas') === null) localStorage.setItem('slateColumnas', '{}')
  if (localStorage.getItem('slateRegistros') === null) localStorage.setItem('slateRegistros', '[]')
  if (localStorage.getItem('slateCategorias') === null) localStorage.setItem('slateCategorias', '{}')
  if (localStorage.getItem('slateOpciones') === null)
    localStorage.setItem('slateOpciones', JSON.stringify({
      csvDelimitador: ',',
      limiteBotones: 8,
      limiteEntradas: 15,
      sumarInicio: true,
    }))
}

export function toggleCategoria(key) { const columnas = obtenerColumnas()
  if (!columnas[key]) return columnas
  columnas[key].esCategoria = !columnas[key].esCategoria
  guardarColumnas(columnas)
  const cats = obtenerCategorias()
  if (columnas[key].esCategoria) {
    const regs = obtenerRegistros()
    const unicas = [...new Set(regs.map(r => r[key]).filter(v => v))]
    cats[key] = cats[key] || {}
    unicas.forEach(name => { if (!cats[key][name]) { cats[key][name] = { nombre: name, emoji: 'ðŸ“', vinculada: true }}})} else { delete cats[key] }
  guardarCategorias(cats)
  return { columnas, cats }
}

// getters localstorage

export function obtenerRegistros() { return JSON.parse(localStorage.getItem('slateRegistros') || '[]') }
export function obtenerColumnas() { return JSON.parse(localStorage.getItem('slateColumnas') || '{}') }
export function obtenerCategorias() { return JSON.parse(localStorage.getItem('slateCategorias') || '{}') }
export function obtenerOpciones() { return JSON.parse(localStorage.getItem('slateOpciones') || '{}') }
export function obtenerDelimitador() { return obtenerOpciones().csvDelimitador || ',' }
export function obtenerLimiteEntradas() { return obtenerOpciones().limiteEntradas || 12 }
export function obtenerLimiteBotones() { return obtenerOpciones().limiteBotones || 12 }
export function obtenerPagina(arr, pagina, limite) { const inicio = pagina * limite; return arr.slice(inicio, inicio + limite) }

// setters localstorage

export function guardarRegistros(registros) { localStorage.setItem('slateRegistros', JSON.stringify(registros)) }
export function guardarColumnas(columnas) { localStorage.setItem('slateColumnas', JSON.stringify(columnas)) }
export function guardarCategorias(categorias) { localStorage.setItem('slateCategorias', JSON.stringify(categorias)) }
export function guardarOpciones(opciones) { localStorage.setItem('slateOpciones', JSON.stringify(opciones)) }

// mergers localstorage

export function sumarOpcion(opcion) { localStorage.setItem('slateOpciones', JSON.stringify({ ...obtenerOpciones(), ...opcion })) }
export function agregarRegistro(registro) { const regs = obtenerRegistros(); regs.unshift(registro); guardarRegistros(regs); return regs }

// editar localstorage

export function editarRegistro(index, cambios) { const regs = obtenerRegistros(), original = regs.at(index)
  if (!original) { throw new Error('Entry index not valid') }
  const actualizado = { ...original, ...cambios }
  regs.splice(index, 1, actualizado)
  guardarRegistros(regs)
  return regs
}

export function editarColumna(key, prop, valor) {
  const columnas = obtenerColumnas()
  if (!columnas[key]) return columnas
  columnas[key][prop] = valor
  guardarColumnas(columnas)
  return columnas
}

export function editarCategoria(colKey, name, nuevosProps) { const cats = obtenerCategorias()
  if (!cats[colKey] || !cats[colKey][name]) return cats
  cats[colKey][name] = { ...cats[colKey][name], ...nuevosProps }
  guardarCategorias(cats)
  return cats
}

// renombrar localstorage

export function renombrarColumna(keyOld, keyNew) { const columnas = obtenerColumnas()
  if (!columnas[keyOld] || columnas[keyNew]) { return { columnas, regs: obtenerRegistros() } }
  const newColumnas = {}
  Object.keys(columnas).forEach(key => {
    if (key === keyOld) { newColumnas[keyNew] = { ...columnas[keyOld], nombre: keyNew } }
    else { newColumnas[key] = columnas[key] }
  })
  guardarColumnas(newColumnas)
  const cats = obtenerCategorias()
  if (cats[keyOld]) { cats[keyNew] = { ...cats[keyOld] }; delete cats[keyOld]; guardarCategorias(cats) }
  const regs = obtenerRegistros().map(r => { const nuevo = {}
    Object.keys(newColumnas).forEach(colKey => { if (colKey === keyNew) { nuevo[colKey] = r[keyOld] } else { nuevo[colKey] = r[colKey] } })
    return nuevo
  } )
  guardarRegistros(regs)
  return { columnas: newColumnas, cats, regs }
}

export function renombrarCategoria(colKey, oldName, newName) {
  const cats = obtenerCategorias()
  if (!cats[colKey] || !cats[colKey][oldName] || cats[colKey][newName]) { return { cats: obtenerCategorias(), regs: obtenerRegistros() } }
  cats[colKey][newName] = { ...cats[colKey][oldName], nombre: newName }
  delete cats[colKey][oldName]
  guardarCategorias(cats)
  const regs = obtenerRegistros()
  regs.forEach(r => { if (r[colKey] === oldName) r[colKey] = newName })
  guardarRegistros(regs)
  return { cats, regs }
}

// eliminar localstorage

export function eliminarRegistro(index) { const regs = obtenerRegistros()
  if (index < 0 || index >= regs.length) { throw new Error('Entry index not valid') }
  regs.splice(index, 1)
  guardarRegistros(regs)
  return regs
}

export function eliminarColumna(key) {
  const columnas = obtenerColumnas()
  delete columnas[key]
  guardarColumnas(columnas)
  const regs = obtenerRegistros().map(r => { const { [key]: _, ...rest } = r; return rest })
  guardarRegistros(regs)
  const cats = obtenerCategorias()
  delete cats[key]
  guardarCategorias(cats)
  return { columnas, regs, cats }
}

export function eliminarCategoria(colKey, name) { const cats = obtenerCategorias()
  if (!cats[colKey] || !cats[colKey][name]) { return { cats: obtenerCategorias(), regs: obtenerRegistros() } }
  delete cats[colKey][name]
  if (Object.keys(cats[colKey]).length === 0) { delete cats[colKey] }
  guardarCategorias(cats)
  const regs = obtenerRegistros().filter(r => r[colKey] !== name)
  guardarRegistros(regs)
  return { cats, regs }
}

export function eliminarFila(fila) {
  const registros = obtenerRegistros()
  const index = registros.findIndex(r => testIgualdad(r, fila))
  if (index === -1) return false
  eliminarRegistro(index)
  return true
}

// otros localstorage

export function filtrarRegistros(input)
{
  const query = (input || '').trim().toLowerCase()
  if (!query) return null
  const registros = obtenerRegistros()
  return registros.filter(registro =>
    Object.values(registro).some(valor =>
      String(valor).toLowerCase().includes(query)
    )
  )
}

// funciones csv

export function csvValidar(file) {
  if (!file) return false
  const mime = file.type.toLowerCase()
  const ext = file.name.toLowerCase().endsWith('.csv')
  return mime === 'text/csv' || ext
}

export function csvParse(file) {
  return new Promise((resolve, reject) => {
  const reader = new FileReader()
    reader.onload = eventoLectura => {
      const texto = eventoLectura.target.result.trim()
      const lineas = texto.split(/\r?\n/).map(l => l.split(obtenerDelimitador())) // separar por lineas y por delimitador
      const [header, ...rows] = lineas // separar header de filas
      const filas = rows.map(celdas => csvSubParse(celdas)) // procesamos cada fila con funcion sub-parse
      resolve({ header, rows: filas }) // devolver objeto con header y filas
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function csvSubParse(celdas) { return celdas } // funcion para procesar cada linea internamente +++

export async function csvSubir(file) {
  if (!csvValidar(file)) throw new Error("The file you're trying to upload is not a valid csv, or its mimetype is incorrect.")
  const { header, rows } = await csvParse(file)
    const columnas = Object.fromEntries(header.map(nombreColumna => [nombreColumna.trim(), { nombre: nombreColumna.trim() }]))
    const registros = rows.map(row => {
      const entrada = Object.fromEntries(header.map((nombreColumna, i) => {
        const valor = row[i]?.trim() || ''
        return [ nombreColumna.trim(), valor ]}))
      return entrada
    })
    localStorage.setItem('slateColumnas', JSON.stringify(columnas))
    localStorage.setItem('slateRegistros', JSON.stringify(registros))
}

export async function csvSumar(file) {
  if (!csvValidar(file)) throw new Error("The file you're trying to upload is not a valid csv, or its mimetype is incorrect.")
  const { header, rows } = await csvParse(file)
  const nuevasColumnas = header.map(c => c.trim())
  const nuevosRegistros = rows.map(row =>Object.fromEntries(header.map((c, i) => [c.trim(), row[i]?.trim() || ''])))
  const viejasColumnasObj = obtenerColumnas()
  const viejosRegistros   = obtenerRegistros()
  const viejasColumnas = Object.keys(viejasColumnasObj)
  nuevasColumnas.forEach(c => {if (!viejasColumnas.includes(c)) {viejasColumnasObj[c] = { nombre: c }}})
  const sumarInicio = obtenerOpciones().sumarInicio === true
  const combinados = sumarInicio
    ? [...nuevosRegistros, ...viejosRegistros]
    : [...viejosRegistros, ...nuevosRegistros]
  const todasClaves = Object.keys(viejasColumnasObj)
  const normalizado = combinados.map(reg => {
    const r = {}
    todasClaves.forEach(k => {r[k] = reg[k] ?? ''})
    return r
  })
  localStorage.setItem('slateColumnas',  JSON.stringify(viejasColumnasObj))
  localStorage.setItem('slateRegistros', JSON.stringify(normalizado))
}

export function csvBajar() {
  const registros = obtenerRegistros()
  if (!registros.length) return
  const encabezado = Object.keys(registros[0]).join(obtenerDelimitador())
  const filas = registros.map(registro => Object.values(registro).join(obtenerDelimitador()))
  const csv = [encabezado, ...filas].join('\r\n')
  const blob = new Blob([csv], {type: 'text/csv'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'slateRegistros.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function csvVaciar() {
  localStorage.setItem('slateRegistros', '[]')
  localStorage.setItem('slateColumnas', '{}')
  localStorage.setItem('slateCategorias', '{}')
}

export function testIgualdad(a, b) { 
  const claves = new Set([...Object.keys(a), ...Object.keys(b)])
  for (let clave of claves) { if (a[clave] !== b[clave]) return false } return true
}

[=|=|"botonArchivoBajar.vue"|=|=]

<script>
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid'
import { csvBajar } from '../funciones.js'
export default
{
  name: 'botonArchivoBajar',
  components: { DocumentArrowDownIcon },
  methods: { csvBajar },
}
</script>

<template>
  <button type="button" class='botonUI' @click="csvBajar()">
    <DocumentArrowDownIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonArchivoSubir.vue"|=|=]

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
  <button type="button" class='botonUI' @click="buscarArchivo">
    <DocumentArrowUpIcon class="iconoUI" />
  </button>
  <input type="file" accept=".csv" ref="fileInput" @change="manejarArchivo" style="display: none;" />
</template>

[=|=|"botonArchivoSumar.vue"|=|=]

<script>
import { DocumentPlusIcon } from '@heroicons/vue/24/solid'
import { csvSumar } from '../funciones.js'
export default
{
  name: 'botonArchivoSumar',
  components: { DocumentPlusIcon },
  methods:
  {
    buscarArchivo() { this.$refs.fileInput.click() },
    manejarArchivo(event)
    {
      const file = event.target.files[0]
      event.target.value = ''
      if (!file) return
      csvSumar(file)
    },
  },
}
</script>

<template>
  <button type="button" class='botonUI' @click="buscarArchivo">
    <DocumentPlusIcon class="iconoUI" />
  </button>
  <input type="file" accept=".csv" ref="fileInput" @change="manejarArchivo" style="display: none;"/>
</template>

[=|=|"botonArchivoVaciar.vue"|=|=]

<script>
import { DocumentMinusIcon } from '@heroicons/vue/24/solid'
import { csvVaciar } from '../funciones.js'
export default 
{
  name: 'botonArchivoVaciar',
  components: { DocumentMinusIcon },
  methods: { csvVaciar },
}
</script>

<template>
  <button type="button" class='botonUI' @click="csvVaciar()">
    <DocumentMinusIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonFormularioCategoria.vue"|=|=]

<script>
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonFormularioCategoria',
  components: { PlusCircleIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'formularioCategoria')">
    <PlusCircleIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonFormularioRegistro.vue"|=|=]

<script>
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonFormularioRegistro',
  components: { PlusCircleIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'formularioRegistro')">
    <PlusCircleIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonInterfazAceptar.vue"|=|=]

<script>
import { CheckIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonInterfazAceptar',
  components: { CheckIcon },
  emits: ['aceptar'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('aceptar')">
    <CheckIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonInterfazCerrar.vue"|=|=]

<script>
import { XMarkIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonInterfazCerrar',
  components: { XMarkIcon },
  emits: ['cerrar'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cerrar')">
    <XMarkIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonVistaConfiguracion.vue"|=|=]

<script>
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaConfiguracion',
  components: { Cog6ToothIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'vistaConfiguracion')">
    <Cog6ToothIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonVistaPrincipal.vue"|=|=]

<script>
import { HomeIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaPrincipal',
  components: { HomeIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'vistaPrincipal')">
    <HomeIcon class="iconoUI" />
  </button>
</template>

[=|=|"botonVistaTabla.vue"|=|=]

<script>
import { TableCellsIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'botonVistaTabla',
  components: { TableCellsIcon },
  emits: ['cambiarVista'],
}
</script>

<template>
  <button type="button" class='botonUI' @click="$emit('cambiarVista', 'vistaTabla')">
    <TableCellsIcon class="iconoUI" />
  </button>
</template>

[=|=|"inputBuscar.vue"|=|=]

<script>
export default
{
  name: 'inputBuscar',
  emits: ['update:modelValue', 'buscar'],
  props:
  {
    modelValue: { type: String, default: '' }
  },
  computed:
  {
    texto:
    {
      get() { return this.modelValue },
      set(nuevo)
      {
        this.$emit('update:modelValue', nuevo)
        this.$emit('buscar', nuevo)
      }
    }
  }
}
</script>

<template>
  <input class="inputBuscar" name="inputBuscar" v-model="texto" type="text" placeholder="Search entries..." />
</template>

<style scoped>
.inputBuscar {
  padding: .5em .8em;
  font-size: 1rem;
  border: 1px solid #1b1c1c;
  border-radius: 8px;
  background: #3c3c3c;
  color: #d8dade;
  transition: background 0.2s,
  border-color 0.2s;
  width:100%;
}
.inputBuscar:hover { background: #4d4c4c; }
.inputBuscar:focus { background: #4d4c4c; border-color: #4C9AFF; outline: none; }
</style>

[=|=|"inputColor.vue"|=|=]

<script>
export default
{
  name: 'inputColor',
  emits: ['update:modelValue'],
  props: 
  {
    colores: { type: Array, default: () => ['ðŸ”´','ðŸŸ ','ðŸŸ¡','ðŸŸ¢','ðŸ”µ','ðŸŸ£','ðŸŸ¤','âš«','âšª'] },
    modelValue: { type: String, default: '' },
  },
  computed:
  {
    valor:
    { 
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
  methods:
  {
    siguienteEmoji()
    {
      const index = this.colores.indexOf(this.valor)
      const siguiente = this.colores[(index + 1) % this.colores.length]
      this.valor = siguiente
    },
  },
}
</script>

<template>
  <button type="button" class="boton" @click="siguienteEmoji">
    <span class="color">{{ valor }}</span>
  </button>
</template>

<style scoped>
.boton
{
  position: relative; 
  display: inline-flex; 
  align-items: center; 
  justify-content: flex-start; 
  gap: .5em; 
  padding: .5em .5em; 
  overflow: hidden; 
  border: 1px solid #1b1c1c; 
  border-radius: 8px; 
  background: #3c3c3c; 
  color: #d8dade; 
  font-size: 1rem; 
  cursor: pointer; 
  transition: background 0.2s ease, transform 0.05s ease;
}
.boton:hover { background: #4d4c4c; }
.boton:active { transform: scale(0.95); }
.color { font-size: 1rem; line-height: 1; }
</style>

[=|=|"inputNumero.vue"|=|=]

<script>
export default
{
  name: 'inputNumero',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Number, default: 0 },
    placeholder: { type: String, default: 'Insert number' },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo)
      {
        const n = Math.max(this.min, Math.min(this.max, Number(nuevo)))
        this.$emit('update:modelValue', n)
      },
    },
  },
}
</script>

<template>
  <input class="input" name="inputNumero" type="number"  v-model.number="valor" :placeholder="placeholder" 
  :min="min !== -Infinity ? min : undefined" :max="max !== Infinity ? max : undefined" />
</template>

[=|=|"inputRango.vue"|=|=]

<script>
export default
{
  name: 'inputRango',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
  },
  computed:
  {
    internalValue:
    {
      get() { return this.modelValue},
      set(val) { this.$emit('update:modelValue', val) },
    },
  },
}
</script>

<template>
  <input class="rango" name="inputRango" type="range"  :min="min" :max="max" v-model.number="internalValue"/>
</template>

<style scoped>
.rango
{
  width: 160px;
  appearance: none;
  height: 4px;
  border-radius: 4px;
  background: #555;
  outline: none;
  cursor: pointer;
}
</style>

[=|=|"inputSelector.vue"|=|=]

<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'inputSelector',
  emits: ['update:modelValue'],
  components: { ChevronDownIcon },
  props:
  {
    modelValue: { type: String, default: '' },
    opciones: { type: Array,  default: () => [] },
    placeholder: { type: String, default: 'Select' },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
}
</script>

<template>
  <div class="inputWrapper">
    <select class="input" v-model="valor">
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="opcion in opciones" :key="opcion" :value="opcion">{{ opcion }}</option>
    </select>
    <ChevronDownIcon class="arrow"/>
  </div>
</template>

[=|=|"inputString.vue"|=|=]

<script>
export default
{
  name: 'inputString',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Insert text' },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
}
</script>

<template>
  <input class="input" name="inputString" type="text" v-model="valor" :placeholder="placeholder" />
</template>

[=|=|"inputToggle.vue"|=|=]

<script>
export default
{
  name: 'inputToggle',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Boolean, default: false },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
  methods:
  {
    alternar() { this.valor = !this.valor },
  },
}
</script>

<template>
  <div class="toggle" @click="alternar" :class="{ activo: valor }">
    <div class="circulo" />
  </div>
</template>

<style scoped>
.toggle
{
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: #1b1c1c;
  border: 1px solid #1b1c1c;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 2px;
}
.toggle .circulo { width: 18px; height: 18px; border-radius: 50%; background: #d8dade; transition: transform 0.2s ease }
.toggle.activo { background: #4C9AFF; border-color: #4C9AFF }
.toggle.activo .circulo { transform: translateX(20px); background: #1b1c1c }
</style>

[=|=|"botonCategoria.vue"|=|=]

<script>
export default
{
  name: 'botonCategoria',
  emits: ['click', 'editarCategoria', 'eliminarCategoria'],
  props:
  {
    emoji: { type: String, default: 'ðŸ”´' },
    label: { type: String, default: 'Category' },
  },
  data()
  {
    return { hover: false }
  },
  computed:
  {
    mostrarAcciones() { return this.hover }
  },
}
</script>

<template>
  <div class="categoriaWrapper" @mouseenter="hover = true" @mouseleave="hover = false">

    <button class="botonCategoria" @click="$emit('click')">
      <span v-if="emoji" class="emojiCategoria">{{ emoji }}</span>
      <span v-if="label" class="labelCategoria">{{ label }}</span>
    </button>

    <div v-if="mostrarAcciones" class="categoriaAcciones">
      <span class="iconoCAT" @click.stop="$emit('editarCategoria')">âœï¸</span>
      <span class="iconoCAT" @click.stop="$emit('eliminarCategoria')">âŒ</span>
    </div>
    
  </div>
</template>

<style scoped>
.categoriaWrapper { position: relative; display: inline-block; }
.botonCategoria
{
  height: 2.5em;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: .5em;
  padding: 0 0.8em;
  overflow: hidden;
  border: 1px solid #1b1c1c;
  border-radius: 8px;
  background: #3c3c3c;
  color: #d8dade 25%;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.05s ease;
  width: 100%;
}
.botonCategoria:hover { background: #4d4c4c }
.botonCategoria:active { transform: scale(0.95) }
.botonCategoria::after { content: ''; position: absolute; top: 0; right: 0; width: 3.5em; height: 100%; background: linear-gradient(to right, transparent, #3c3c3c) }
.emojiCategoria { display: inline-block; min-width: 1.2em; flex-shrink: 0; text-align: center; font-size: 0.5rem }
.labelCategoria { display: inline-block; white-space: nowrap; position: relative; max-width: 100% }
.categoriaAcciones { position: absolute; top: 0; bottom: 0; right: 0; display: flex; align-items: center; gap: .25em; padding: .5em; user-select: none; }
.iconoCAT { cursor: pointer; font-size: 0.5rem; background: #1b1c1c99; border-radius: 4px; padding: .5em .5em }
</style>

[=|=|"csvTabla.vue"|=|=]

<script>
import { obtenerRegistros, obtenerColumnas, obtenerPagina, obtenerLimiteEntradas, eliminarFila, testIgualdad } from '../funciones.js';
const parseVal = v => isNaN(v) ? v : parseFloat(v);
export default
{
  name: 'csvTabla',
  emits: ['editarEntrada', 'registroEliminado'],
  props:
  {
    filtrados: { type: Array, default: null }
  },
  data()
  {
    return { pagina: 0, ordenColumna: null, ordenTipo: null, hoverIndex: null, actualizacion: 0, columnasObj: obtenerColumnas() };
  },
  watch:
  {
    filtrados: { handler() { this.pagina = 0 }, immediate: true },
  },
  computed:
  {
    filasPaginadas() { return obtenerPagina(this.registros, this.pagina, this.limite) },
    columnas()
    {
      return Object.entries(this.columnasObj)
        .filter(([_, val]) => !val?.escondida)
        .map(([key]) => key)
    },
    limite() { return obtenerLimiteEntradas() },
    registrosBase()
    {
      void this.actualizacion
      return Array.isArray(this.filtrados)
        ? this.filtrados
        : obtenerRegistros()
    },
    registros()
    {
      if (!this.ordenColumna || !this.ordenTipo) { return this.registrosBase }
      return [...this.registrosBase].sort((a, b) =>
      {
        const aV = parseVal(a[this.ordenColumna])
        const bV = parseVal(b[this.ordenColumna])
        if (aV === bV) return 0
        return this.ordenTipo === 'asc' ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1)
      })
    },
  },
  methods:
  {
    colStyle(col) { return { width: (this.columnasObj[col]?.width || 160) + 'px' } },
    nextPage() { if ((this.pagina + 1) * this.limite < this.registros.length) this.pagina++ },
    prevPage() { if (this.pagina > 0) this.pagina-- },
    filaKey(fila) { return JSON.stringify(fila) },
    eliminarEntrada(fila)
    {
      if (eliminarFila(fila))
      {
        this.actualizacion++
        this.$emit('registroEliminado')
      }
    },
    ordenar(col)
    {
      if (this.ordenColumna !== col)
      {
        this.ordenColumna = col
        this.ordenTipo = 'asc'
        return
      }
      switch (this.ordenTipo)
      {
        case 'asc':
          this.ordenTipo = 'desc'
          break
        case 'desc':
          this.ordenColumna = null
          this.ordenTipo = null
          break
        default:
          this.ordenTipo = 'asc'
      }
    }
  }
}
</script>

<template>
  <div class="tabla-wrapper">
    <div class="tabla-nav nav-left" @click="prevPage">
      <span v-if="pagina > 0">â—‚</span>
    </div>
    <div class="tabla-container">
      <table>
        <thead>
          <tr>
            <th v-for="col in columnas" :key="col" @click="ordenar(col)" :style="colStyle(col)">
              <span class="col-text">{{ col }}</span>
              <span class="orden-indicador" v-if="ordenColumna === col">
                {{ ordenTipo === 'asc' ? 'â–¾' : ordenTipo === 'desc' ? 'â–´' : '' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, idx) in filasPaginadas"
            :key="filaKey(fila) + idx"
            class="fila-wrapper"
            @mouseenter="hoverIndex = idx"
            @mouseleave="hoverIndex = null"
          >
            <td
              v-for="col in columnas"
              :key="col"
              :style="[colStyle(col), col === columnas[columnas.length - 1] ? { position: 'relative' } : {}]"
            >
              <span>{{ fila[col] }}</span>
              <template v-if="col === columnas[columnas.length - 1] && hoverIndex === idx">
                <div class="accionesCAT" @click.stop>
                  <button class="iconoCAT" @click="$emit('editarEntrada', fila)">âœï¸</button>
                  <button class="iconoCAT" @click="eliminarEntrada(fila)">âŒ</button>
                </div>
              </template>
            </td>
          </tr>
          <tr v-if="filasPaginadas.length === 0">
            <td :colspan="columnas.length + 2">No entries</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tabla-nav nav-right" @click="nextPage">
      <span v-if="(pagina + 1) * limite < registros.length">â–¸</span>
    </div>
  </div>
</template>

<style scoped>
.tabla-container table { border-collapse: collapse; table-layout: auto; }
.tabla-wrapper { display: flex; align-items: stretch; overflow: hidden; border-radius: 8px; background: #3c3c3c; }
.tabla-container { flex: 1; overflow-x: auto; }
table { border: 2px solid #1b1c1c; width: max-content; color: #d8dade; font-size: 0.9rem; }
th, td { padding: 6px 12px; border: 1px solid #1b1c1c; text-align: left; background: #3c3c3c; color: #d8dade; }
th { background: #2b2c2c; cursor: pointer; position: relative; padding-right: 1.2em; }
th:hover { background: #3d3e3e; }
.orden-indicador { position: absolute; right: 4px; }
.accionesCAT { position: absolute; top: 50%; right: 0.5em; transform: translateY(-50%); display: flex; gap: 0.25em; }
.iconoCAT { all: unset; cursor: pointer; font-size: 0.5rem; background: #1b1c1c99; border-radius: 4px; padding: .5em; display: flex; align-items: center; justify-content: center; }
.tabla-nav { width: 1.25em; background: #1b1c1c; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.tabla-nav:hover { background: #2b2c2c; }
</style>

[=|=|"panelBotones.vue"|=|=]

<script>
import { obtenerCategorias, obtenerOpciones, guardarCategorias } from '../funciones.js'
import botonCategoria from './botonCategoria.vue'
export default
{
  name: 'panelbotones',
  components: { botonCategoria },
  emits: ['categoriaSeleccionada', 'editarCategoria', 'eliminarCategoria'],
  data() { return { categorias: {}, limiteBotones: 8, columnasGrid: 1 } },
  created()
  {
    const opts = obtenerOpciones()
    this.limiteBotones = opts.limiteBotones || 8
    this.cargarCategorias()
  },
  methods: {
    cargarCategorias()
    {
      this.categorias = obtenerCategorias() || {}
      this.actualizarColumnasGrid()
    },
    manejarClick(colKey, catKey) {
      this.$emit('categoriaSeleccionada', { colKey, catKey })
    },
    actualizarColumnasGrid()
    {
      const totalCategorias = Object.values(this.categorias).reduce((acc, cats) => acc + Object.keys(cats).length, 0)
      this.columnasGrid = Math.ceil(totalCategorias / this.limiteBotones) || 1
    },
    manejarEditar(colKey, catKey)
    {
      const cat = this.categorias[colKey]?.[catKey]
      if (!cat) return
      this.$emit('editarCategoria', { colKey, catKey, nombre: cat.nombre, emoji: cat.emoji })
    },
    manejarEliminar(colKey, catKey)
    {
      const cats = this.categorias
      if (cats[colKey]?.[catKey])
      {
        cats[colKey][catKey].vinculada = false
        guardarCategorias(cats)
        this.cargarCategorias()
      }
    },
  },
  computed: {
    categoriasPlanas() { let arr = []
      Object.entries(this.categorias).forEach(([colKey, cats]) => {
        Object.entries(cats).forEach(([catKey, cat]) => { 
          if (cat.vinculada !== false) { arr.push({ colKey, catKey, nombre: cat.nombre, emoji: cat.emoji || '' })}
        })
      }); return arr
    },
    estiloGrid() {
      return {
        display: 'grid',
        'grid-template-columns': `repeat(${this.columnasGrid}, 1fr)`,
        'grid-auto-rows': 'auto',
        'overflow-y': 'auto',
        'gap': '.5em',
        'width': '100%',
      }
    }
  }
}
</script>

<template>
  <div class="panelBotones" :style="estiloGrid">
    <botonCategoria v-for="cat in categoriasPlanas"
      :key="cat.colKey + '_' + cat.catKey" :label="cat.nombre" :emoji="cat.emoji"
      @click="manejarClick(cat.colKey, cat.catKey)"
      @editarCategoria="manejarEditar(cat.colKey, cat.catKey)"
      @eliminarCategoria="manejarEliminar(cat.colKey, cat.catKey)"
    />
  </div>
</template>

[=|=|"opcionesColumna.vue"|=|=]

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
  <div class="opciones">
    
    <div class="selector">
      <inputSelector v-model="categoriaSeleccionada" :opciones="Object.keys(slateColumnas)" placeholder="Columna" />
      <button class="inputTXT" @click="crearColumna">create new</button>
      <button v-if="categoriaSeleccionada" class="inputTXT" @click="eliminarSeleccionada">delete</button>
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">name</div>
      <inputString v-model="slateColumnas[categoriaSeleccionada].nombre" @blur="renombrarSeleccionada" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">type</div>
      <inputSelector v-model="categoriaActual.tipo" :opciones="['texto', 'numero', 'fecha', 'toggle']" placeholder="elegÃ­ un tipo" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">hide column</div>
      <inputToggle v-model="categoriaActual.escondida" />
    </div>
    
    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">set as category</div>
      <inputToggle :modelValue="categoriaActual.esCategoria" @update:modelValue="alternarCategoria" />
    </div>

    <div v-if="categoriaSeleccionada" class="opcion">
      <div class="descripcion">column width: {{ categoriaActual.width }} px</div>
      <inputRango v-model="categoriaActual.width" :min="50" :max="500" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="divisor"></div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">date format</div>
      <inputSelector v-model="categoriaActual.fechaFormato" :opciones="formatosFecha" placeholder="elegÃ­ un formato" />
    </div>

    <div v-if="categoriaActual.tipo === 'fecha'" class="opcion">
      <div class="descripcion">auto-fill date</div>
      <inputToggle v-model="categoriaActual.fechaAutomatica" />
    </div>
    
  </div>
</template>

[=|=|"opcionesDesvinculadas.vue"|=|=]

<script>
import { obtenerCategorias, guardarCategorias, guardarRegistros, obtenerOpciones } from '../funciones.js'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import botonCategoria from '../main/botonCategoria.vue'
export default
{
  name: 'configDesvinculadas',
  components: { botonCategoria, ChevronDownIcon },
  emits: ['editarCategoria', 'eliminarCategoria'],
  data() {
    return {
      categorias: obtenerCategorias() || {},
      abierto: false,
    }
  },
  computed: {
    desvinculadas() {
      return Object.entries(this.categorias).flatMap(([col, cats]) =>
        Object.entries(cats)
          .filter(([, c]) => c.vinculada === false)
          .map(([nom, c]) => ({ columna: col, nombre: nom, emoji: c.emoji }))
      )
    },
    estiloGrid() {
      const limite = obtenerOpciones()?.limiteBotones || 8
      const columnas = Math.ceil(this.desvinculadas.length / limite) || 1
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columnas}, 1fr)`,
        gridAutoRows: 'auto',
        maxHeight: `${limite * 40}px`,
        overflowY: 'auto',
        gap: '.5em',
        width: '100%',
      }
    }
  },
  methods: {
    vincular(cat = null) {
      if (cat) {
        this.categorias[cat.columna][cat.nombre].vinculada = true
      } else {
        for (const col in this.categorias) {
          for (const nom in this.categorias[col]) {
            if (this.categorias[col][nom].vinculada === false)
              this.categorias[col][nom].vinculada = true
          }
        }
      }
      guardarCategorias(this.categorias)
    },
    emitirEditar(cat) {
      this.$emit('editarCategoria', {
        colKey: cat.columna,
        catKey: cat.nombre,
        nombre: cat.nombre,
        emoji: cat.emoji
      })
    },
    emitirEliminar(cat) {
      if (!confirm('Delete this category and all associated entries?')) return
      const registros = JSON.parse(localStorage.getItem('slateRegistros') || '[]')
      const filtrados = registros.filter(r => r[cat.columna] !== cat.nombre)
      guardarRegistros(filtrados)
      delete this.categorias[cat.columna][cat.nombre]
      if (Object.keys(this.categorias[cat.columna]).length === 0)
        delete this.categorias[cat.columna]
      guardarCategorias(this.categorias)
    },
    borrarTodas() {
      if (!confirm('Delete ALL unlinked categories and all associated entries?')) return
      let registros = JSON.parse(localStorage.getItem('slateRegistros') || '[]')
      for (const cat of this.desvinculadas) {
        const { columna, nombre } = cat
        registros = registros.filter(r => r[columna] !== nombre)
        delete this.categorias[columna][nombre]
        if (Object.keys(this.categorias[columna]).length === 0)
          delete this.categorias[columna]
      }
      guardarRegistros(registros)
      guardarCategorias(this.categorias)
    }
  }
}
</script>

<template>
  <div class="desvinculadas">
    <div class="inputWrapper" @click="abierto = !abierto">
      <div class="tituloToggle">Unlinked</div>
      <ChevronDownIcon class="arrow"/>
    </div>

    <template v-if="abierto">
      <div v-if="desvinculadas.length === 0" class="desvinculadasVacio">
        no inactive categories
      </div>

      <div v-else :style="estiloGrid">
        <botonCategoria
          v-for="cat in desvinculadas"
          :key="cat.columna + '_' + cat.nombre"
          :emoji="cat.emoji"
          :label="cat.nombre + '/' + cat.columna"
          @click="vincular(cat)"
          @editarCategoria="emitirEditar(cat)"
          @eliminarCategoria="emitirEliminar(cat)"
        />
      </div>

      <div v-if="desvinculadas.length > 0" class="desvinculadasAcciones">
        <button class="inputTXT" @click="vincular()">link all</button>
        <button class="inputTXT" @click="borrarTodas()">delete all</button>
      </div>
    </template>
  </div>
</template>

[=|=|"opcionesGenerales.vue"|=|=]

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
  <div class="opciones">
    <div class="inputWrapper" @click="abierto = !abierto">
      <div class="tituloToggle">Main</div>
      <ChevronDownIcon class="arrow" />
    </div>

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

[=|=|"renglonAcciones.vue"|=|=]

<script>
import botonInterfazAceptar from '../botones/botonInterfazAceptar.vue'
import botonInterfazCerrar from '../botones/botonInterfazCerrar.vue'
export default
{
  name: 'renglonAcciones',
  components: { botonInterfazAceptar, botonInterfazCerrar },
  emits: ['aceptar', 'cerrar'],
}
</script>

<template>
  <div class="renglon">
    <botonInterfazAceptar @aceptar="$emit('aceptar')" />
    <botonInterfazCerrar @cerrar ="$emit('cerrar')" />
  </div>
</template>

[=|=|"renglonArchivo.vue"|=|=]

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

[=|=|"renglonFormularios.vue"|=|=]

<script>
import botonFormularioRegistro from '../botones/botonFormularioRegistro.vue'
import botonFormularioCategoria from '../botones/botonFormularioCategoria.vue'
export default
{
  name: 'renglonFormularios',
  components: { botonFormularioRegistro, botonFormularioCategoria },
  emits: ['cambiarVista', 'seleccionarRegistro', 'seleccionarCategoria'],
  methods:
  {
    crearEntrada() {
      this.$emit('cambiarVista', 'formularioRegistro')
      this.$emit('seleccionarRegistro', { datos: {} })
    },
    crearCategoria() {
      this.$emit('cambiarVista', 'formularioCategoria')
      this.$emit('seleccionarCategoria', { datos: {} })
    },
  },
}
</script>

<template>
  <div class="renglon">
    <botonFormularioRegistro @cambiarVista="crearEntrada"/>
    <botonFormularioCategoria @cambiarVista="crearCategoria"/>
  </div>
</template>

[=|=|"renglonVistas.vue"|=|=]

<script>
import botonVistaConfiguracion from '../botones/botonVistaConfiguracion.vue'
import botonVistaPrincipal from '../botones/botonVistaPrincipal.vue'
import botonVistaTabla from '../botones/botonVistaTabla.vue'
export default
{
  name: 'renglonVistas',
  components: { botonVistaConfiguracion, botonVistaPrincipal, botonVistaTabla },
  emits: ['cambiarVista'],
}
</script>

<template>
  <div class="renglon">
    <botonVistaConfiguracion @cambiarVista="$emit('cambiarVista', $event)"/>
    <botonVistaPrincipal @cambiarVista="$emit('cambiarVista', $event)"/>
    <botonVistaTabla @cambiarVista="$emit('cambiarVista', $event)"/>
  </div>
</template>

[=|=|"formularioCategoria.vue"|=|=]

<script>
import inputString from '../inputs/inputString.vue'
import inputColor from '../inputs/inputColor.vue'
import inputSelector from '../inputs/inputSelector.vue'
import renglonAcciones from '../renglones/renglonAcciones.vue'
import { obtenerCategorias } from '../funciones.js'
export default
{
  name: 'formularioCategoria',
  emits: ['cerrar', 'editarCategoria', 'guardarCategoria'],
  components: { inputString, inputColor, inputSelector, renglonAcciones },
  props:
  {
    categoria: { type: Object, default: () => ({}) },
    colKey: {type: String, default: '' },
    catKey: { type: String, default: '' }
  },
  data()
  {
    const cats = obtenerCategorias()
    const columnas = Object.keys(cats).filter(c => c !== 'custom')
    return {
      nombre: this.categoria?.nombre || '',
      emoji: this.categoria?.emoji || 'ðŸ”´',
      columnas,
      colKeyLocal: this.colKey || '',
    }
  },
  watch:
  {
    categoria:
    {
      immediate: true,
      deep: true,
      handler(nueva)
      {
        this.nombre = nueva?.nombre || ''
        this.emoji = nueva?.emoji || 'ðŸ”´'
        this.colKeyLocal = this.colKey || ''
      }
    },
  },
  methods:
  {
    aceptar()
    {
      this.$emit('guardarCategoria',
      {
        colKey: this.colKeyLocal || 'custom',
        catKey: this.catKey,
        nombre: this.nombre,
        emoji: this.emoji,
      })
      this.$emit('cerrar')
    }
  },
}
</script>

<template>
  <div class="formularioCategoria">
    <inputColor v-model="emoji" />
    <inputString v-model="nombre" placeholder="Category name" />
    <inputSelector :opciones="columnas" v-model="colKeyLocal" placeholder="Link to:" />
    <renglonAcciones @aceptar="aceptar" @cerrar="$emit('cerrar')" />
  </div>
</template>

[=|=|"formularioRegistro.vue"|=|=]

<script>
import { obtenerColumnas, agregarRegistro } from '../funciones.js'
import renglonAcciones from '../renglones/renglonAcciones.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputString from '../inputs/inputString.vue'
import inputToggle from '../inputs/inputToggle.vue'
export default
{
  name: 'formularioRegistro',
  emits: ['cerrar', 'editarEntrada'],
  components: { renglonAcciones, inputNumero, inputString, inputToggle },
  props: 
  {
    entrada: { type: Object, default: () => ({}) },
    categoria: { type: Object, default: () => ({}) },
  },
  data()
  {
    const columnasObj = obtenerColumnas()
    const columnas = Object.keys(columnasObj).map(nombre =>
    {
      const tipo = columnasObj[nombre]?.tipo || 'string'
      return { nombre, tipo }
    })
    const formatearFecha = formato =>
    {
      const d = new Date()
      const pad = n => String(n).padStart(2, '0')
      const mapa = {
        YYYY: String(d.getFullYear()),
        MM:   pad(d.getMonth() + 1),
        DD:   pad(d.getDate()),
        HH:   pad(d.getHours()),
        mm:   pad(d.getMinutes()),
        ss:   pad(d.getSeconds())
      }
      let res = formato
      for (const clave in mapa) { res = res.replace(clave, mapa[clave]) }
      return res
    }
    const valores = {}
    const inicializarValores = (fuente = {}) =>
    {
      columnas.forEach(({ nombre, tipo }) =>
      {
        const valor = fuente[nombre]
        if (valor !== undefined)
        {
          if (tipo === 'numero') valores[nombre] = Number(valor)
          else if (tipo === 'toggle') valores[nombre] = Boolean(valor)
          else valores[nombre] = String(valor)
        }
      })
      if (!fuente || Object.keys(fuente).length === 0)
      {
        Object.entries(columnasObj).forEach(([key, cfg]) =>
        {
          if (
            cfg.tipo === 'fecha' &&
            cfg.fechaAutomatica &&
            cfg.fechaFormato &&
            valores[key] === undefined
          )
          {
            valores[key] = formatearFecha(cfg.fechaFormato)
          }
        })
      }
    }
    return { columnas, valores, inicializarValores }
  },
  watch:
  {
    entrada:
    {
      immediate: true,
      deep: true,
      handler(nueva) { this.inicializarValores(nueva) }
    },
   categoria: {
     immediate: true,
     handler(cat)
     {
       if (cat.colKey) { this.valores[cat.colKey] = cat.catKey }
     }
   },
  },
  methods:
  {
    inputPara(col)
    {
      if (col.tipo === 'numero') return 'inputNumero'
      if (col.tipo === 'toggle') return 'inputToggle'
      return 'inputString'
    },
    aceptar()
    {
      const nuevoRegistro = { ...this.valores }
      if (Object.keys(this.entrada).length === 0) { agregarRegistro(nuevoRegistro) }
      else { this.$emit('editarEntrada', nuevoRegistro) }
      this.$emit('cerrar')
    },
  },
}
</script>

<template>
    <div class="formularioRegistro">

        <div v-for="col in columnas" :key="col.nombre" class="campo">
            <component :is="inputPara(col)" v-model="valores[col.nombre]" :placeholder="col.nombre"/>
        </div>

        <renglonAcciones @aceptar="aceptar" @cerrar="$emit('cerrar')" />

    </div>
</template>

[=|=|"vistaConfiguracion.vue"|=|=]

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

[=|=|"vistaPrincipal.vue"|=|=]

<script>
import renglonArchivo from '../renglones/renglonArchivo.vue'
import renglonVistas from '../renglones/renglonVistas.vue'
import renglonFormularios from '../renglones/renglonFormularios.vue'
import panelBotones from '../main/panelBotones.vue'
export default
{
  name: 'vistaPrincipal',
  emits: ['cambiarVista', 'seleccionarCategoria', 'editarCategoria'],
  components:
  {
    renglonArchivo,
    renglonVistas,
    renglonFormularios,
    panelBotones,
  },
  props:
  {
    entrada: { type: Object, default: {} }
  },
  methods:
  {
    categoriaSeleccionada({ colKey, catKey })
    {
      this.$emit('seleccionarCategoria', { colKey, catKey })
      this.$emit('cambiarVista', 'formularioRegistro')
    },
    editarCategoria(payload) {
      this.$emit('editarCategoria', payload)
      this.$emit('cambiarVista', 'formularioCategoria')
    },
  },
}
</script>

<template>
  <div class="pagina">
    
    <renglonArchivo />
    <panelBotones @categoriaSeleccionada="categoriaSeleccionada" @editarCategoria="editarCategoria" />
    <renglonFormularios @cambiarVista="$emit('cambiarVista', $event)" />
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />

  </div>
</template>

[=|=|"vistaTabla.vue"|=|=]

<script>
import { filtrarRegistros, obtenerRegistros, guardarRegistros, testIgualdad } from '../funciones.js'
import renglonVistas from '../renglones/renglonVistas.vue'
import inputBuscar from '../inputs/inputBuscar.vue'
import csvTabla from '../main/csvTabla.vue'
export default
{
  name: 'vistaTabla',
  components: { csvTabla, inputBuscar, renglonVistas },
  emits: ['cambiarVista', 'seleccionarRegistro'],
  data()
  {
    return { busqueda: '', filtrados: null }
  },
  watch:
  {
    busqueda(nueva)
    {
      const resultado = filtrarRegistros(nueva)
      this.filtrados = Array.isArray(resultado) ? resultado : null
    },
  },
  methods:
  {
    editarEntrada(datos) 
    {
      this.$emit('cambiarVista', 'formularioRegistro')
      this.$emit('seleccionarRegistro', { datos })
    },
    bulkDelete()
    {
      if (!this.filtrados || !this.filtrados.length) return
      if (!confirm(`delete ${this.filtrados.length} filtered entries?`)) return
      const actuales = obtenerRegistros()
      const nuevo = actuales.filter(reg => !this.filtrados.some(f => testIgualdad(f, reg)))
      guardarRegistros(nuevo)
      this.filtrados = null
    },
  },
}
</script>

<template>
  <div class ="display">

    <div class="renglon" style="gap: .5em; align-items: center;">
      <inputBuscar v-model="busqueda" />
      <button class="inputTXT" v-if="busqueda && filtrados && filtrados.length" @click="bulkDelete" >Delete</button>
    </div>

    <csvTabla :filtrados="filtrados" @registroEliminado="filtrados = null" @editarEntrada="editarEntrada" />
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />
    
  </div>
</template>