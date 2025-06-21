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
  props: { entrada: { type: Object, default: {} } },
  data()
  {
    const columnasObj = obtenerColumnas()
    const columnas = Object.keys(columnasObj).map(nombre =>
    {
      const tipo = columnasObj[nombre]?.tipo || 'string'
      return { nombre, tipo }
    })
    const valores = {}
    const inicializarValores = (fuente = {}) =>
    {
      columnas.forEach(({ nombre, tipo }) =>
      {
        const valor = fuente[nombre]
        if (tipo === 'numero') valores[nombre] = valor !== undefined ? Number(valor) : 0
        else if (tipo === 'toggle') valores[nombre] = valor !== undefined ? Boolean(valor) : false
        else valores[nombre] = valor !== undefined ? String(valor) : ''
      })
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
    }
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
      if (!this.entrada) agregarRegistro(nuevoRegistro)
      else this.$emit('editarEntrada', nuevoRegistro)
      this.$emit('cerrar')
    }
  }
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