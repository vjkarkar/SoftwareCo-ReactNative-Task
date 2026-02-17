# SoftwareCo React Native App

React Native interview task implementation with TypeScript and functional components.

## Tech Stack

- React Native 0.84 + TypeScript
- Redux Toolkit for state management
- React Navigation (Stack + Bottom Tabs + Material Top Tabs)
- axios for API calls
- lottie-react-native for animations
- react-native-nitro-sound for audio recording

## Setup

```bash
# Install dependencies (already done)
npm install

# iOS (requires CocoaPods)
cd ios && pod install && cd ..

# Start Metro
npm start

# Run Android
npm run android

# Run iOS (Mac only)
npm run ios
```

## Build Signed Release APK

### 1. Create the release keystore (one-time setup)

**Windows (PowerShell):**
```powershell
.\android\create-keystore.ps1
```

**Mac/Linux:**
```bash
chmod +x android/create-keystore.sh
./android/create-keystore.sh
```

You'll be prompted for keystore password, key password, and certificate details. Remember these!

### 2. Configure keystore.properties

```bash
# Copy the example and edit with your passwords
copy android\keystore.properties.example android\keystore.properties   # Windows
cp android/keystore.properties.example android/keystore.properties     # Mac/Linux
```

Edit `android/keystore.properties`:
```
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=softwareco
storeFile=softwareco-release.keystore
```

### 3. Build the release APK

```bash
cd android
.\gradlew assembleRelease   # Windows
# or
./gradlew assembleRelease   # Mac/Linux
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

> **Note:** Without keystore.properties, release builds fall back to debug signing (for quick testing only).

## API Endpoints

- `POST https://dev.softwareco.com/interview/login`
- `GET https://dev.softwareco.com/interview/offers` (Hot Deals)
- `GET https://dev.softwareco.com/interview/stores`
- `GET https://dev.softwareco.com/interview/stores/:id`
- `GET https://dev.softwareco.com/interview/statistics?period=daily|weekly|monthly&filter=true`
- `GET https://dev.softwareco.com/interview/notifications`

## Project Structure

```
src/
├── api/               # API client + endpoint modules
├── components/
│   ├── common/        # Reusable primitives (Button, Card, AppHeader)
│   ├── icons/         # Shared icon components
│   └── *.tsx          # Feature-level shared UI sections
├── constants/         # Shared colors/layout constants
├── navigation/        # Auth, Main stack, Tabs
├── screens/           # Login, Home, Stores, StoreDetail, Profile
├── store/             # Redux slices (auth, notifications)
├── theme/             # Theme object composed from constants
└── types/             # TypeScript types
assets/
└── lottie/       # Lottie animation JSONs
```

## Environment

- Node: v20+
- npm: v9+
- React Native CLI
- Android Studio (latest)
- Xcode 14+ (for iOS)

## Demo Credentials

Username: user1  
Password: password

## Refactor Notes

- Reworked core UI into reusable primitives (`Button`, `Card`, `AppHeader`).
- Centralized design tokens into `constants` and consumed them through `theme`.
- Removed inline styles from screen-level list separators and shared icon components.
- Improved consistency for naming and imports by using `components/common` across screens.

## APK

Signed release APK is attached in the email.  
Path: android/app/build/outputs/apk/release/app-release.apk