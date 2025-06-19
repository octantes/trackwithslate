<script>
export default
{
  name: 'inputColor',
  emits: ['update:modelValue'],
  props: 
  {
    colores: { type: Array, default: () => ['🔴','🟠','🟡','🟢','🔵','🟣','🟤','⚫','⚪'] },
    modelValue: { type: String, default: '' },
  },
  computed:
  {
    valor:
    { 
      get() { return this.modelValue },
      set(nuevo) { this.$emit('update:modelValue', nuevo) },
    },
  },
  methods:
  {
    siguienteEmoji()
    {
      const index = this.colores.indexOf(this.valor)
      const siguiente = this.colores[(index + 1) % this.colores.length]
      this.valor = siguiente
    },
  },
}
</script>

<template>
  <button type="button" class="boton" @click="siguienteEmoji">
    <span class="color">{{ valor }}</span>
  </button>
</template>

<style scoped>
.boton
{
  position: relative; 
  display: inline-flex; 
  align-items: center; 
  justify-content: flex-start; 
  gap: .5em; 
  padding: .5em .5em; 
  overflow: hidden; 
  border: 1px solid #1b1c1c; 
  border-radius: 8px; 
  background: #3c3c3c; 
  color: #d8dade; 
  font-size: 1rem; 
  cursor: pointer; 
  transition: background 0.2s ease, transform 0.05s ease;
}
.boton:hover { background: #4d4c4c; }
.boton:active { transform: scale(0.95); }
.color { font-size: 1rem; line-height: 1; }
</style>