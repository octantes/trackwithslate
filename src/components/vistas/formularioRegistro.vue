<script>
import { obtenerColumnas, agregarRegistro } from './funciones.js'
import renglonAcciones from './renglonAcciones.vue'
import inputNumero from './inputNumero.vue'
import inputString from './inputString.vue'
export default
{
  name: 'formularioRegistro',
  emits: ['cerrar', 'guardar'],
  components: { renglonAcciones, inputNumero, inputString },
  props:
  {
    entrada: { type: Object, default: null },
  },
  data()
  {
    const valores = {}
    const columnasObj = obtenerColumnas()
    const columnas = Object.keys(columnasObj).map(nombre => ({
      nombre,
      tipo: columnasObj[nombre]?.tipo || 'string',
    }))
    columnas.forEach(({ nombre, tipo }) => {
      const valor = this.entrada?.[nombre]
      valores[nombre] = tipo === 'numero'
        ? valor !== undefined ? Number(valor) : 0
        : valor !== undefined ? String(valor) : ''
    })
    return { columnas, valores }
  },
  methods:
  {
    inputPara(col) { return col.tipo === 'numero' ? 'inputNumero' : 'inputString' },
    cancelar() { this.$emit('cerrar') },
    aceptar()
    {
      const nuevoRegistro = { ...this.valores }
      if (!this.entrada) agregarRegistro(nuevoRegistro)
      this.$emit('guardar', nuevoRegistro)
      this.$emit('cerrar')
    },
  },
}
</script>

<template>
  <div class="formulario">

    <div v-for="col in columnas" :key="col.nombre" class="campo">
      <component :is="inputPara(col)" v-model="valores[col.nombre]" :placeholder="col.nombre"/>
    </div>

    <renglonAcciones @aceptar="aceptar" @cancelar="cancelar" />

  </div>
</template>