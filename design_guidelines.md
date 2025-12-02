# Design Guidelines: Dharamshala Municipal Corporation Payment App

## Architecture Decisions

### Authentication
**Auth Required**: The app explicitly requires user registration and login for payment tracking and municipal records.

**Authentication Implementation**:
- Use email/password authentication with phone number verification (OTP)
- Include "Continue with Google" for faster onboarding
- Mock the auth flow in prototype using local state
- Registration screens must collect:
  - Full name, phone number, email
  - Property ID (municipal property registration number)
  - Address
- Login screen with:
  - Email/phone + password
  - "Forgot Password" recovery flow
  - Privacy policy & terms of service links (placeholder URLs)
- Account screen includes:
  - Log out (with confirmation alert)
  - Profile management (edit property details)
  - Linked properties (if user owns multiple)

### Navigation Structure
**Tab Navigation** (4 tabs with floating action button for primary action):

1. **Home Tab** (Dashboard)
   - Overview of pending payments
   - Quick access to recent transactions
   - Municipal announcements

2. **Pay Tab** (Floating Action Button - Primary CTA)
   - Central payment initiation
   - Prominent circular button above tab bar

3. **History Tab**
   - Payment records and receipts
   - Search and filter functionality

4. **Profile Tab**
   - User account settings
   - Property details
   - Notifications preferences

## Screen Specifications

### 1. Dashboard/Home Screen
**Purpose**: Overview of payment status and quick actions

**Layout**:
- Header: Custom header with app logo, location badge (Dharamshala), notification bell (right)
- Main content: Scrollable view with safe area top inset: headerHeight + Spacing.xl, bottom inset: tabBarHeight + Spacing.xl
- Components:
  - Property summary card (property ID, address, owner name)
  - Pending payments list (amount, due date, type)
  - Recent transactions (last 3 items)
  - Municipal announcements banner
  - Quick action buttons (Pay Now, View All History)

### 2. Payment Submission Screen (Modal)
**Purpose**: Select rent type and enter payment details

**Layout**:
- Header: Standard navigation header with "Cancel" (left), "Pay Rent" title, non-transparent background
- Main content: Scrollable form with top inset: Spacing.xl, bottom inset: insets.bottom + Spacing.xl
- Components:
  - Property selector dropdown (if multiple properties)
  - Rent type selector (House Rent, Property Tax, Water Charges, Sewage Tax, Other)
  - Amount input field (auto-populated based on property records, editable)
  - Payment period selector (month/quarter/year)
  - Notes field (optional)
  - "Proceed to Payment" button (floating at bottom with drop shadow: shadowOffset width: 0, height: 2, shadowOpacity: 0.10, shadowRadius: 2)

### 3. Payment Confirmation Screen (Modal Stack)
**Purpose**: Review and confirm payment details before processing

**Layout**:
- Header: Standard with "Back" (left), "Confirm Payment" title
- Main content: Scrollable with top inset: Spacing.xl, bottom inset: insets.bottom + Spacing.xl
- Components:
  - Summary card (non-editable review of all details)
  - Payment method selector (UPI, Cards, Net Banking via Stripe)
  - Terms acceptance checkbox
  - "Pay ₹[Amount]" button (fixed at bottom, prominent green color)

### 4. Receipt Screen (Modal)
**Purpose**: Display successful payment receipt

**Layout**:
- Header: Custom header with "Done" (right) button only
- Main content: Scrollable with top inset: headerHeight + Spacing.xl, bottom inset: insets.bottom + Spacing.xl
- Components:
  - Success animation/icon (checkmark)
  - Receipt card (transaction ID, date, amount, property details, payment method)
  - Action buttons: "Download PDF", "Email Receipt", "Share"
  - "Return to Home" button

### 5. Payment History Screen
**Purpose**: View all past transactions and access receipts

**Layout**:
- Header: Standard with "Payment History" title, search icon (right)
- Main content: List view with top inset: Spacing.xl, bottom inset: tabBarHeight + Spacing.xl
- Components:
  - Filter chips (All, This Month, Last 3 Months, This Year)
  - Grouped list by month (section headers)
  - Transaction cards (date, type, amount, status badge, tap to view receipt)
  - Empty state when no transactions

### 6. Profile/Settings Screen
**Purpose**: Manage account and property information

**Layout**:
- Header: Standard with "Profile" title
- Main content: Scrollable with top inset: Spacing.xl, bottom inset: tabBarHeight + Spacing.xl
- Components:
  - User avatar (government-themed preset icon)
  - User name and contact info
  - Property cards list (editable)
  - Settings sections:
    - Notifications (toggle for payment reminders, announcements)
    - Language preference (English, Hindi)
    - Help & Support (contact municipal office)
    - About (app version, terms, privacy)
    - Log out button (bottom of list)

### 7. Search Screen (Modal)
**Purpose**: Search payment history

**Layout**:
- Header: Search bar integrated in header, "Cancel" (right)
- Main content: List view with top inset: headerHeight, bottom inset: insets.bottom
- Real-time search results as user types

## Design System

### Color Palette
**Primary Colors** (Indian government/municipal theme):
- Primary: #1A73E8 (Trust blue - for CTAs and active states)
- Primary Dark: #0D47A1
- Primary Light: #E3F2FD
- Secondary: #00897B (Teal - for success states)
- Accent: #F57C00 (Orange - for warnings/pending)

**Functional Colors**:
- Success: #2E7D32 (Green)
- Warning: #F57C00 (Orange)
- Error: #C62828 (Red)
- Info: #0288D1 (Light Blue)

**Neutral Colors**:
- Text Primary: #212121
- Text Secondary: #757575
- Background: #FAFAFA
- Surface: #FFFFFF
- Border: #E0E0E0
- Disabled: #BDBDBD

### Typography
- Headings: Poppins (600 weight for titles, 500 for subtitles)
- Body: Roboto (400 regular, 500 medium for emphasis)
- Numbers/Amounts: Tabular figures for consistent alignment
- Sizes: Follow Material Design type scale

### Visual Design
- Use Material Design system icons for common actions
- Use Feather icons from @expo/vector-icons for navigation and utility actions
- All touchable elements have ripple effect feedback (Material Design standard)
- Cards have subtle elevation (2dp) with light shadow
- Floating action button for "Pay" has drop shadow: shadowOffset width: 0, height: 2, shadowOpacity: 0.10, shadowRadius: 2
- Receipt cards have border and no shadow for print-friendliness

### Critical Assets
1. **Municipal Logo**: Dharamshala Municipal Corporation official emblem (header)
2. **Government-themed Avatar**: Single preset icon with building/municipal theme for user profile
3. **Success Illustrations**: Checkmark animation for successful payments
4. **Empty State Illustrations**: Simple illustrations for no payment history, no pending payments

### Accessibility Requirements
- Minimum touch target size: 48x48dp
- WCAG AA contrast ratios for all text
- Support for system font scaling (up to 200%)
- Screen reader labels for all interactive elements
- Clear focus indicators for navigation
- Support for both English and Hindi languages
- Large, clear text for amounts and transaction IDs
- High-contrast mode support for elderly users