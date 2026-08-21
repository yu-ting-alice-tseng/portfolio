' Lance auto-watch.ps1 sans aucune fenetre.
' Utilise par la tache planifiee "Portfolio Auto Sync".
Dim shell, fso, dossier
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dossier = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dossier & "\auto-watch.ps1""", 0, False
