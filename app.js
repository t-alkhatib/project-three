class Book {
    constructor(title, author, isbn) {
        this.author = author;
        this.title = title;
        this.isbn = isbn
    }
}

class UI {
    static displayBooks() {
        const books = Store.getBook();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td>
                         <td>${book.author}</td>
                         <td>${book.isbn}</td>
                         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static alertMessage(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Store {
    static getBook(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static addBook(book) {
        const books = Store.getBook();
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books));        
    }

    static remBook(isbn) {
        const books = Store.getBook();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.querySelector('#author').value;
    const title = document.querySelector('#title').value;
    const isbn = document.querySelector('#isbn').value;

    if(author === '' || title === '' || isbn === '') {
        UI.alertMessage('Please fill in the fields', 'danger');
    } else {
    const book = new Book(title, author, isbn);

    UI.addBookToList(book);

    Store.addBook(book);

    UI.alertMessage('Book Added', 'success');

    UI.clearFields();
}});

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    Store.remBook(e.target.parentElement.previousElementSibling.textContent);
    UI.alertMessage('Book Removed', 'success');
});