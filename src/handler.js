const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    // Cek jika tidak ada property name di request body
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    // Cek jika ada nilai property readPage yang lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // Cek jika buku berhasil ditambahkan
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });
        response.code(201);
        return response;
    }

    // Server gagal menambahkan buku
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    // Cek jika tidak ada query
    if (name === undefined && reading === undefined && finished === undefined) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }

    // Cek jika ada query
    if (name) {
        const filteredName = books.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filteredName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }

    // Cek jika ada query reading
    if (reading) {
        const filteredReading = books.filter(
            (book) => Number(book.reading) === Number(reading)
        );

        const response = h.response({
            status: 'success',
            data: {
                books: filteredReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }

    // jika ada query finished
    const filteredFinished = books.filter(
        (book) => Number(book.finished) === Number(finished)
    );

    const response = h.response({
        status: 'success',
        data: {
            books: filteredFinished.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });
    response.code(200);
    return response;
};

const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    // cek jika buku berdasarkan id ditemukan
    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        });
        response.code(200);
        return response;
    }

    // jika buku berdasarkan id tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    // cek jika tidak ada property name di request body
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    // Cek jika ada nilai property readPage yang lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt
        };

        // jika buku berhasil diperbarui
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    // jika id yang dilampirkan tidak ditemukan oleh server
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);

        // jika id buku ditemukan
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    // jika id buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBookByIdHandler
};