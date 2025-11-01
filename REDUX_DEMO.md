# Redux Toolkit + Redux-Saga + Redux Thunk Demo

This project demonstrates a complete React application using Redux Toolkit with both Redux-Saga and Redux Thunk middleware, implemented with a feature-based folder structure.

## 🏗️ Architecture

### Folder Structure

```
src/
├── components/
│   ├── header/           # Navigation header
│   ├── layout/           # Main layout component
│   └── HomePage/         # Welcome page
├── features/
│   ├── feature-1/        # Redux-Saga feature
│   │   ├── slice.ts      # Redux Toolkit slice
│   │   ├── saga.ts       # Redux-Saga handlers
│   │   └── index.tsx     # Feature component
│   └── feature-2/        # Redux Thunk feature
│       ├── slice.ts      # Redux Toolkit slice
│       ├── thunk.ts      # Redux Thunk async actions
│       └── index.tsx     # Feature component
├── routes/
│   └── index.tsx         # Router configuration
└── store/
    ├── index.ts          # Store configuration
    └── rootSaga.ts       # Root saga setup
```

## 🚀 Features

### State Management

- **Redux Toolkit**: Modern Redux with reduced boilerplate
- **Redux-Saga**: For complex async flows and side effects
- **Redux Thunk**: For simple async operations
- **TypeScript**: Full type safety throughout the application

### UI & Routing

- **React Router v6**: Modern routing with nested routes
- **Mantine UI**: Clean, accessible components
- **SCSS Modules**: Scoped styling
- **Responsive Layout**: Toggleable sidebar with modern design

### Demo Features

1. **Saga Page (`/saga`)**: Demonstrates Redux-Saga with:
   - Mock API calls with simulated delays
   - Error handling
   - Loading states
   - Data fetching and clearing

2. **Thunk Page (`/thunk`)**: Demonstrates Redux Thunk with:
   - Async actions using `createAsyncThunk`
   - Automatic loading/error state management
   - Promise-based API calls

## 🎯 Implementation Highlights

### Redux Store Setup

- Combines both Saga and Thunk middleware
- Properly typed with TypeScript
- Feature-based state slices

### Saga Implementation

- Uses generator functions for async flow control
- Implements takeEvery pattern for action handling
- Proper error handling with try/catch

### Thunk Implementation

- Uses createAsyncThunk for simplified async actions
- Automatic handling of pending/fulfilled/rejected states
- Integration with Redux Toolkit's extraReducers

### Layout Features

- Responsive design with toggleable sidebar
- Dynamic page names based on current route
- Clean navigation with active state indicators
- Footer with application info

## 🛠️ Technologies Used

- **React 19+**: Latest React with functional components
- **Redux Toolkit**: Modern Redux state management
- **Redux-Saga**: Advanced async flow control
- **React-Redux**: React bindings for Redux
- **React Router v6**: Client-side routing
- **Mantine**: UI component library
- **TypeScript**: Type safety
- **SCSS**: Advanced styling
- **Vite**: Fast build tool

## 🏃‍♂️ Running the Application

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Visit http://localhost:5174 (or the port shown in terminal)
```

## 📱 Usage

1. **Home Page**: Overview and navigation to demo features
2. **Saga Page**: Click "Fetch Data via Saga" to see Redux-Saga in action
3. **Thunk Page**: Click "Fetch Data via Thunk" to see Redux Thunk in action
4. **Sidebar**: Toggle the right sidebar using the button in the page header
5. **Navigation**: Use header links to switch between features

## 🔍 Key Learning Points

- **Middleware Coexistence**: Redux-Saga and Thunk can work together
- **Feature-Based Architecture**: Organized by domain, not by type
- **Type Safety**: Full TypeScript integration throughout
- **Modern Patterns**: Latest React and Redux best practices
- **UI/UX**: Clean, responsive design with Mantine components

This implementation provides a solid foundation for building complex React applications with advanced state management needs.
