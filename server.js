const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 5001;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(cors());
app.use(express.json());

async function readOrders() {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

app.get('/api/orders', async (req, res) => {
  const orders = await readOrders();
  const { userEmail } = req.query;
  if (userEmail) {
    return res.json(orders.filter(order => order.userEmail === userEmail));
  }
  res.json(orders);
});

app.get('/api/orders/pending', async (req, res) => {
  const orders = await readOrders();
  res.json(orders.filter(order => order.status === 'pending'));
});

app.post('/api/orders', async (req, res) => {
  const { userName, userEmail, items, total } = req.body;
  if (!userEmail || !userName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing order data: userName, userEmail, and cart items are required.' });
  }

  const orders = await readOrders();
  const newOrder = {
    id: `order-${Date.now()}`,
    userName,
    userEmail,
    items,
    total: parseFloat(total) || 0,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  await writeOrders(orders);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, approved, or declined.' });
  }

  const orders = await readOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.status = status;
  await writeOrders(orders);
  res.json(order);
});

app.use(express.static(path.join(__dirname, 'build')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
