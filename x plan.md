para mas adelante, selector de parser simple o papaparse en configuracion
ordenar por fecha cuando se toca el header de una columna tipo fecha esta roto
tambien aplicar el texto base en ingles + poner los alert en la funcionalidad de modals

1. falta una forma de ocultar columnas desde la configuracion
2. estaria bueno sumar una forma de marcar entradas para edicion por lote en tabla

- unificar estilos css de los botones

a. crear funcionalidad de edicion para categorias con emoji y cambio de nombre (emulando catFormulario)
b. crear menu de emojis y dar estilo custom para la app segun el resto de conceptos de diseño de la app
c. crear panel de categorias desvinculadas emulando el de la version inicial y sumar a la configuracion

---

Get-ChildItem -Recurse -Path src/components | Where-Object {
  $_.Extension -in '.vue', '.js'
} | ForEach-Object {
  $nombre = $_.Name
  $contenido = Get-Content $_.FullName -Raw
  "[=|=|`"$nombre`"|=|=]`n$contenido"
} | Set-Content -Encoding UTF8 NEWMVP3.vue

---

. integrar el componente de columnas desvinculadas
. las categorias custom por ahora no hacen nada
- antes se creaba un apartado "vincular a:" con un selector de las columnas existentes
.las categorias de tipo numerico tienen max, deberia ser opcional y usarse sin max ni min en formulario
.creacion de columnas nuevas

el modo bulk delete deberia ser al filtrar por busqueda (buscar x y opcion para bulk delete al lado de la barra)