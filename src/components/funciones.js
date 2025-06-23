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
    unicas.forEach(name => { if (!cats[key][name]) { cats[key][name] = { nombre: name, emoji: '🔴', vinculada: true }}})} else { delete cats[key] }
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