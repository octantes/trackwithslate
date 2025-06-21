<script>
import renglonArchivo from '../renglones/renglonArchivo.vue'
import renglonVistas from '../renglones/renglonVistas.vue'
import botonFormularioRegistro from '../botones/botonFormularioRegistro.vue'
import botonFormularioCategoria from '../botones/botonFormularioCategoria.vue'
import panelBotones from '../main/panelBotones.vue'
export default
{
  name: 'vistaPrincipal',
  emits: ['cambiarVista', 'cerrar', 'seleccionar', 'editar'],
  components:
  {
    renglonArchivo,
    renglonVistas,
    botonFormularioRegistro,
    botonFormularioCategoria,
    panelBotones,
  },
  props:
  {
    entrada: { type: Object, default: null }
  },
  methods:
  {
    categoriaSeleccionada(payload)
    {
      this.$emit('seleccionar', payload)
      this.$emit('cambiarVista', 'formularioRegistro')
    },
    editarCategoria(payload) {
      this.$emit('editar', payload)
      this.$emit('cambiarVista', 'formularioRegistro')
    },
  },
}
</script>

<template>
  <div class="pagina">
    
    <renglonArchivo />
    <panelBotones @categoria-seleccionada="categoriaSeleccionada" @editar-categoria="editarCategoria"/>

    <div class="renglon">
      <botonFormularioRegistro @cambiarVista="$emit('cambiarVista', $event)"/>
      <botonFormularioCategoria @cambiarVista="$emit('cambiarVista', $event)"/>
    </div>
    
    <renglonVistas @cambiarVista="$emit('cambiarVista', $event)" />

  </div>
</template>