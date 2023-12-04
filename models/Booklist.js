const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  display: {
    type: String,
    default: 'unhidden'
  }
});

const booklistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  discription: {
    type: String
  },
  books: [{
    type: String
  }],
  accessibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  comments: [commentSchema]
}, {timestamps: true});


const Booklist = mongoose.model('Booklist', booklistSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {Booklist, Comment};
