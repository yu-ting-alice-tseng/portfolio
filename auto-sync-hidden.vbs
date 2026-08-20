' Lance auto-sync.bat sans afficher de fenetre.
' Utilise par la tache planifiee "Portfolio Auto Sync".
Dim shell, fso, dossier
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dossier = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run "cmd /c """ & dossier & "\auto-sync.bat""", 0, False
