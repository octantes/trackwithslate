<script>
export default
{
  name: 'inputToggle',
  emits: ['update:modelValue'],
  props:
  {
    modelValue: { type: Boolean, default: false },
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
    alternar() { this.valor = !this.valor },
  },
}
</script>

<template>
  <div class="toggle" @click="alternar" :class="{ activo: valor }">
    <div class="circulo" />
  </div>
</template>

<style scoped>
.toggle {
  width: 38px;
  height: 20px;
  border-radius: 999px;
  background: #3c3c3c;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5px;
  transition: background 0.25s ease, border-color 0.25s ease;
  box-sizing: border-box;
}
.toggle .circulo {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--claroscuro-f);
  box-shadow: 0 0 3px rgba(0,0,0,0.3);
  border: 1.5px solid var(--clarooscuro-b);
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  will-change: transform;
}
.toggle.activo { background: #7ebdc4; border-color: #7ebdc4; }
.toggle.activo .circulo { transform: translateX(17px); background: var(--clarooscuro-a); border-color: #7ebdc4; }
</style>