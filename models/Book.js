const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  // 其他书籍相关信息...
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
