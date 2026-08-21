## Portfolio de Yu‑Ting Tseng

Site personnel en une page pour présenter mon parcours, mes expériences et quelques projets en marketing digital et analyse de données.

### Démarrer le site en local

1. Installer [Node.js](https://nodejs.org/) si ce n’est pas déjà fait.
2. Depuis un terminal, aller dans le dossier du projet :

   ```bash
   cd "c:\Users\Bonita\Desktop\00_Personal Document\07_Portfolio\Personal Website"
   ```

3. Lancer un petit serveur local :

   ```bash
   npm run start
   ```

4. Ouvrir ensuite `http://localhost:3000` (ou l’URL indiquée dans le terminal) dans votre navigateur.

### Personnalisation

- Mettre à jour les textes dans `index.html` (sections « Expériences », « Projets », etc.).
- Adapter les couleurs, polices et espacements dans `style.css`.
- Remplacer le rectangle de portrait par une vraie photo en ajoutant une image dans la carte de profil.


### Synchronisation automatique avec GitHub

Le site est publié depuis la branche `main` : tout ce qui est poussé sur `main` part en ligne.

**Installation (une seule fois)**

1. Double-cliquer sur `install-auto-sync.bat`.
2. C'est tout. Rien à ouvrir ensuite, rien à garder à l'écran : la tâche Windows « Portfolio Auto Sync » démarre la surveillance à chaque ouverture de session.

**Fonctionnement**

- `auto-watch.ps1` surveille le dossier en continu (sous-dossiers compris).
- Dès qu'un fichier est modifié, un compte à rebours d'**une minute** démarre. Chaque nouvelle modification le relance : la synchronisation ne part donc qu'une fois les modifications terminées.
- Un **contrôle de sécurité toutes les 30 minutes** récupère les commits poussés depuis GitHub (travail fait ailleurs) même si rien n'a changé en local.
- Sont ignorés : `.git`, `node_modules`, `auto-sync.log`, `desktop.ini` et les fichiers temporaires (`~$…`, `.tmp`, `.swp`).

À chaque déclenchement, `auto-sync.bat` :

1. supprime les `desktop.ini` déposés par Windows / OneDrive dans `.git` ;
2. bascule sur `main` si besoin ;
3. committe les modifications locales (`Auto-update: date heure`) ;
4. récupère les commits distants (`git pull --rebase --autostash`) ;
5. pousse sur `main`.

**Journal** : `auto-sync.log` (dans le dossier du projet, ignoré par Git).

**Désinstaller** : double-cliquer sur `uninstall-auto-sync.bat` (supprime la tâche et arrête la surveillance en cours).

**Sur batterie** : la tâche est enregistrée avec `AllowStartIfOnBatteries`, `DontStopIfGoingOnBatteries` et `StartWhenAvailable` : elle fonctionne aussi sur batterie et rattrape les passages manqués (PC éteint, veille).

**Changer les délais** : en haut de `auto-watch.ps1`, `$debounceSeconds` (défaut 60) et `$fullSyncMinutes` (défaut 30).

**En cas de conflit** : rien n'est jamais écrasé. Si le `pull` échoue, le script annule le rebase, écrit `ECHEC du pull` dans `auto-sync.log` et ne pousse pas, en attendant une résolution manuelle.

**Erreur `fatal: bad object refs/desktop.ini`** : Windows / OneDrive a déposé un `desktop.ini` dans `.git`. Double-cliquer sur `fix-git-desktop-ini.bat` (le nettoyage est aussi fait automatiquement à chaque synchronisation).
