# Dharamshala Municipal Corporation Payment App

## Overview
A mobile payment application for the Municipal Corporation of Dharamshala that allows residents to pay various municipal dues including house rent, property tax, water charges, and sewage tax. Built with React Native and Expo.

## Features
- **User Authentication**: Registration and login with email/password
- **Dashboard**: Overview of property details and recent transactions
- **Payment Submission**: Select payment type, enter amount, and make payments
- **Receipt Generation**: Digital receipts with sharing capability
- **Payment History**: View all past transactions with filtering
- **Profile Management**: Edit user details and property information

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation 7 (Bottom tabs + Stack navigators)
- **State Management**: React Context API
- **Local Storage**: AsyncStorage for data persistence
- **UI Components**: Custom themed components with iOS 26 liquid glass design influence
- **Styling**: StyleSheet with design tokens

## Project Structure
```
├── App.tsx                    # Root component with providers
├── contexts/
│   ├── AuthContext.tsx        # Authentication state management
│   └── PaymentContext.tsx     # Payment data management
├── navigation/
│   ├── MainTabNavigator.tsx   # Bottom tab navigation
│   ├── AuthStackNavigator.tsx # Login/Register flow
│   ├── HomeStackNavigator.tsx # Dashboard and payment screens
│   ├── HistoryStackNavigator.tsx # Payment history
│   └── ProfileStackNavigator.tsx # Settings and profile
├── screens/
│   ├── LoginScreen.tsx        # User login
│   ├── RegisterScreen.tsx     # User registration
│   ├── DashboardScreen.tsx    # Main dashboard
│   ├── PaymentFormScreen.tsx  # Payment entry form
│   ├── PaymentConfirmScreen.tsx # Payment confirmation
│   ├── ReceiptScreen.tsx      # Payment receipt
│   ├── HistoryScreen.tsx      # Transaction history
│   ├── SettingsScreen.tsx     # Profile and settings
│   └── EditProfileScreen.tsx  # Edit user profile
├── components/
│   ├── Button.tsx             # Primary button with animation
│   ├── Card.tsx               # Card component with elevation
│   ├── HeaderTitle.tsx        # Custom header with logo
│   ├── ThemedText.tsx         # Theme-aware text
│   ├── ThemedView.tsx         # Theme-aware view
│   ├── ScreenScrollView.tsx   # Safe area scroll view
│   ├── ScreenKeyboardAwareScrollView.tsx # Keyboard-aware scroll
│   ├── ScreenFlatList.tsx     # Safe area list
│   └── ErrorBoundary.tsx      # Error handling
├── utils/
│   └── storage.ts             # AsyncStorage utilities and helpers
├── hooks/
│   ├── useTheme.ts            # Theme access hook
│   ├── useColorScheme.ts      # System color scheme
│   └── useScreenInsets.ts     # Safe area calculations
└── constants/
    └── theme.ts               # Design tokens and colors
```

## Design System
- **Primary Color**: #1A73E8 (Trust blue)
- **Secondary Color**: #00897B (Teal)
- **Success**: #2E7D32 (Green)
- **Warning**: #F57C00 (Orange)
- **Error**: #C62828 (Red)

## Running the App
```bash
npm run dev
```
- Scan QR code with Expo Go app on mobile device
- Or open web version at http://localhost:8081

## Recent Changes
- December 2024: Initial implementation with full payment flow
- Authentication with local storage
- Dashboard with property card and quick actions
- Payment form with type selection
- Receipt generation with share functionality
- History screen with filtering
- Profile management with logout
