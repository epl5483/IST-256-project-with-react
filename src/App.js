import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ConferenceProvider } from './ConferenceContext';
import Home from './pages/Home';
import AttendeeRegistration from './pages/AttendeeRegistration';
import SessionManagement from './pages/SessionManagement';
import ShoppingCart from './pages/ShoppingCart';
import OrderHistory from './pages/OrderHistory';
import ApprovalPage from './pages/ApprovalPage';
import './App.css';

function NavigationBar() {
  return React.createElement(
    'header',
    { className: 'bg-success text-white py-3 mb-3' },
    React.createElement(
      'div',
      { className: 'container d-flex flex-wrap gap-2 justify-content-center' },
      [
        React.createElement(Link, { to: '/', className: 'btn btn-outline-light', key: 'nav-home' }, 'Home'),
        React.createElement(Link, { to: '/signup', className: 'btn btn-outline-light', key: 'nav-signup' }, 'Sign Up'),
        React.createElement(Link, { to: '/sessions', className: 'btn btn-outline-light', key: 'nav-sessions' }, 'Sessions'),
        React.createElement(Link, { to: '/cart', className: 'btn btn-outline-light', key: 'nav-cart' }, 'Cart'),
        React.createElement(Link, { to: '/orders', className: 'btn btn-outline-light', key: 'nav-orders' }, 'Order History'),
        React.createElement(Link, { to: '/admin', className: 'btn btn-outline-light', key: 'nav-admin' }, 'Admin')
      ]
    )
  );
}

/**
 * Main App Component
 * 
 * CONVERTED FROM: Multiple HTML files (index.html, signup.html, session.html, cart.html)
 * OLD APPROACH: Each page was a separate HTML file with inline JavaScript
 * NEW APPROACH: Single Page Application (SPA) using React Router
 * 
 * Changes made:
 * - Replaced multiple HTML pages with React components
 * - Replaced href navigation with React Router <Link> components
 * - Wrapped app with ConferenceProvider to enable global state management via Context API
 * - Router allows client-side navigation without page reloads (faster UX)
 */
function App() {
  return React.createElement(ConferenceProvider, null,
    React.createElement(Router, null,
      React.createElement(React.Fragment, null,
        React.createElement(NavigationBar, null),
        React.createElement(Routes, null, [
          React.createElement(Route, { path: "/", element: React.createElement(Home, null), key: "home" }),
          React.createElement(Route, { path: "/signup", element: React.createElement(AttendeeRegistration, null), key: "signup" }),
          React.createElement(Route, { path: "/sessions", element: React.createElement(SessionManagement, null), key: "sessions" }),
          React.createElement(Route, { path: "/cart", element: React.createElement(ShoppingCart, null), key: "cart" }),
          React.createElement(Route, { path: "/orders", element: React.createElement(OrderHistory, null), key: "orders" }),
          React.createElement(Route, { path: "/admin", element: React.createElement(ApprovalPage, null), key: "admin" })
        ])
      )
    )
  );
}

export default App;
