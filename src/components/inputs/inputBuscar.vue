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
  <input class="inputBuscar" name="inputBuscar" v-model="texto" type="text" placeholder="buscar..." />
</template>

<style scoped>
.inputBuscar {
  padding: .5em .8em;
  font-size: 1rem;
  border: 1px solid #1b1c1c;
  border-radius: 8px;
  background: #3c3c3c;
  color: #d8dade;
  transition: background 0.2s,
  border-color 0.2s;
}
.inputBuscar:hover { background: #4d4c4c; }
.inputBuscar:focus { background: #4d4c4c; border-color: #4C9AFF; outline: none; }
</style>