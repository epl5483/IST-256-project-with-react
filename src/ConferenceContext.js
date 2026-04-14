import React, { createContext, useState, useEffect } from 'react';

/**
 * ConferenceContext - Global State Management
 * 
 * CONVERTED FROM: Global variables and localStorage calls spread across:
 * - attendee.js - attendee data functions
 * - session.js - session data functions  
 * - cart.js - cart data functions
 * 
 * OLD APPROACH: Direct DOM manipulation and scattered localStorage calls
 * NEW APPROACH: Centralized context using Context API (like Redux but simpler)
 * 
 * Benefits:
 * - All state in one place (easier to track)
 * - Components re-render automatically when state changes
 * - No prop drilling needed (context provides data to all children)
 * - Automatic localStorage sync via useEffect
 */
export const ConferenceContext = createContext();

/**
 * ConferenceProvider Component
 * 
 * This component manages all application state and provides it to child components.
 * Wrap your entire app with this component to enable global state access.
 * 
 * State managed:
 * - attendees: array of registered conference attendees
 * - sessions: array of conference sessions
 * - cart: array of cart items (sessions to register for)
 */
export const ConferenceProvider = ({ children }) => {
  // State variables using React hooks
  // useState returns [currentValue, functionToUpdateValue]
  const [attendees, setAttendees] = useState([]); // Array of attendees
  const [sessions, setSessions] = useState([]);   // Array of sessions
  const [cart, setCart] = useState([]);           // Array of cart items

  /**
   * Helper to perform AJAX fetch and parse JSON
   * Uses the browser fetch API to transport JSON data from the server
   */
  const fetchJson = async (url) => {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  /**
   * useEffect Hook - Runs once when component mounts (empty dependency array [])
   * 
   * OLD CODE: This was in a DOMContentLoaded event listener in attendee.js, session.js
   * NEW CODE: React runs this effect on first render
   * 
   * Purpose: Load persisted data from localStorage or remote JSON when app starts
   * Same localStorage keys as original project for data compatibility
   * 
   * AJAX TRANSPORT: If no localStorage data exists, load initial data from a JSON endpoint.
   */
  useEffect(() => {
    const loadInitialData = async () => {
      const storedAttendees = JSON.parse(localStorage.getItem('conference_attendees')) || [];
      const storedSessions = JSON.parse(localStorage.getItem('conference_session')) || [];
      const storedCart = JSON.parse(localStorage.getItem('conference_cart')) || [];

      if (storedAttendees.length || storedSessions.length || storedCart.length) {
        setAttendees(storedAttendees);
        setSessions(storedSessions);
        setCart(storedCart);
        return;
      }

      try {
        const initialData = await fetchJson('/initialData.json');
        setAttendees(initialData.attendees || []);
        setSessions(initialData.sessions || []);
        setCart(initialData.cart || []);
      } catch (error) {
        console.error('Unable to load initial data via AJAX:', error);
        setAttendees([]);
        setSessions([]);
        setCart([]);
      }
    };

    loadInitialData();
  }, []);

  /**
   * Auto-save to localStorage whenever state changes
   * 
   * OLD CODE: Manual localStorage.setItem() calls in each function (saveFormDataLocally, etc)
   * NEW CODE: React's useEffect automatically syncs state to localStorage
   * 
   * Dependency arrays [attendees], [sessions], [cart] mean:
   * "Run this effect whenever this state changes"
   */
  
  // Automatically save attendees to localStorage when attendees state changes
  useEffect(() => {
    localStorage.setItem('conference_attendees', JSON.stringify(attendees));
  }, [attendees]); // Re-run when attendees changes

  // Automatically save sessions to localStorage when sessions state changes
  useEffect(() => {
    localStorage.setItem('conference_session', JSON.stringify(sessions));
  }, [sessions]); // Re-run when sessions changes

  // Automatically save cart to localStorage when cart state changes
  useEffect(() => {
    localStorage.setItem('conference_cart', JSON.stringify(cart));
  }, [cart]); // Re-run when cart changes

  /**
   * ATTENDEE FUNCTIONS
   * 
   * OLD CODE: deleteAttendee(index) in attendee.js did:
   * - Parse from localStorage
   * - Splice from array
   * - Save back to localStorage
   * - Call displayAllAttendees() to re-render
   * 
   * NEW CODE: Simply update state. React automatically:
   * - Re-renders affected components
   * - Triggers useEffect to save to localStorage
   */
  
  // Add new attendee to the list
  // [...attendees, attendee] creates a new array with existing items + new item
  const addAttendee = (attendee) => {
    setAttendees([...attendees, attendee]);
  };

  // Delete attendee at specific index
  // filter keeps items where index doesn't match the deleted index
  const deleteAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  /**
   * SESSION FUNCTIONS
   * 
   * OLD CODE: These functions manipulated DOM directly or used addEventListener
   * - displayAllSessions() built HTML strings and inserted into DOM
   * - editSession() populated form with existing data
   * - deleteSession() removed from array and called displayAllSessions()
   * 
   * NEW CODE: Functions only update state. React handles re-rendering automatically.
   */
  
  // Add new session to the list
  const addSession = (session) => {
    setSessions([...sessions, session]);
  };

  // Update an existing session (used when editing)
  // Creates new array, updates specific index, then sets state
  const updateSession = (index, session) => {
    const updated = [...sessions];
    updated[index] = session;
    setSessions(updated);
  };

  // Delete session at specific index
  const deleteSession = (index) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  /**
   * Filter sessions by search query
   * 
   * OLD CODE: searchSessions() in session.js did:
   * - Get input value from DOM
   * - Filter array
   * - Call displayAllSessions(filtered) to re-render
   * 
   * NEW CODE: Just filter the array. Component handles re-rendering.
   */
  const filterSessions = (query) => {
    return sessions.filter(session =>
      session.sessionID.toLowerCase().includes(query.toLowerCase()) ||
      session.sessionTitle.toLowerCase().includes(query.toLowerCase()) ||
      session.workshop.toLowerCase().includes(query.toLowerCase()) ||
      session.speaker.toLowerCase().includes(query.toLowerCase())
    );
  };

  /**
   * CART FUNCTIONS
   * 
   * OLD CODE: cart.js used jQuery and manual DOM updates
   * - updateCartUI() built HTML and appended to DOM
   * - Event handlers used data attributes to track indices
   * - Manual array manipulation with splice()
   * 
   * NEW CODE: Functions update state, React handles UI rendering
   */
  
  /**
   * Add item to cart
   * If item already in cart, increment quantity
   * Otherwise, add new item with quantity 1
   */
  const addToCart = (sessionId, title, price) => {
    const existing = cart.find(item => item.id === sessionId);
    if (existing) {
      // Item already in cart - increase its quantity
      setCart(cart.map(item =>
        item.id === sessionId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // New item - add to cart with quantity 1
      setCart([...cart, { id: sessionId, title, price: parseFloat(price), quantity: 1 }]);
    }
  };

  /**
   * Update quantity of cart item
   * If quantity <= 0, remove from cart
   */
  const updateCartItemQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      const updated = [...cart];
      updated[index].quantity = quantity;
      setCart(updated);
    }
  };

  // Remove single item from cart
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Clear entire cart (used on checkout)
  const clearCart = () => {
    setCart([]);
  };

  /**
   * Calculate total price of cart
   * reduce() sums up (price × quantity) for all items
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Context Value Object
   * This object provides all state and functions to child components
   * Components access it via: const context = useContext(ConferenceContext)
   */
  const value = {
    // Attendee state and functions
    attendees,
    addAttendee,
    deleteAttendee,
    
    // Session state and functions
    sessions,
    addSession,
    updateSession,
    deleteSession,
    filterSessions,
    
    // Cart state and functions
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  };

  // Provide context to all child components
  // Any component wrapped by this can access the value object
  return React.createElement(ConferenceContext.Provider, { value: value }, children);
};
