<script>
import { obtenerColumnas, agregarRegistro } from '../funciones.js'
import renglonAcciones from '../renglones/renglonAcciones.vue'
import inputNumero from '../inputs/inputNumero.vue'
import inputString from '../inputs/inputString.vue'
export default
{
    name: 'formularioRegistro',
    emits: ['cerrar'],
    components: { renglonAcciones, inputNumero, inputString },
    props: 
    {
        entrada: 
        { 
            type: Object, 
            default: null 
        },
    },
    data() 
    {
        const valores = {}
        const columnasObj = obtenerColumnas()
        const columnas = Object.keys(columnasObj).map(nombre => 
        ({
            nombre,
            tipo: columnasObj[nombre]?.tipo || 'string',
        }))
        columnas.forEach(({ nombre, tipo }) => 
        {
            const valor = this.entrada?.[nombre]
            valores[nombre] = tipo === 'numero'
                ? valor !== undefined ? Number(valor) : 0
                : valor !== undefined ? String(valor) : ''
        })
        return { columnas, valores }
    },
    methods: 
    {
        inputPara(col) 
        { 
            return col.tipo === 'numero' ? 'inputNumero' : 'inputString' 
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