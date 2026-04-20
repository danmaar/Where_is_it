# Where Is It?

Offline Android inventory app for home storage tracking. The app helps keep items organized, browse locations as a tree, search quickly, manage favorites, and store everything locally with SQLite.

## Download

- [Download latest APK](./Download/where-is-it.apk)

## Stack

- Expo + React Native + TypeScript
- Expo Router
- SQLite (`expo-sqlite`)
- React Native Paper
- Zustand
- React Hook Form + Zod

## Features

- Nested location tree with collapse and expand support
- Item cards with quick favorite toggle
- Quick quantity editing on the Items tab
- Light and dark theme support with system theme detection
- Search by item name and tags
- Full storage path display
- JSON export and import
- Offline-first local storage

## Run locally

```bash
npm install
npx expo start
```

For Android:

```bash
npx expo run:android
```

## APK

The repository includes a ready-to-install Android package in the `Download/` folder.
