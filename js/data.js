const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) 
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
    
}

function updateDataStorage() {
    if (isStorageExist()) 
        saveData();
    
}

function composeBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId) 
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
        if (book.id === bookId) 
            return index;
        
        index++;
    }
    return -1;
}

function refreshDataFromBooks() {
    const listIncompleted = document.getElementById(INCOMPLETED_BOOKSHELF_LIST_ID);
    const listCompleted = document.getElementById(COMPLETED_BOOKSHELF_LIST_ID);

    for (book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listIncompleted.append(newBook);
        }
    }
}