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
      <span v-if="pagina > 0">◂</span>
    </div>
    <div class="tabla-container">
      <table>
        <thead>
          <tr>
            <th v-for="col in columnas" :key="col" @click="ordenar(col)" :style="colStyle(col)">
              <span class="col-text">{{ col }}</span>
              <span class="orden-indicador" v-if="ordenColumna === col">
                {{ ordenTipo === 'asc' ? '▾' : ordenTipo === 'desc' ? '▴' : '' }}
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
                  <button class="iconoCAT" @click="$emit('editarEntrada', fila)">✏️</button>
                  <button class="iconoCAT" @click="eliminarEntrada(fila)">❌</button>
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
      <span v-if="(pagina + 1) * limite < registros.length">▸</span>
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
.tabla-nav { width: 1.25em; background: #1b1c1c; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
.tabla-nav:hover { background: #2b2c2c; }
</style>