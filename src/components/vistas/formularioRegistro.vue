<script>
import { obtenerColumnas, agregarRegistro } from '../funciones.js'
import renglonAcciones from '../renglones/renglonAcciones.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputString from '../inputs/inputString.vue'
import inputToggle from '../inputs/inputToggle.vue'
export default
{
    name: 'formularioRegistro',
    emits: ['cerrar'],
    components: { renglonAcciones, inputNumero, inputString, inputToggle },
    props: 
    {
        entrada: { type: Object, default: null },
    },
    data() 
    {
        const valores = {}
        const columnasObjeto = obtenerColumnas()
        const columnas = Object.keys(columnasObjeto).map(nombre => 
        {
            const tipo = columnasObjeto[nombre]?.tipo || 'string'
            return { nombre, tipo }
        })
        columnas.forEach(({ nombre, tipo }) => 
        {
            const valor = this.entrada?.[nombre]
            if (tipo === 'numero') { valores[nombre] = valor !== undefined ? Number(valor) : 0 }
            else if (tipo === 'toggle') { valores[nombre] = valor !== undefined ? Boolean(valor) : false }
            else { valores[nombre] = valor !== undefined ? String(valor) : '' }
        })
        return { columnas, valores }
    },
    watch:
    {
        entrada:
        {
            immediate: true,
            deep: true,
            handler(nuevaEntrada) 
            {
                this.columnas.forEach(({ nombre, tipo }) => 
                {
                    const valor = nuevaEntrada?.[nombre]
                    if (tipo === 'numero') { this.valores[nombre] = valor !== undefined ? Number(valor) : 0 }
                    else if (tipo === 'toggle') { this.valores[nombre] = valor !== undefined ? Boolean(valor) : false }
                    else { this.valores[nombre] = valor !== undefined ? String(valor) : '' }
                })
            }
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

        <renglonAcciones @aceptar="aceptar" @cerrar="$emit('cerrar')" />

    </div>
</template>