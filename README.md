# React Native + Expo Blog Mobile App Documentation

## Overview

This is a production-ready React Native mobile application built with Expo SDK 52 that serves as a mobile companion to a SolidStart web blog. The app provides an intuitive interface for discovering, browsing, and reading blog posts with offline capabilities.

## Features

### Core Functionality

- **Content Discovery**: Browse posts in a beautiful grid layout with filtering by content type
- **Real-time Search**: Search posts with history and filtering capabilities
- **Author Profiles**: View author information and their published posts
- **Post Details**: Dynamic content rendering based on post type (markdown, audio, video, GIF)
- **Offline Support**: Cache posts for offline viewing with sync capabilities

### Mobile-Specific Features

- **Offline Caching**: Posts are cached locally using AsyncStorage for offline viewing
- **Pull-to-Refresh**: Refresh content with native pull gestures
- **Search History**: Local storage of recent searches
- **Network Status**: Visual indicators for offline mode
- **Share Integration**: Native sharing capabilities for posts

## Architecture

### Navigation Structure

```
TabNavigator (Bottom Tabs)
├── Explore Tab
│   ├── Main Feed (Grid of posts)
│   ├── Post Detail Screen
│   └── Author Profile Screen
├── Search Tab
│   ├── Search Interface
│   └── Search Results
└── Authors Tab
    ├── Authors List
    └── Author Profile Screen
```

### File Structure

```
app/
├── _layout.tsx                 # Root layout with framework initialization
├── (tabs)/
│   ├── _layout.tsx            # Tab navigation configuration
│   ├── explore/
│   │   ├── _layout.tsx        # Explore stack navigation
│   │   ├── index.tsx          # Main posts feed
│   │   ├── post/[id].tsx      # Post detail screen
│   │   └── author/[id].tsx    # Author profile screen
│   ├── search/
│   │   └── index.tsx          # Search interface
│   └── authors/
│       └── index.tsx          # Authors list
├── +not-found.tsx             # 404 screen

components/
├── PostCard.tsx               # Post preview card
├── AuthorCard.tsx             # Author information card
├── LoadingSpinner.tsx         # Loading state component
├── ErrorMessage.tsx           # Error state component
└── OfflineIndicator.tsx       # Offline status indicator

services/
├── api.ts                     # API client and endpoints
└── storage.ts                 # Local storage service

hooks/
├── usePosts.ts               # Posts data fetching hook
├── useNetworkStatus.ts       # Network connectivity hook
└── useFrameworkReady.ts      # Framework initialization hook

utils/
├── dateUtils.ts              # Date formatting utilities
└── formatting.ts             # Text formatting utilities

types/
└── index.ts                  # TypeScript type definitions

constants/
└── config.ts                 # App configuration and theme
```

## API Integration

The app connects to a SolidStart backend with the following endpoints:

### Posts API

- `GET /api/posts` - Retrieve posts with optional filtering
  - Query parameters: `limit`, `search`, `type` (markdown, audio, video, gif)
- `GET /api/posts/author/[authorId]` - Get posts by specific author

### Users API

- `GET /api/users/[id]` - Get user details
- `GET /api/users/username/[username]` - Get user by username

### Data Types

```typescript
type PostType = 'markdown' | 'audio' | 'video' | 'gif'

interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string
  createdAt: Date
}

interface PostWithAuthor {
  id: string
  title: string
  content: string
  contentType: PostType
  createdAt: Date
  updatedAt: Date
  author: User
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```


### Running the App

```bash
# Start the development server
npm run dev

# For web development
expo start --web

# For iOS simulator
expo start --ios

# For Android emulator
expo start --android
```

## Configuration

### API Configuration

Update the `API_BASE_URL` in `constants/config.ts` to point to your SolidStart backend:

```typescript
export const API_BASE_URL = 'https://your-solidstart-api.com';
```

### Theme Customization

The app uses a centralized theme system in `constants/config.ts`:

```typescript
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  // ... more colors
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    // ... more sizes
  },
};
```

## Key Components

### PostCard

Displays post previews in the main feed with:

- Content type indicators
- Post title and preview text
- Author information with avatar
- Publication date
- Touch interactions for navigation

### AuthorCard

Shows author information including:

- Profile avatar or placeholder
- Display name and username
- Touch interaction for author profile navigation

### LoadingSpinner & ErrorMessage

Consistent loading and error states throughout the app with:

- Customizable loading messages
- Retry functionality for errors
- Accessible design patterns

## Offline Capabilities

The app implements comprehensive offline support:

### Caching Strategy

- **Posts Caching**: Main feed posts are automatically cached
- **Search History**: Recent searches stored locally
- **Network Status**: Tracks online/offline state
- **Sync on Reconnect**: Automatic refresh when connection restored

## License

This project is licensed under the MIT License - see the LICENSE file for details.
