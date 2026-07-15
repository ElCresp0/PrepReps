# Manual tests commands

```bash
curl -X POST localhost:3000/auth/sign_up -H "Content-Type: application/json" -d '{"name": "qbxtest", "password": "password"}'
TOKEN= # paste the token from curl response

curl -X GET localhost:3000/profile -H "Authorization: Bearer $TOKEN"

curl -X POST localhost:3000/auth/sign_in -H "Content-Type: application/json" -d '{"name": "qbxtest", "password": "password"}'

curl -X GET localhost:3000/profile -H "Authorization: Bearer $TOKEN"

curl -X GET localhost:3000/puzzles -H "Authorization: Bearer $TOKEN"

curl -X POST localhost:3000/puzzles -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title": "myTestPuzzle", "pgn": "[FEN rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1] 1. e4 c5 2. Na3"}'

curl -X POST localhost:3000/puzzles -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title": "myTestPuzzle", "pgn": "[FEN rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1] 1. e4 c5 2. Na3"}'
# ERROR: title already taken

curl -X POST localhost:3000/auth/sign_up -H "Content-Type: application/json" -d '{"name": "qbxtest2", "password": "password"}'
curl -X DELETE localhost:3000/users -H "Authorization: Bearer $TOKEN"

open http://localhost:3000/users
# users index is accessible from browser without authentication
```