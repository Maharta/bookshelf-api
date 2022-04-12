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

module.exports = {
  addBookHandler,
};
