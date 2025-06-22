<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
export default
{
  name: 'inputSelector',
  emits: ['update:modelValue'],
  components: { ChevronDownIcon },
  props:
  {
    modelValue: { type: String, default: '' },
    opciones: { type: Array,  default: () => [] },
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
  <div class="inputWrapper">
    <select class="input" v-model="valor">
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="opcion in opciones" :key="opcion" :value="opcion">{{ opcion }}</option>
    </select>
    <ChevronDownIcon class="arrow"/>
  </div>
</template>