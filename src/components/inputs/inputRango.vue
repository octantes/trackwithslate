<script>
export default
{
  name: 'inputRango',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
  },
  computed:
  {
    internalValue:
    {
      get() { return this.modelValue},
      set(val) { this.$emit('update:modelValue', val) },
    },
  },
}
</script>

<template>
    <input class="rango" type="range"  :min="min" :max="max" v-model.number="internalValue"/>
</template>

<style scoped>
.rango { width: 160px; appearance: none; height: 4px; border-radius: 4px; background: #555; outline: none; cursor: pointer }
</style>