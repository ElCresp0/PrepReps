# Prep Reps - Repertoire Repetition Training

## Summary

The idea of this project is to provide a simple web chess application, built mostly on available modules, showcasing technical skills of integrating and building on solutions and giving chess players a single place to focus specifically on memorizing chess openings

## components

- [chessground](https://github.com/lichess-org/chessground)
  - or [chessboard.js](https://chessboardjs.com/)?
- [chess.js](https://www.npmjs.com/package/chess.js?activeTab=readme)
- (?) [scalachess](https://github.com/lichess-org/scalachess)

## ideas

- online games importer/analyser to semi-automize prep building

## tech stack

- Svelte (lightweight frontend framework with typescript support), SvelteKit

## setup backend

```bash
cd backend
sudo systemctl start postgresql
bundle install

# set the following env vars in .env
DATABASE_USERNAME=
DATABASE_PASSWORD=
BACKEND_HOST=
BACKEND_PORT=
# and run
export $(cat .env | xargs)

bin/rails db:create
bin/rails db:migrate

# in case of issues with DB
bin/rails db:migrate:reset
# or manual intervention
bin/rails dbconsole

bin/rails server
```

## DB management

```bash
# backup
DB_TO_BACKUP=backend_development
BACKUP_NAME=dev_db_bkp.dump
pg_dump -U $DATABASE_USERNAME -d $DB_TO_BACKUP --format=c > db/backups/$BACKUP_NAME

# restore
DB_TO_RESTORE=backend_development
BACKUP_NAME=dev_db_bkp.dump
pg_restore -U $DATABASE_USERNAME -d $DB_TO_RESTORE ./db/backups/$BACKUP_NAME
```

## setup frontend

```bash
cd prep-reps
nvm use 25.2.1
npm i
npm run dev
```

## TODO

- navigating through played moves
  - bind move tree navigation buttons with keyboard arrows
    - `/train`: firstMove, prevMove, nextMove, LastMove
  - make currentPgn a list (tree) of clickable nodes
- specific chess game logic
  - promotions
  - en passant
- DB with puzzle library (Create-Read for starters)
- side panel to navigate through puzzles
