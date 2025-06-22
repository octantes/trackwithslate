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
      const mapa =
      {
        DD:   pad(d.getDate()),
        MM:   pad(d.getMonth() + 1),
        YYYY: String(d.getFullYear()),
        MMMM: d.toLocaleDateString('es-AR', { month: 'long' }),
        MMM:  d.toLocaleDateString('es-AR', { month: 'short' }),
        dddd: d.toLocaleDateString('es-AR', { weekday: 'long' }),
        D:    String(d.getDate()),
        HH:    pad(d.getHours()),
        H:     String(d.getHours()),
        hh:    pad(d.getHours() % 12 || 12),
        h:     String(d.getHours() % 12 || 12),
        mm:    pad(d.getMinutes()),
        ss:    pad(d.getSeconds()),
        A:     d.getHours() < 12 ? 'AM' : 'PM',
        a:     d.getHours() < 12 ? 'am' : 'pm',
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