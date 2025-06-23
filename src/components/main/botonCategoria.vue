<script>
export default
{
  name: 'botonCategoria',
  emits: ['click', 'editarCategoria', 'eliminarCategoria'],
  props:
  {
    emoji: { type: String, default: '🔴' },
    label: { type: String, default: 'categoria' },
  },
  data()
  {
    return { hover: false }
  },
  computed:
  {
    mostrarAcciones() { return this.hover }
  },
}

</script>

<template>
  <div class="categoriaWrapper" @mouseenter="hover = true" @mouseleave="hover = false">

    <button class="botonCategoria" @click="$emit('click')">
      <span v-if="emoji" class="emojiCategoria">{{ emoji }}</span>
      <span v-if="label" class="labelCategoria">{{ label }}</span>
    </button>

    <div v-if="mostrarAcciones" class="categoriaAcciones">
      <span class="iconoCAT" @click.stop="$emit('editarCategoria')">✏️</span>
      <span class="iconoCAT" @click.stop="$emit('eliminarCategoria')">❌</span>
    </div>
    
  </div>
</template>

<style scoped>
.categoriaWrapper { position: relative; display: inline-block; }
.botonCategoria
{
  height: 2.5em;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: .5em;
  padding: 0 0.8em;
  overflow: hidden;
  border: 1px solid #1b1c1c;
  border-radius: 8px;
  background: #3c3c3c;
  color: #d8dade 25%;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.05s ease;
  width: 100%;
}
.botonCategoria:hover { background: #4d4c4c }
.botonCategoria:active { transform: scale(0.95) }
.botonCategoria::after { content: ''; position: absolute; top: 0; right: 0; width: 3.5em; height: 100%; background: linear-gradient(to right, transparent, #3c3c3c) }
.emojiCategoria { display: inline-block; min-width: 1.2em; flex-shrink: 0; text-align: center; font-size: 0.5rem }
.labelCategoria { display: inline-block; white-space: nowrap; position: relative; max-width: 100% }
.categoriaAcciones { position: absolute; top: 0; bottom: 0; right: 0; display: flex; align-items: center; gap: .25em; padding: .5em; user-select: none; }
.iconoCAT { cursor: pointer; font-size: 0.5rem; background: #1b1c1c99; border-radius: 4px; padding: .5em .5em }
</style>