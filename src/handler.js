const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  // initializing book data before pushing to books array
  let book = request.payload;
  const id = nanoid(16);
  const finished = book.readPage === book.pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!book.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (book.readPage > book.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  book = {
    id,
    ...book,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(book);

  if (books.length === 0) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: `${id}`,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name: nameQuery, reading, finished } = request.query;
  let filteredBooks = [...books];
  if (nameQuery) {
    const booksWithNameQuery = filteredBooks.filter((book) => {
      // Use regex to find case insensitive substring.
      const { name } = book;
      const regex = new RegExp(nameQuery, 'i');
      return name.match(regex);
    });
    filteredBooks = [...booksWithNameQuery];
  }
  if (reading === '1' || reading === '0') {
    // eslint-disable-next-line eqeqeq
    const readFilteredBooks = filteredBooks.filter((book) => book.reading == reading);
    filteredBooks = [...readFilteredBooks];
  }

  if (finished === '1' || finished === '0') {
    // eslint-disable-next-line eqeqeq
    const finishedFilteredBooks = filteredBooks.filter((book) => book.finished == finished);
    filteredBooks = [...finishedFilteredBooks];
  }

  filteredBooks = filteredBooks.map((book) => {
    const { id, name, publisher } = book;
    const newBook = {
      id,
      name,
      publisher,
    };
    return newBook;
  });

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((ele) => ele.id === bookId)[0];
  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  return response;
};

const editBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = request.payload;

  if (!book.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (book.readPage > book.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((ele) => ele.id === bookId);
  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      ...book,
      updatedAt,
    };
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((ele) => ele.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookByIdHandler,
};
