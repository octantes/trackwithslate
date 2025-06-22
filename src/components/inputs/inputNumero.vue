<script>
export default
{
  name: 'inputNumero',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo)
      {
        const n = Math.max(1, Math.min(100, Number(nuevo)))
        this.$emit('update:modelValue', n)
      },
    },
  },
}
</script>

<template>
  <input class="input" name="inputNumero" type="number"  v-model.number="valor" :placeholder="placeholder" min="1" max="100" />
</template>