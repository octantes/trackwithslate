<script>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import '../estilos.css'
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
  <div class="inputWRP">
    <select class="input" v-model="valor">
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="opcion in opciones" :key="opcion" :value="opcion">{{ opcion }}</option>
    </select>
    <ChevronDownIcon class="arrow"/>
  </div>
</template>

<style scoped>
.arrow { position: absolute; right: .8em; top: 50%; width: 1rem; height: 1rem; pointer-events: none; transform: translateY(-50%); color: #d8dade; }
</style>