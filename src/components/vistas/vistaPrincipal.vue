<script>
import renglonArchivo from '../renglones/renglonArchivo.vue'
import renglonVistas from '../renglones/renglonVistas.vue'
import renglonFormularios from '../renglones/renglonFormularios.vue'
import panelBotones from '../main/panelBotones.vue'
export default
{
  name: 'vistaPrincipal',
  emits: ['cambiarVista', 'seleccionarCategoria', 'editarCategoria'],
  components:
  {
    renglonArchivo,
    renglonVistas,
    renglonFormularios,
    panelBotones,
  },
  props:
  {
    entrada: { type: Object, default: {} }
  },
  methods:
  {
    categoriaSeleccionada(payload)
    {
      this.$emit('seleccionarCategoria', payload)
      this.$emit('cambiarVista', 'formularioCategoria')
    },
    editarCategoria(payload) {
      this.$emit('editarCategoria', payload)
      this.$emit('cambiarVista', 'formularioCategoria')
    },
  },
}
</script>

<template>
  <div class="pagina">
    
    <renglonArchivo />
    <panelBotones @categoriaSeleccionada="categoriaSeleccionada" @editarCategoria="editarCategoria" />
    <renglonFormularios @cambiarVista="$emit('cambiarVista', $event)" />
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />

  </div>
</template>