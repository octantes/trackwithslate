<script>
import { ref, computed } from 'vue'
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