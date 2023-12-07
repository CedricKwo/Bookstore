const mongoose = require('mongoose');
const { Booklist, Comment } = require('../models/Booklist');
const User = require('../models/User');
const userService = require('../services/userService')

// Create a bookList
exports.createNewBooklist = async (userId, bookListInfo) => {
    try {

        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookListName = bookListInfo.name;
        const bookListDescription = bookListInfo.discription;
        const bookListAccessibility = bookListInfo.accessibility;

        let bookLists = await Booklist.find({user: userId});
        // Each user can only create up to 20 booklists
        if (bookLists.length >= 20) {
            return 2;
        }

        let bookList = await Booklist.findOne({user: userId, name: bookListName});

        console.log("bookListName:", bookListName);
        console.log("bookListAccessibility:", bookListAccessibility);

        // Booklist name cannot be the same
        if (bookList) {

            return 3;
        }

        bookList = new Booklist({user: userId, 
                                 name: bookListName, 
                                 accessibility: bookListAccessibility,
                                 discription: bookListDescription});
        
        await bookList.save()

        console.log("bookList:", bookList);

        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Request to add a book to bookList
exports.requestAddToBooklist = async (userId, bookId) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookLists = await Booklist.find({user: userId});

        // User does not have a bookList
        if (!bookLists.length) {
            return {bookLists: [], bookId, code: '0'};
        }
            
        return {bookLists, bookId, code: '1'};


    } catch (err) {
        throw new Error(err.message);
    }
};

// Add a book to bookList
exports.addBookToBooklist = async (userId, bookId, bookListName) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookList = await Booklist.findOne({ user: userId, name: bookListName });

        if (!bookList) {
            return 2;
        }

        // Book already in the booklist
        const exsitingBook = bookList.books.find(book => book === bookId);
        if(exsitingBook) {
            return 3;
        }

        // Put the bookId into the bookList
        bookList.books.push(bookId);
        await bookList.save();
        return bookList;


    } catch (err) {
        throw new Error(err.message);
    }
};

// Remove a book from booklist
exports.removeBookFromBooklist = async (userId, bookId, bookListName) => {
    try {

        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookList = await Booklist.findOne({ user: userId, name: bookListName });

        // Booklist not found
        if (!bookList) {
            return 2;
        }

        // Search the cart to look for the corresponding book
        bookList.books = bookList.books.filter(book => book !== bookId);
        await bookList.save();

        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Query all the booklists of the user
exports.queryBooklistInfo = async (userId) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookLists = await Booklist.find({ user: userId });

        return bookLists;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Query a certain booklist
exports.queryACertainBooklistInfo = async (booklistId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(booklistId)) {
            return 1;
        }
        const booklistInfo = await Booklist.findById(booklistId);

        // User not found
        if (!booklistInfo) {
            return 1;
        }


        return booklistInfo;

    } catch (err) {
        throw new Error(err.message);
    }
};


// update bookList info
exports.updateBooklistInfo = async (userId, updatedBooklistInfo) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const booklistId = updatedBooklistInfo._id;
        console.log("booklistId", booklistId);

        if (!mongoose.Types.ObjectId.isValid(booklistId)) {
            return 2;
        }
        const bookList = await Booklist.findById(booklistId);

        // booklist not found
        if (!bookList) {
            return 2;
        }

        console.log("userId:", userId);
        console.log("bookList.user:", bookList.user.toString());
        // user does not match booklist
        if (userId !== bookList.user.toString()){
            return 3;
        }

        // update booklist info
        Object.keys(updatedBooklistInfo).forEach((key) => {
            if (key in bookList) {
                bookList[key] = updatedBooklistInfo[key];
            }
        });

        await bookList.save();

        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Delete bookList
exports.deleteBooklist = async (userId, bookListName) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const bookList = await Booklist.findOne({ user: userId, name: bookListName });

        // booklist not found
        if (!bookList) {
            return 2;
        }

        await Booklist.deleteOne({ user: userId, name: bookListName });
        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Get top 10 lastest modified public booklists to unauthorized user
exports.getLastestTenPublicBooklist = async () => {
    try {
        const recentBooklists = await Booklist.find({accessibility: 'public'})
        .sort({ updatedAt: -1 }) // order by updatedAt desc
        .limit(10); // limit number to 10

        return recentBooklists;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Get all the public booklists order by updated time to authorized user
exports.getAllPublicBooklist = async (userId) => {
    try {
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const allPublicBooklists = await Booklist.find({accessibility: 'public'})
        .sort({ updatedAt: -1 }) // order by updatedAt desc

        return allPublicBooklists;

    } catch (err) {
        throw new Error(err.message);
    }
};


// Authorized users make comments to a booklist
exports.makeCommentToBooklist= async (userId, bookListInfo) => {
    try {
        const bookListUser = bookListInfo.user;
        const bookListName = bookListInfo.name;
        const commentText = bookListInfo.commentText;
        const bookList = await Booklist.findOne({ user: bookListUser, name: bookListName });
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        // Booklist not found
        else if (!bookList) {
            return 2;
        }

        // Cannot comment a non-public booklist
        else if ( bookList.accessibility !== 'public') {
            return 3;
        }

        const newComment = new Comment({user: userId, username: user.username, text: commentText});
        console.log("commentText: ", commentText);
        console.log("newComment: ", newComment);

        bookList.comments.push(newComment);

        await bookList.save();

        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};

// Admin maintain the display attribute of comments
exports.adminMaintainComments = async (userId, bookListId, commentId, display) => {
    try {
        const user = await userService.verifyRole(userId);
        console.log("user:", user);
        // User not found or not admin
        if (user === 1){
            return 1;
        }
        else if (user === 2) {
            return 2;
        }

        if (!mongoose.Types.ObjectId.isValid(bookListId)) {
            return 3;
        }

        const bookList = await Booklist.findById(bookListId);
        
        // Booklist not found
        if(!bookList) {
            return 3;
        }

        const targetComment = bookList.comments.find(comment => comment._id.toString() === commentId);

        // Comment not found
        if(!targetComment) {
            return 4;
        }

        targetComment.display = display;
        
        await bookList.save();

        return bookList;

    } catch (err) {
        throw new Error(err.message);
    }
};
