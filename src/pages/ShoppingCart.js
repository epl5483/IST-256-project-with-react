import React, { useContext, useState } from 'react';
import { ConferenceContext } from '../ConferenceContext';
import '../styles/pages.css';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001' : '';

const ShoppingCart = () => {
  const { sessions, cart, addToCart, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal } = useContext(ConferenceContext);
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('conference_user_email') || '');
  const [completed, setCompleted] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const handleAddToCart = (sessionId, sessionTitle, registrationFee) => {
    const cleanPrice = registrationFee.replace(/[^0-9.]/g, '');
    addToCart(sessionId, sessionTitle, cleanPrice);
  };

  const handleQuantityChange = (index, newQuantity) => {
    updateCartItemQuantity(index, newQuantity);
  };

  const handleRemove = (index) => {
    removeFromCart(index);
  };

  const openCheckoutModal = () => {
    if (cart.length === 0) {
      setServerMessage('Your cart is empty. Add sessions before submitting.');
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      setServerMessage('Please enter your name and email before proceeding to checkout.');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter your first and last name.');
      return;
    }

    if (!address.trim()) {
      alert('Please enter your address.');
      return;
    }

    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
      alert('Please enter complete payment information.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 13) {
      alert('Please enter a valid card number.');
      return;
    }

    setServerMessage('Processing your registration...');
    setShowCheckoutModal(false);

    const payload = {
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      items: cart,
      total: cartTotal,
      checkoutInfo: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4)
      }
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to submit order');
      }

      const order = await response.json();
      setServerMessage(`Registration submitted. Status: ${order.status}`);
      localStorage.setItem('conference_user_email', userEmail.trim());
      clearCart();
      setCompleted(true);
      setFirstName('');
      setLastName('');
      setAddress('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
      setTimeout(() => setCompleted(false), 5000);
    } catch (error) {
      setCompleted(false);
      setServerMessage(error.message || 'Unable to submit registration.');
    }
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const cartTotal = getCartTotal();

  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: "bg-success text-white py-4 mb-4", key: "header" },
      React.createElement('div', { className: "container", key: "hdr-content" },
        React.createElement('h2', { className: "fw-bold m-0", key: "title" }, "Shopping Cart")
      )
    ),
    React.createElement('main', { className: "container", key: "main" }, [
      React.createElement('p', { className: "text-center text-muted mb-5", key: "lead" }, "Browse sessions, add to cart, and complete your registration"),
      ...(completed ? [React.createElement('div', { className: "alert alert-success alert-dismissible fade show", role: "alert", key: "alert" }, "Registration completed successfully!")] : []),
      React.createElement('div', { className: "row", key: "content" }, [
        React.createElement('div', { className: "col-md-8", key: "sessions-col" }, [
          React.createElement('h3', { className: "mb-4", key: "sessions-title" }, "Available Sessions"),
          React.createElement('div', { id: "productList", key: "product-list" },
            sessions.length === 0 ? React.createElement('p', { className: "text-muted" }, "No sessions available. Please add them in the Sessions page.") :
            sessions.map((session) => {
              const cleanPrice = session.registrationFee.replace(/[^0-9.]/g, '');
              const price = parseFloat(cleanPrice).toFixed(2);
              return React.createElement('div', { key: session.sessionID, className: "card mb-3 p-3 shadow-sm border-0" }, [
                React.createElement('div', { className: "d-flex justify-content-between align-items-center", key: "session-content" }, [
                  React.createElement('div', { key: "info" }, [
                    React.createElement('h5', { className: "m-0", key: "title" }, session.sessionTitle),
                    React.createElement('small', { className: "text-muted", key: "meta" }, `Speaker: ${session.speaker} | ID: ${session.sessionID}`),
                    React.createElement('p', { className: "m-0 mt-1 small", key: "details" }, `${session.workshop} (${session.duration})`)
                  ]),
                  React.createElement('div', { className: "text-end", key: "actions" }, [
                    React.createElement('p', { className: "price-text m-0 mb-2", key: "price" }, `$${price}`),
                    React.createElement('button', { className: "btn btn-primary btn-add-to-cart", onClick: () => handleAddToCart(session.sessionID, session.sessionTitle, cleanPrice), key: "btn" }, "Add to Cart")
                  ])
                ])
              ]);
            })
          )
        ]),
        React.createElement('div', { className: "col-md-4", key: "cart-col" },
          React.createElement('div', { className: "card shadow border-0" }, [
            React.createElement('div', { className: "card-header cart-header text-white py-3", key: "cart-header" },
              React.createElement('h5', { className: "m-0" }, "Your Cart")
            ),
            React.createElement('div', { className: "card-body", key: "cart-body" }, [
              React.createElement('div', { id: "cartItems", key: "cart-items" },
                cart.length === 0 ? React.createElement('p', { className: "text-muted text-center" }, "Your registration is empty") :
                cart.map((item, index) => {
                  const subtotal = (item.price * item.quantity).toFixed(2);
                  return React.createElement('div', { key: index, className: "cart-item mb-3 border-bottom pb-2" }, [
                    React.createElement('div', { className: "d-flex justify-content-between", key: "header" }, [
                      React.createElement('strong', { key: "title" }, item.title),
                      React.createElement('button', { className: "btn btn-sm text-danger btn-remove", onClick: () => handleRemove(index), key: "remove-btn" }, "×")
                    ]),
                    React.createElement('div', { className: "d-flex justify-content-between align-items-center mt-1", key: "controls" }, [
                      React.createElement('div', { className: "btn-group btn-group-sm", key: "qty" }, [
                        React.createElement('button', { className: "btn btn-light border btn-qty-minus", onClick: () => handleQuantityChange(index, item.quantity - 1), key: "minus" }, "-"),
                        React.createElement('span', { className: "btn btn-light border disabled", key: "qty-display" }, item.quantity),
                        React.createElement('button', { className: "btn btn-light border btn-qty-plus", onClick: () => handleQuantityChange(index, item.quantity + 1), key: "plus" }, "+")
                      ]),
                      React.createElement('span', { className: "text-muted", key: "subtotal" }, `$${subtotal}`)
                    ])
                  ]);
                })
              ),
              React.createElement('div', { className: "mb-3", key: "user-name" }, [
                React.createElement('label', { htmlFor: 'userName', className: 'form-label' }, 'Your Name'),
                React.createElement('input', {
                  id: 'userName',
                  type: 'text',
                  className: 'form-control',
                  value: userName,
                  onChange: (e) => setUserName(e.target.value)
                })
              ]),
              React.createElement('div', { className: "mb-3", key: "user-email" }, [
                React.createElement('label', { htmlFor: 'userEmail', className: 'form-label' }, 'Your Email'),
                React.createElement('input', {
                  id: 'userEmail',
                  type: 'email',
                  className: 'form-control',
                  value: userEmail,
                  onChange: (e) => setUserEmail(e.target.value)
                })
              ]),
              serverMessage && React.createElement('div', { className: 'alert alert-info', role: 'alert', key: 'message' }, serverMessage),
              React.createElement('hr', { key: "divider" }),
              React.createElement('div', { className: "d-flex justify-content-between align-items-center fw-bold fs-5", key: "total" }, [
                React.createElement('span', { key: "label" }, "Total:"),
                React.createElement('span', { id: "cartTotal", key: "amount" }, `$${cartTotal.toFixed(2)}`)
              ]),
              React.createElement('button', { id: "checkoutBtn", className: "btn btn-success w-100 mt-3", onClick: openCheckoutModal, disabled: cart.length === 0, key: "checkout" }, "Submit Registration")
            ])
          ])
        )
      ])
    ]),
    showCheckoutModal && React.createElement('div', { className: 'modal-backdrop fade show', style: { display: 'block' }, key: 'modal-backdrop' }),
    showCheckoutModal && React.createElement('div', { className: 'modal fade show', style: { display: 'block' }, tabIndex: -1, key: 'checkout-modal' }, [
      React.createElement('div', { className: 'modal-dialog modal-dialog-centered', key: 'dialog' }, [
        React.createElement('div', { className: 'modal-content', key: 'content' }, [
          React.createElement('div', { className: 'modal-header bg-success text-white', key: 'header' }, [
            React.createElement('h5', { className: 'modal-title', key: 'title' }, 'Checkout'),
            React.createElement('button', { 
              type: 'button', 
              className: 'btn-close btn-close-white', 
              onClick: closeCheckoutModal,
              key: 'close-btn'
            })
          ]),
          React.createElement('div', { className: 'modal-body', key: 'body' }, [
            React.createElement('h6', { className: 'mb-3', key: 'billing-heading' }, 'Billing Information'),
            React.createElement('div', { className: 'row mb-3', key: 'names' }, [
              React.createElement('div', { className: 'col-md-6', key: 'fn' }, [
                React.createElement('label', { htmlFor: 'firstName', className: 'form-label' }, 'First Name *'),
                React.createElement('input', {
                  id: 'firstName',
                  type: 'text',
                  className: 'form-control',
                  value: firstName,
                  onChange: (e) => setFirstName(e.target.value),
                  key: 'fn-input'
                })
              ]),
              React.createElement('div', { className: 'col-md-6', key: 'ln' }, [
                React.createElement('label', { htmlFor: 'lastName', className: 'form-label' }, 'Last Name *'),
                React.createElement('input', {
                  id: 'lastName',
                  type: 'text',
                  className: 'form-control',
                  value: lastName,
                  onChange: (e) => setLastName(e.target.value),
                  key: 'ln-input'
                })
              ])
            ]),
            React.createElement('div', { className: 'mb-3', key: 'email-checkout' }, [
              React.createElement('label', { htmlFor: 'checkoutEmail', className: 'form-label' }, 'Email *'),
              React.createElement('input', {
                id: 'checkoutEmail',
                type: 'email',
                className: 'form-control',
                value: userEmail,
                onChange: (e) => setUserEmail(e.target.value),
                key: 'email-input'
              })
            ]),
            React.createElement('div', { className: 'mb-3', key: 'address' }, [
              React.createElement('label', { htmlFor: 'address', className: 'form-label' }, 'Address *'),
              React.createElement('input', {
                id: 'address',
                type: 'text',
                className: 'form-control',
                placeholder: 'Street address, city, state, ZIP',
                value: address,
                onChange: (e) => setAddress(e.target.value),
                key: 'addr-input'
              })
            ]),
            React.createElement('h6', { className: 'mt-4 mb-3', key: 'payment-heading' }, 'Payment Information'),
            React.createElement('div', { className: 'mb-3', key: 'card' }, [
              React.createElement('label', { htmlFor: 'cardNumber', className: 'form-label' }, 'Card Number *'),
              React.createElement('input', {
                id: 'cardNumber',
                type: 'text',
                className: 'form-control',
                placeholder: '1234 5678 9012 3456',
                value: cardNumber,
                onChange: (e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim()),
                maxLength: '19',
                key: 'card-input'
              })
            ]),
            React.createElement('div', { className: 'row mb-3', key: 'expiry-cvc' }, [
              React.createElement('div', { className: 'col-md-6', key: 'expiry' }, [
                React.createElement('label', { htmlFor: 'cardExpiry', className: 'form-label' }, 'Expiry (MM/YY) *'),
                React.createElement('input', {
                  id: 'cardExpiry',
                  type: 'text',
                  className: 'form-control',
                  placeholder: 'MM/YY',
                  value: cardExpiry,
                  onChange: (e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    }
                    setCardExpiry(val);
                  },
                  maxLength: '5',
                  key: 'expiry-input'
                })
              ]),
              React.createElement('div', { className: 'col-md-6', key: 'cvc' }, [
                React.createElement('label', { htmlFor: 'cardCVC', className: 'form-label' }, 'CVC *'),
                React.createElement('input', {
                  id: 'cardCVC',
                  type: 'text',
                  className: 'form-control',
                  placeholder: '123',
                  value: cardCVC,
                  onChange: (e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3)),
                  maxLength: '3',
                  key: 'cvc-input'
                })
              ])
            ]),
            React.createElement('div', { className: 'alert alert-info', key: 'note' }, 'Your card information is secure and will only be stored as the last 4 digits.')
          ]),
          React.createElement('div', { className: 'modal-footer', key: 'footer' }, [
            React.createElement('button', { 
              type: 'button', 
              className: 'btn btn-secondary', 
              onClick: closeCheckoutModal,
              key: 'cancel-btn'
            }, 'Cancel'),
            React.createElement('button', { 
              type: 'button', 
              className: 'btn btn-success', 
              onClick: handleCheckoutSubmit,
              key: 'confirm-btn'
            }, `Complete Purchase ($${cartTotal.toFixed(2)})`)
          ])
        ])
      ])
    ]),
    React.createElement('footer', { className: "bg-dark text-white text-center py-3 mt-5", key: "footer" },
      React.createElement('p', null, "© 2026 Wildlife Conservation Conference | IST 256 Group Project")
    )
  ]);
};

export default ShoppingCart;