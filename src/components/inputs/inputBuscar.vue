<script>
export default
{
  name: 'inputBuscar',
  emits: ['update:modelValue', 'buscar'],
  props:
  {
    modelValue: { type: String, default: '' }
  },
  computed:
  {
    texto:
    {
      get() { return this.modelValue },
      set(nuevo)
      {
        this.$emit('update:modelValue', nuevo)
        this.$emit('buscar', nuevo)
      }
    }
  }
}
</script>

<template>
  <input class="inputBuscar" v-model="texto" type="text" placeholder="buscar..." />
</template>