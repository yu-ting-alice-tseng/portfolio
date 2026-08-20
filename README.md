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
2. C'est tout : une tâche Windows nommée « Portfolio Auto Sync » synchronise le dossier toutes les 5 minutes, sans fenêtre à garder ouverte et sans rien à lancer au démarrage.

À chaque passage, le script `auto-sync.bat` :

1. bascule sur `main` si besoin ;
2. committe les modifications locales (`Auto-update: date heure`) ;
3. récupère les commits distants (`git pull --rebase --autostash`) ;
4. pousse sur `main`.

**Journal** : `auto-sync.log` (dans le dossier du projet, ignoré par Git).

**Désinstaller** : double-cliquer sur `uninstall-auto-sync.bat`.

**Changer la fréquence** : dans `install-auto-sync.bat`, remplacer `/MO 5` par le nombre de minutes souhaité, puis relancer le fichier.

`auto-push.bat` reste disponible pour l'ancienne méthode (fenêtre ouverte en permanence) : il appelle désormais `auto-sync.bat` toutes les 30 secondes.

**En cas de conflit** : le script n'écrase jamais rien. Si le `pull` échoue, il annule le rebase, écrit `ECHEC du pull` dans `auto-sync.log` et ne pousse pas, en attendant une résolution manuelle.
