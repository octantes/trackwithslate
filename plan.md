

---

Get-ChildItem -Recurse -Path src/components | Where-Object {
  $_.Extension -in '.vue', '.js'
} | ForEach-Object {
  $nombre = $_.Name
  $contenido = Get-Content $_.FullName -Raw
  "`n`n[=|=|`"$nombre`"|=|=]`n`n$contenido`n`n"
} | Set-Content -Encoding UTF8 NEWMVP1.vue