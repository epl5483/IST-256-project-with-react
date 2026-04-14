import React, { useEffect, useState } from 'react';
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

const ApprovalPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/orders/pending`);
      if (!response.ok) throw new Error('Unable to load pending orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Unable to update order status');
      await loadPendingOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: 'bg-success text-white py-4', key: 'header' },
      React.createElement('div', { className: 'container', key: 'header-content' },
        React.createElement('h2', { className: 'fw-bold m-0', key: 'title' }, 'Admin Approval')
      )
    ),
    React.createElement('main', { className: 'container my-5', key: 'main' }, [
      React.createElement('h1', { className: 'mb-4', key: 'headline' }, 'Pending Session Registrations'),
      error && React.createElement('div', { className: 'alert alert-danger', role: 'alert', key: 'error' }, error),
      loading ? React.createElement('p', { key: 'loading' }, 'Loading pending registrations...') :
      React.createElement('div', { className: 'row', key: 'orders' },
        orders.length === 0 ? React.createElement('p', { className: 'text-muted', key: 'empty' }, 'No pending orders at this time.') :
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
          React.createElement('div', { className: 'd-flex justify-content-end gap-2', key: 'actions' }, [
            React.createElement('button', { className: 'btn btn-danger', onClick: () => updateStatus(order.id, 'declined'), key: 'decline' }, 'Decline'),
            React.createElement('button', { className: 'btn btn-success', onClick: () => updateStatus(order.id, 'approved'), key: 'approve' }, 'Approve')
          ])
        ]))
      )
    ])
  ]);
};

export default ApprovalPage;
