# StayAdmin

Angular alapú adminfelület szálláshelyek és foglalások kezeléséhez. Az alkalmazás a beadandóhoz kapott REST API-t használja.

## Előkészületek

A frontend Git-repója a `StayAdmin` mappa. A kapott `stayadmin-api` mappa ennek testvérmappája; a backend nem része a repónak.

Az API mappájában futtasd:

1. `npm install`
2. `npm run seed`
3. `npm start`

Az API címe: `http://localhost:3000`. A `seed` parancs létrehozza az alapadatokat. Későbbi futtatása visszaállítja az alapadatokat, és felülírja az API-ban addig végzett módosításokat; előtte állítsd le az API-t.

## Frontend indítása

A `StayAdmin` mappában futtasd:

1. `npm ci`
2. `npm run start`

Ezután az alkalmazás a `http://localhost:4200` címen érhető el. Az API-nak külön terminálban futnia kell.

A kapott tesztfelhasználó adatai:

- Felhasználónév: `Admin`
- Jelszó: `1234`

## Funkciók

- Bejelentkezés, kijelentkezés és védett oldalak
- Szálláshelyek listázása, szűrése, létrehozása, szerkesztése és törlése
- Foglalások listázása, státusz szerinti szűrése, visszaigazolása és lemondása
- Szálláshelyenkénti áttekintés mai adatokkal, legutóbbi foglalásokkal és közelgő érkezésekkel

## Build

A `StayAdmin` mappában futtasd: `npm run build`.