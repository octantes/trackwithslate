<script>
import { obtenerRegistros, obtenerColumnas, obtenerOpciones, obtenerLimiteEntradas, obtenerPagina, 
  eliminarRegistro, eliminarFila, testIgualdad } from '../funciones.js'
export default { name: 'csvtabla',
  props: { editable: { type: Boolean, default: false }, filtrados: { type: Array, default: null } },
  emits: ['editarEntrada', 'registroEliminado'],
  data() { return { pagina: 0, ordenColumna: null, ordenTipo: null, hoverIndex: null, actualizacion: 0 } },
  computed: {
    columnas() { return Object.keys(obtenerColumnas()) },
    registrosBase() { this.actualizacion; return Array.isArray(this.filtrados) ? this.filtrados : obtenerRegistros() },
    limite() { return obtenerLimiteEntradas() || 12 },
    filasPaginadas() { return obtenerPagina(this.registros, this.pagina, this.limite) },
    registros() { if (!this.ordenColumna || !this.ordenTipo) return this.registrosBase
      const parse = v => isNaN(v) ? v : parseFloat(v)
      return [...this.registrosBase].sort((a, b) => {
        const [valA, valB] = [parse(a[this.ordenColumna]), parse(b[this.ordenColumna])]
        if (valA === valB) return 0
        return this.ordenTipo === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
      })  
    },
  },
  methods: {
    obtenerColumnaWidth(col) { return obtenerColumnas()[col]?.width || 160 },
    eliminarEntrada(fila) { eliminarFila(fila); this.actualizacion++; this.$emit('registroEliminado') },
    prevPage() { if (this.pagina > 0) this.pagina-- },
    nextPage() { if ((this.pagina + 1) * this.limite < this.registros.length) this.pagina++},
    ordenar(col) {
      if (this.ordenColumna === col) { this.ordenTipo = this.ordenTipo === 'asc' ? 'desc' : this.ordenTipo === 'desc' ? null : 'asc'
        if (!this.ordenTipo) this.ordenColumna = null } else { this.ordenColumna = col; this.ordenTipo = 'asc' }
    },
  }
}
</script>

<template>
  <div class="tabla-wrapper">
    <div class="tabla-nav nav-left" @click="prevPage"> <span v-if="pagina > 0">◂</span> </div>
    <div class="tabla-container">
      <table>

        <thead>
          <tr>
            <th class="acciones-header"></th>
            <th v-for="col in columnas" :key="col" @click="ordenar(col)" :style="{ width: obtenerColumnaWidth(col) + 'px' }">
              <span class="col-text">{{ col }}</span>
              <span class="orden-indicador" v-if="ordenColumna === col">
              {{ ordenTipo === 'asc' ? '▾' : ordenTipo === 'desc' ? '▴' : '' }}</span>
            </th>
            <th class="acciones-header"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(fila, index) in filasPaginadas" :key="index" class="fila-wrapper" @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = null" >
            <td class="acciones-cell"></td>
            <td v-for="col in columnas" :key="col" :style="{ width: obtenerColumnaWidth(col) + 'px' }"><span>{{ fila[col] }}</span></td>
            <td class="acciones-cell">
              <div v-if="editable && hoverIndex === index" class="accionesCAT" @click.stop>
                <span class="iconoCAT" @click="$emit('editarEntrada', fila)">✏️</span>
                <span class="iconoCAT" @click="eliminarEntrada(fila)">❌</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tabla-nav nav-right" @click="nextPage"> <span v-if="(pagina + 1) * limite < registros.length">▸</span> </div>
  </div>
</template>

<style scoped>
.tabla-container table { border-collapse: collapse; table-layout: auto; }
.tabla-wrapper { display: flex; align-items: stretch; overflow: hidden; border-radius: 8px; background: #3c3c3c; }
.tabla-container { flex: none; overflow-x: auto; }
table { border: 2px solid #1b1c1c; width: max-content; color: #d8dade; font-size: 0.9rem; }
th, td { width: 160px; padding: 6px 12px; border: 1px solid #1b1c1c; text-align: left; white-space: normal; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word; background: #3c3c3c; color: #d8dade; }
th { background: #2b2c2c; color: #d8dade; cursor: pointer; position: relative; padding-right: 1.2em; font-weight: normal; }
th:hover { background: #3d3e3e; }
.orden-indicador { position: absolute; right: 4px; }
.fila-wrapper { position: relative; }
.acciones-header { background: #1b1c1c; color: #d8dade; position: relative; width: 0; padding: 0; overflow: visible; visibility: hidden; }
.acciones-cell { background: #1b1c1c; color: #d8dade; position: relative; width: 0; padding: 0; overflow: visible; visibility: hidden; }
.fila-wrapper:hover .acciones-cell { visibility: visible; }
.acciones-float { position: absolute; top: 50%; right: 0.5em; transform: translateY(-50%); display: flex; gap: 0.25em; background: #1b1c1c99; border-radius: 4px; padding: 2px 4px; pointer-events: none; z-index: 10; user-select: none; }
.icono-fila { pointer-events: auto; cursor: pointer; }
.tabla-nav { width: 1.25em; background: #1b1c1c; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
.tabla-nav:hover { background: #2b2c2c; }
.tabla-nav span { color: #d8dade; font-weight: bold; }
td { height: 4.2em; max-height: 4.2em; overflow: hidden; text-overflow: ellipsis; padding: 6px 12px; box-sizing: border-box; vertical-align: top; }
td > span { display: -webkit-box; line-clamp: 3; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
</style>