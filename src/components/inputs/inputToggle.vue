<script>
export default
{
  name: 'inputToggle',
  props:
  {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
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
.toggle { width: 44px; height: 24px; border-radius: 999px; background: #1b1c1c; border: 1px solid #1b1c1c; display: flex; align-items: center; cursor: pointer; transition: all 0.2s ease; padding: 2px }
.toggle .circulo { width: 18px; height: 18px; border-radius: 50%; background: #d8dade; transition: transform 0.2s ease }
.toggle.activo { background: #4C9AFF; border-color: #4C9AFF }
.toggle.activo .circulo { transform: translateX(20px); background: #1b1c1c }
</style>