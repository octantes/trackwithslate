<script>
export default
{
  name: 'inputString',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  computed:
  {
    valor:
    {
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
}
</script>

<template>
  <input class="input" name="inputString" type="text" v-model="valor" :placeholder="placeholder" />
</template>