Get-ChildItem -Recurse -Path src/components | Where-Object {
  $_.Extension -in '.vue', '.js'
} | ForEach-Object {
  $nombre = $_.Name
  $contenido = Get-Content $_.FullName -Raw
  "[=|=|`"$nombre`"|=|=]`n$contenido"
} | Set-Content -Encoding UTF8 NEWMVP3.vue

---

el modo bulk delete deberia ser al filtrar por busqueda (buscar x y opcion para bulk delete al lado de la barra)
.arreglar ordenar por fecha al tocar el header de fecha
tambien aplicar el texto base en ingles + poner los alert en la funcionalidad de modals