const axios = require('axios');

exports.getBooksFromAPI = async (req, res) => {
  try {
    const { query } = req.params;
    console.log("query", {query});
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const books = response.data.items;
    res.json(books);

    console.log(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
