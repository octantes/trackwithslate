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
  <div class="tick-toggle" @click="alternar" :class="{ activo: valor }">
    <span v-if="valor" class="tick">✔</span>
  </div>
</template>

<style scoped>
.tick-toggle {
  width: 1rem;
  height: 1rem;
  border-radius: 3px;
  background: #3c3c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s;
}
.tick-toggle.activo {
  background: #7ebdc4;
}
.tick {
  color: #1b1c1c;
  font-size: .7rem;
  font-weight: bold;
  user-select: none;
}
</style>