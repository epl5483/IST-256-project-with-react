import React, { useState, useEffect } from 'react';
import '../styles/pages.css';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001' : '';

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-warning text-dark';
    case 'approved':
      return 'bg-success text-white';
    case 'declined':
      return 'bg-danger text-white';
    default:
      return 'bg-secondary text-white';
  }
};

const OrderHistory = () => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('conference_user_email') || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userEmail) {
      fetchOrders(userEmail);
    }
  }, [userEmail]);

  const fetchOrders = async (email) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/orders?userEmail=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Unable to load orders');
      const data = await response.json();
      setOrders(data);
      localStorage.setItem('conference_user_email', email);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    fetchOrders(userEmail.trim());
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: 'bg-success text-white py-4', key: 'header' },
      React.createElement('div', { className: 'container', key: 'header-content' },
        React.createElement('h2', { className: 'fw-bold m-0', key: 'title' }, 'Order History')
      )
    ),
    React.createElement('main', { className: 'container my-5', key: 'main' }, [
      React.createElement('h1', { className: 'mb-4', key: 'headline' }, 'Your Session Registration History'),
      React.createElement('form', { onSubmit: handleSubmit, className: 'row g-3 align-items-end mb-4', key: 'form' }, [
        React.createElement('div', { className: 'col-md-8', key: 'email-input' },
          React.createElement('label', { htmlFor: 'userEmail', className: 'form-label' }, 'Your Email Address'),
          React.createElement('input', {
            type: 'email',
            id: 'userEmail',
            className: 'form-control',
            value: userEmail,
            onChange: (e) => setUserEmail(e.target.value)
          })
        ),
        React.createElement('div', { className: 'col-md-4', key: 'submit' },
          React.createElement('button', { className: 'btn btn-success w-100', type: 'submit' }, 'Load My Orders')
        )
      ]),
      error && React.createElement('div', { className: 'alert alert-danger', role: 'alert', key: 'error' }, error),
      loading ? React.createElement('p', { key: 'loading' }, 'Loading your orders...') : 
      React.createElement('div', { className: 'row', key: 'orders' },
        orders.length === 0 ? React.createElement('p', { className: 'text-muted', key: 'empty' }, 'No orders found. Submit your session registration first.') :
        orders.map((order) => React.createElement('div', { className: 'card mb-3 p-3', key: order.id }, [
          React.createElement('div', { className: 'd-flex justify-content-between', key: 'header' }, [
            React.createElement('strong', { key: 'name' }, order.userName),
            React.createElement('span', { className: `badge ${getStatusBadgeClass(order.status)}`, key: 'status' }, order.status.charAt(0).toUpperCase() + order.status.slice(1))
          ]),
          React.createElement('p', { className: 'mb-1', key: 'email' }, `Email: ${order.userEmail}`),
          React.createElement('p', { className: 'mb-3 text-muted', key: 'date' }, `Submitted: ${new Date(order.submittedAt).toLocaleString()}`),
          React.createElement('div', { key: 'items' }, order.items.map((item, index) => React.createElement('div', { key: index, className: 'mb-2' }, [
            React.createElement('div', { key: 'title' }, item.title),
            React.createElement('small', { className: 'text-muted', key: 'qty' }, `Qty: ${item.quantity} • $${item.price.toFixed(2)}`)
          ]))),
          React.createElement('div', { className: 'fw-bold text-end', key: 'total' }, `Total: $${order.total.toFixed(2)}`)
        ]))
      )
    ])
  ]);
};

export default OrderHistory;
