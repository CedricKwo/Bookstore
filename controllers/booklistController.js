const booklistService = require('../services/booklistService');


// User register
exports.createNewBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const bookListInfo = req.body;

        const bookList = await booklistService.createNewBooklist(userId, bookListInfo);
  
        let statusCode = 200;
        let message = bookList;

        console.log("bookList:", bookList);

        if (bookList === 1) {
            statusCode = 401;
            message = 'User not found';
            console.log("message:", message);
            
        }
  
        else if (bookList === 2) {
            statusCode = 402;
            message = 'Each user can only create up to 20 booklists';
            console.log("message:", message);
            
        }

        else if (bookList === 3) {
            statusCode = 403;
            message = 'Booklist name has been used';
            console.log("message:", message);
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Request to add a book to booklist
exports.requestAddToBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const bookId = req.body.bookId;

        const booklistRes = await booklistService.requestAddToBooklist(userId, bookId);
  
        console.log("booklistRes: ", booklistRes);
        
        const userBooklist = booklistRes.bookLists;
        let statusCode = 200;
        let message = {userBooklist, bookId};
        console.log("message:", message);

        if (booklistRes === 1) {
            statusCode = 401;
            message = 'User not found';
        }
  
        else if (booklistRes.code === '0') {
            statusCode = 402;
            message = 'Create a booklist first';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Add a book to booklist
exports.addBookToBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { bookId, bookListName } = req.body;

        const booklist = await booklistService.addBookToBooklist(userId, bookId, bookListName);
  
        let statusCode = 200;
        let message = booklist;

        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
  
        else if (booklist === 2) {

            statusCode = 402;
            message = 'Booklist not found';
            
        }

        else if (booklist === 3) {

            statusCode = 403;
            message = 'Book has alreay been in the booklist';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Remove a book from booklist
exports.removeBookFromBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { bookId, bookListName } = req.body;

        const booklist = await booklistService.removeBookFromBooklist(userId, bookId, bookListName);
  
        let statusCode = 200;
        let message = booklist;
        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
  
        else if (booklist === 2) {

            statusCode = 402;
            message = 'Booklist not found';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Query all the booklist of the user
exports.queryBooklistInfo = async (req, res) => {
    try {
        const userId = req.userData.userId;

        const booklist = await booklistService.queryBooklistInfo(userId);

        let statusCode = 200;
        let message = booklist;
        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Update booklist info
exports.updateBooklistInfo = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const updatedBooklistInfo = req.body;

        const booklist = await booklistService.updateBooklistInfo(userId, updatedBooklistInfo);
  
        let statusCode = 200;
        let message = booklist;

        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
  
        else if (booklist === 2) {

            statusCode = 402;
            message = 'Booklist not found';
            
        }
        else if (booklist === 3) {
            statusCode = 403;
            message = 'User does not match booklist';
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Delete bookList
exports.deleteBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const {bookListName} = req.body;

        const booklist = await booklistService.deleteBooklist(userId, bookListName);
  
        let statusCode = 200;
        let message = "Booklist delete successful";

        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
  
        else if (booklist === 2) {

            statusCode = 402;
            message = 'Booklist not found';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Get top 10 lastest modified public booklists to unauthorized user
exports.getLastestTenPublicBooklist = async (req, res) => {
    try {

        const booklists = await booklistService.getLastestTenPublicBooklist();

        let statusCode = 200;
        let message = booklists;

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Get all the public booklists order by updated time to authorized user
exports.getAllPublicBooklist = async (req, res) => {
    try {

        const userId = req.userData.userId;
        const booklists = await booklistService.getAllPublicBooklist(userId);

        let statusCode = 200;
        let message = booklists;

        if (booklists === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Authorized users make comments to a booklist
exports.makeCommentToBooklist = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const bookListInfo = req.body;

        const booklist = await booklistService.makeCommentToBooklist(userId, bookListInfo);
  
        let statusCode = 200;
        let message = booklist;

        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
  
        else if (booklist === 2) {

            statusCode = 402;
            message = 'Booklist not found';
            
        }
        else if (booklist === 3) {
            statusCode = 403;
            message = 'Cannot comment a non-public booklist';
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};

// Admin maintain the display attribute of comments
exports.adminMaintainComments = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const {bookListId, commentId, display} = req.body;

        const booklist = await booklistService.adminMaintainComments(userId, bookListId, commentId, display);
  
        let statusCode = 200;
        let message = booklist;
  
        if (booklist === 1) {

            statusCode = 401;
            message = 'User not found';
            
        }
        else if (booklist === 2) {
            statusCode = 402;
            message = 'User is not admin, no access to the content';
        }
        else if (booklist === 3) {

            statusCode = 403;
            message = 'Booklist not found';
            
        }
        else if (booklist === 4) {

            statusCode = 405;
            message = 'Comment not found';
            
        }

        res.status(statusCode).json({ message });
  
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
};



