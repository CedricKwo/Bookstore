const Cart = require('../models/Cart');

// Add a book to the cart
exports.addToCart = async (userId, bookId) => {
    try {
        let cart = await Cart.findOne({user: userId});

        console.log("bookId:", bookId);
        // User does not have a cart
        if (!cart) {
            cart = new Cart({user: userId, items: [{bookId: bookId, bookCount: 1}]});
            console.log("Cart:", cart);
            await cart.save();
        } else {
            // User has a cart, check if the book alreay exists in the cart
            const existingItem = cart.items.find(item => item.bookId === bookId);

            if(existingItem) {
                existingItem.bookCount += 1;
            } else {
                cart.items.push({bookId: bookId, bookCount: 1});
            }
            
            await cart.save();
        }

        return cart;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Reduce book count in the cart
exports.reduceCartItem = async (userId, bookId) => {
    try {
      const cart = await Cart.findOne({user: userId});

      console.log("cart:", cart);
  
      if (!cart) {
        return 1;
      }
  
      const existingItem = cart.items.find(item => item.bookId === bookId);
  
      if (!existingItem) {
        return 2;
      }
  
      if (existingItem.bookCount === 1) {
        return 3;
        // If the current count is 1, then remove it from the cart
        //cart.items = cart.items.filter(item => item.bookId !== bookId);
      } else {
        // If current count is bigger than 1, then minus 1
        existingItem.bookCount -= 1;
      }
  
      await cart.save();
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
};

// Increse book count in the cart
exports.increaseCartItem = async (userId, bookId) => {
    try {
      const cart = await Cart.findOne({user: userId});
  
      if (!cart) {
        return 1;
      }
  
      const existingItem = cart.items.find(item => item.bookId === bookId);
  
      if (!existingItem) {
        return 2;
      }
      
    existingItem.bookCount += 1;
  
      await cart.save();
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
};

// Set book count in the cart
exports.setCartItemCount = async (userId, bookId, bookCount) => {
    try {
      const cart = await Cart.findOne({user: userId});
  
      if (!cart) {
        return 1;
      }
  
      const existingItem = cart.items.find(item => item.bookId === bookId);
  
      if (!existingItem) {
        return 2;
      }
      
      existingItem.bookCount = bookCount;
  
      await cart.save();
    return cart;
    } catch (err) {
      throw new Error(err.message);
    }
};

// Remove item from cart
exports.removeItemFromCart = async (userId, bookId) => {
    try {
      const cart = await Cart.findOne({user: userId});
  
      if (!cart) {
        return 1;

      }
  
      // Search the cart to look for the corresponding book
      cart.items = cart.items.filter(item => item.bookId !== bookId);
      await cart.save();
  
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
};

// Display cart, req->user token, res->cart item
exports.displayCart = async (userId) => {
  try {
    const cart = await Cart.findOne({user: userId});

    if (!cart) {
      return 1;

    }

    return cart.items;
  } catch (err) {
    throw new Error(err.message);
  }
};


// Checkout the cart, req->user token + items {bookId, bookCount, bookPrice} , res-> {items, subtotal, tax, shipping, grandTotal}
exports.checkoutCart = async (userId, items) => {
  try {
    const cart = await Cart.findOne({user: userId});

    // Cart not found
    if (!cart) {
      return 1;

    }
    const subtotal = items.subtotal;
    const tax = items.tax;
    const shipping = items.shipping;
    const grandTotal = items.grandTotal;
    const products = items.products;

    let calSubtotal = 0;
    let calTax = 0;
    let calGrandTotal = 0;


    // Check if each item in req exsit in the cart, and count equals
    for (const product of products) {
      const existingCartItem = cart.items.find(cartItem => cartItem.bookId === product.bookId);

      // If item in req does not exist in the cart
      if (!existingCartItem) {
        return 2;
      }
      // If item count does not match
      else if (existingCartItem.bookCount !== product.bookCount){
        return 3;
      }

      calSubtotal += (product.bookCount * product.bookPrice);
    }

    // Check if the subtotal is correct
    if (calSubtotal !== subtotal) {
       //return 4;
    }

    // Check if the tax is correct
    calTax = calSubtotal * 0.13;
    if (calTax !== tax) {
      //return 5;
   }

    // Check if the granTotal is correct
    calGrandTotal = calSubtotal + calTax + shipping;
    if (calGrandTotal !== grandTotal) {
      //return 6;
    }

    return items;
  } catch (err) {
    throw new Error(err.message);
  }
};