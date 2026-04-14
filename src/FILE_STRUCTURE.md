# React Project File Organization

This guide explains how to organize the converted React files in your project.

## If Using Create React App

If you created a project with `npx create-react-app wildlife-conference`, your structure should look like:

```
wildlife-conference/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AttendeeRegistration.jsx
│   │   ├── SessionManagement.jsx
│   │   └── ShoppingCart.jsx
│   ├── styles/
│   │   └── pages.css
│   ├── App.jsx
│   ├── App.css
│   ├── ConferenceContext.jsx
│   ├── validationUtils.js
│   ├── index.js
│   └── index.css (optional, for global styles)
├── package.json
├── package-lock.json
└── node_modules/
```

## File Placement Guide

### Root Files (Move to `src/` folder)
1. **App.jsx** → `src/App.jsx`
2. **App.css** → `src/App.css`
3. **ConferenceContext.jsx** → `src/ConferenceContext.jsx`
4. **validationUtils.js** → `src/validationUtils.js`
5. **index.js** → `src/index.js`

### Page Components (Create `src/pages/` folder)
1. **Home.jsx** → `src/pages/Home.jsx`
2. **AttendeeRegistration.jsx** → `src/pages/AttendeeRegistration.jsx`
3. **SessionManagement.jsx** → `src/pages/SessionManagement.jsx`
4. **ShoppingCart.jsx** → `src/pages/ShoppingCart.jsx`

### Styles (Create `src/styles/` folder)
1. **pages.css** → `src/styles/pages.css`

## Creating Folders

```bash
# Navigate to src folder
cd src

# Create folders
mkdir pages
mkdir styles

# Or in one command
mkdir -p pages styles
```

## Manual Setup (Without Create React App)

If you want to use Vite or another setup:

### Step 1: Install dependencies
```bash
npm install react react-dom react-router-dom bootstrap
```

### Step 2: Create folder structure
```bash
mkdir -p src/{pages,styles}
```

### Step 3: Place files accordingly
- All .jsx files in src/ or src/pages/
- All .css files in src/styles/
- validationUtils.js in src/
- ConferenceContext.jsx in src/

## Import Paths Reference

When importing files, use relative paths based on the file structure:

```javascript
// In App.jsx (src/App.jsx)
import { ConferenceProvider } from './ConferenceContext';
import Home from './pages/Home';
import AttendeeRegistration from './pages/AttendeeRegistration';
import SessionManagement from './pages/SessionManagement';
import ShoppingCart from './pages/ShoppingCart';
import './App.css';

// In page components (src/pages/Home.jsx)
import { ConferenceContext } from '../ConferenceContext';
import '../styles/pages.css';

// In ConferenceContext.jsx (src/ConferenceContext.jsx)
// Standard imports only

// In validationUtils.js (src/validationUtils.js)
// Pure utility functions, no relative imports needed
```

## Bootstrap Setup

You have two options:

### Option 1: Import Bootstrap in index.js
```javascript
// src/index.js
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import App from './App';
```

### Option 2: CDN in public/index.html
```html
<!-- public/index.html -->
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
```

## Running Your App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Alternative: Using Vite (Faster)

If you want to use Vite instead of Create React App:

```bash
# Create project
npm create vite@latest wildlife-conference -- --template react
cd wildlife-conference

# Install dependencies
npm install react-router-dom bootstrap

# Follow the folder structure above, place files in src/

# Start development server
npm run dev
```

## Troubleshooting File Issues

### Module not found errors
- Check file paths in imports
- Make sure file extensions (.jsx, .js) are correct
- Verify folder names match exactly

### CSS not loading
- Check that CSS files are in src/styles/
- Verify import statements include correct paths
- Make sure Bootstrap is imported in index.js or index.html

### Context not working
- Verify ConferenceContext.jsx is in src/ root
- Check that App.jsx imports ConferenceProvider
- Ensure ConferenceProvider wraps entire app in App.jsx

## Next Steps

1. Place all files in correct locations
2. Run `npm install` to install dependencies
3. Run `npm start` to start development server
4. Open http://localhost:3000 in browser
5. Test all pages and functionality
6. Build for production with `npm run build`
