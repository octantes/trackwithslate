<script>
export default
{
  name: 'botonCustomCategoria',
  emits: [ 'click', 'editar', 'eliminar' ],
  props:
  {
    emoji: { type: String, default: '' },
    label: { type: String, default: '' },
    editable: { type: Boolean, default: false },
  },
  data()
  {
    return { hover: false }
  },
  computed:
  {
    mostrarAcciones()
    {
      return this.editable && this.hover
    }
  },
}
</script>

<template>
  <div class="wrapperCAT" @mouseenter="hover = true" @mouseleave="hover = false">
    <button class="botonCAT" @click="$emit('click')">
      <span v-if="emoji" class="emojiCAT">{{ emoji }}</span>
      <span v-if="label" class="labelCAT">{{ label }}</span>
    </button>
    <div v-if="mostrarAcciones" class="accionesCAT">
      <span class="iconoCAT" @click.stop="$emit('editar')">✏️</span>
      <span class="iconoCAT" @click.stop="$emit('eliminar')">❌</span>
    </div>
  </div>
</template>
