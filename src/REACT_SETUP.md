# Wildlife Conservation Conference - React Conversion

This is your JavaScript project converted to React using:
- **React 18** - UI library
- **React Router v6** - Navigation and routing
- **Context API** - State management
- **Bootstrap 5** - Styling framework

## Project Structure

```
src/
├── App.jsx                    # Main app component with routing
├── App.css                    # Global styles
├── ConferenceContext.jsx     # Context provider for state management
├── validationUtils.js        # Form validation utilities
├── pages/
│   ├── Home.jsx              # Home/landing page
│   ├── AttendeeRegistration.jsx  # Attendee registration page
│   ├── SessionManagement.jsx # Session management page
│   └── ShoppingCart.jsx      # Shopping cart page
├── styles/
│   └── pages.css             # Page-specific styles
└── index.js                  # React entry point
```

## Setup Instructions

### 1. Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

### 2. Create a React App (if you don't have one)
```bash
npx create-react-app wildlife-conference
cd wildlife-conference
```

### 3. Install Dependencies
```bash
npm install react-router-dom bootstrap
```

### 4. Copy Files
Copy all the created files into your `src/` folder maintaining the directory structure.

### 5. Update public/index.html
Make sure your `public/index.html` includes Bootstrap CDN in the `<head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
```

Or import it in your main index.js:
```javascript
import 'bootstrap/dist/css/bootstrap.css';
```

### 6. Start the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000/`

## Key Changes from Original Code

### State Management
- **Before**: DOM queries (document.getElementById) and localStorage
- **After**: React Context API + localStorage for persistence

### Navigation
- **Before**: Multiple HTML files with navigation links
- **After**: React Router with single-page app navigation

### Form Handling
- **Before**: Event listeners and manual DOM manipulation
- **After**: React hooks (useState) for form state and validation

### Data Persistence
- **Before**: Direct localStorage calls in functions
- **After**: Automatic localStorage sync using useEffect in Context

### Event Handling
- **Before**: Global event listeners and onclick attributes
- **After**: React event handlers with component state

## Features

### Pages
1. **Home** (`/`) - Landing page with conference info
2. **Sign Up** (`/signup`) - Attendee registration 
3. **Sessions** (`/sessions`) - Create, edit, and manage sessions
4. **Cart** (`/cart`) - Shopping cart for session registration

### Functionality
- Form validation with real-time error display
- Attendee registration and management
- Session creation, editing, and deletion
- Session search functionality
- Shopping cart with quantity management
- Data persistence using localStorage
- Responsive Bootstrap design

## Using the Application

### Register Attendees
1. Go to Sign Up page
2. Fill in the form (* fields are required)
3. Submit to add attendees
4. View all registered attendees below the form

### Manage Sessions
1. Go to Sessions page
2. Fill in session details to create a new session
3. Search for sessions using the search bar
4. Click Edit to modify a session
5. Click Delete to remove a session

### Shopping Cart
1. Go to Cart page
2. View available sessions
3. Click "Add to Cart" to add sessions to your cart
4. Adjust quantities using +/- buttons
5. Click "Complete Registration" to checkout

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Troubleshooting

### Dependencies not installed
```bash
rm node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
PORT=3001 npm start
```

### Styles not loading
Make sure Bootstrap is imported in your index.js or index.html

### Data not persisting
Clear browser cache and localStorage:
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Delete entries with keys starting with "conference_"
4. Refresh the page

## Future Enhancements

- Add user authentication
- Implement payment processing
- Add email notifications
- Export data to PDF
- Add session ratings/reviews
- Implement checkout with real payment
- Add user profile management
