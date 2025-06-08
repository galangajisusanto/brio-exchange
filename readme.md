# BrioXchange - Currency Exchange Rate Management App

A React Native mobile application for managing currency exchange rates with real-time conversion capabilities.

## Features

- 📱 Modern React Native UI with clean design
- 💱 Real-time currency conversion rates
- 🏦 Exchange rate management (CRUD operations)
- 🔍 Currency search and selection
- 🌍 International currency support with flags
- 🧪 Comprehensive unit testing
- 🏗️ Clean Architecture implementation

## Tech Stack

- **Frontend**: React Native, Expo
- **Architecture**: Clean Architecture (Domain, Data, Presentation layers)
- **Testing**: Jest
- **APIs**: Supabase (data storage), FreeCurrencyAPI (rates), RestCountries (flags)
- **UI Components**: Custom components with Ionicons

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BrioXchange
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

#### Set SUPABASE_API_KEY

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your `anon/public` API key
5. Update the API key in your code:

```javascript
// In src/domain/usecases/ExchangeUseCaseFactory.js
_generateDefaultApiClient() {
    return new ApiClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_API_KEY');
}
```

#### Set FREE_CURRENCY_API_KEY

You have two options to configure the FreeCurrencyAPI key:

**Option 1: Use the provided test key (Quick Start)**
```javascript
// In src/domain/usecases/ExchangeUseCaseFactory.js
_generateFreeCurrencyApiClient() {
    return new ApiClient('https://api.freecurrencyapi.com/v1/', 'fca_live_lW1BOpaYIVJW4RdtOuxskO6Vtq9OJbxO9FAndiqE');
}
```

**Option 2: Get your own API key (Recommended)**
1. Create an account at [FreeCurrencyAPI](https://freecurrencyapi.com)
2. Obtain your free API key from the dashboard
3. Replace the test key in the code above with your personal API key

> 💡 **Note**: The provided API key is shared for testing purposes only.

## Running the Project

### Development Mode

**Recommended Setup**: Use Expo Go with Android Simulator for development, as biometric authentication testing on iOS requires a development build.

```bash
# Start the Expo development server
npm start

# Switch to Expo Go mode (if prompted)
Press s

# Launch Android simulator
Press a
```

**Note**: While you can run on iOS Simulator using `Press i`, biometric features will only work on physical devices or with a custom development build.

## Running Unit Tests

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Structure

```
src/
├── data/
│   ├── datasources/__tests__/
│   └── repositories_impl/__tests__/
├── domain/
│   └── usecases/__tests__/
└── presentation/
    └── screens/__tests__/
```

## Project Structure

```
src/
├── data/                          # Data layer
│   ├── api_client/               # API client implementation
│   ├── datasources/              # Data sources
│   └── repositories_impl/        # Repository implementations
├── domain/                       # Domain layer
│   ├── entities/                 # Business entities
│   ├── repositories/             # Repository interfaces
│   └── usecases/                 # Business logic
└── presentation/                 # Presentation layer
    ├── components/               # Reusable UI components
    ├── screens/                  # App screens
    └── styles/                   # Styling and themes
```