<script>
export default { name: 'csvbuscar',
  emits: ['filtrar'],
  data() { return { texto: '' } },
  watch: { texto() { this.buscar() } },
  methods: {
    buscar() { const input = this.texto.trim().toLowerCase()
      if (!input) return this.$emit('filtrar', null)
      const registros = JSON.parse(localStorage.getItem('slateRegistros') || '[]')
      const resultado = registros.filter(registro => {
        return Object.values(registro).some(valor => String(valor).toLowerCase().includes(input))})
        this.$emit('filtrar', resultado)
    }
  },
}
</script>

<template>
  <input v-model="texto" type="text" placeholder="buscar..." class="buscar"/>
</template>