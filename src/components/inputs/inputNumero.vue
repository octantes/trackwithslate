<script>
export default
{
  name: 'inputNumero',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Number, default: 0 },
    placeholder: { type: String, default: 'Insert number' },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo)
      {
        const n = Math.max(this.min, Math.min(this.max, Number(nuevo)))
        this.$emit('update:modelValue', n)
      },
    },
  },
}
</script>

<template>
  <input class="input" name="inputNumero" type="number"  v-model.number="valor" :placeholder="placeholder" 
  :min="min !== -Infinity ? min : undefined" :max="max !== Infinity ? max : undefined" />
</template>