const express = require('express');
const app = express();
const port = 3000;

// In-memory database for demo purposes
let accounts = [];
let transactions = [];

app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.send('SBI Banking Server API');
});

// Account management endpoints
app.post('/accounts', (req, res) => {
  const { name, balance } = req.body;
  const account = {
    id: accounts.length + 1,
    name,
    balance: balance || 0,
    createdAt: new Date().toISOString()
  };
  accounts.push(account);
  res.status(201).json(account);
});

app.get('/accounts/:id', (req, res) => {
  const account = accounts.find(a => a.id === parseInt(req.params.id));
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json(account);
});

// Transaction endpoints
app.post('/transactions', (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  
  const from = accounts.find(a => a.id === fromAccount);
  const to = accounts.find(a => a.id === toAccount);
  
  if (!from || !to) return res.status(404).json({ message: 'Account not found' });
  if (from.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
  
  from.balance -= amount;
  to.balance += amount;
  
  const transaction = {
    id: transactions.length + 1,
    fromAccount,
    toAccount,
    amount,
    timestamp: new Date().toISOString()
  };
  transactions.push(transaction);
  
  res.status(201).json(transaction);
});

// Start server
app.listen(port, () => {
  console.log(`SBI Banking server running at http://localhost:${port}`);
});