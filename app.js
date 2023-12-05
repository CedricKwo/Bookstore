const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const auth = require('./routes/auth');
const booklistRoutes = require('./routes/booklistRoutes');
const config = require('./config');

const app = express();

mongoose.connect(config.mongodb.uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', auth);
app.use('/api/booklists', booklistRoutes);

const PORT = process.env.PORT || config.app.port;
const Host = '0.0.0.0';
app.listen(PORT, Host, () => {
  console.log(`Server running on port ${PORT}`);
});
