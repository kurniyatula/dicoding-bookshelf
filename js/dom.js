const INCOMPLETED_BOOKSHELF_LIST_ID = "incompleteBookshelfList";
const COMPLETED_BOOKSHELF_LIST_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
    const incompletedBookList = document.getElementById(INCOMPLETED_BOOKSHELF_LIST_ID);

    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = "Penulis: " + document.getElementById("inputBookAuthor").value;
    const inputBookYear = "Tahun: " + document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    incompletedBookList.append(book);
    updateDataStorage();
    
    let bookShelf = "";

    if (inputBookIsComplete) {
        bookShelf = document.getElementById(COMPLETED_BOOKSHELF_LIST_ID);
    } else {
        bookShelf = document.getElementById(INCOMPLETED_BOOKSHELF_LIST_ID);
    }
    
    bookShelf.append(book);
}

function makeBook(title, author, year, isCompleted) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("book_detail") // tambah kelas book_detail
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textContainer);

    if(isCompleted){
        container.append(
            createUnreadButton(),
            createTrashButton()
        );
    } else {
        container.append(
          createReadButton(),
          createTrashButton()
        );
    }
    return container;
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function(event) {
        eventListener(event);
    });

    return button;
}

function createReadButton() {
    return createButton("complete", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_BOOKSHELF_LIST_ID);

    const bookTitle = bookElement.querySelector(".book_detail > h3").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_detail > p")[0].innerText;
    const bookYear = bookElement.querySelectorAll(".book_detail > p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);

    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataStorage();
}

function removeBookFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataStorage();
}

function createTrashButton() {
    return createButton("delete", function(event) {
        let confirmation = confirm("Apakah Anda yakin ingin menghapus buku?");

        if (confirmation) {
            removeBookFromCompleted(event.target.parentElement);
        }
        
    });
}

function undoBookFromCompleted(bookElement) {
    const listIncompleted = document.getElementById(INCOMPLETED_BOOKSHELF_LIST_ID);
    const bookTitle = bookElement.querySelector(".book_detail > h3").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_detail > p")[0].innerText;
    const bookYear = bookElement.querySelectorAll(".book_detail > p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listIncompleted.append(newBook);
    bookElement.remove();

    updateDataStorage();
}

function createUnreadButton() {
    return createButton("not_complete", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

const checkbox = document.getElementById("inputBookIsComplete");
let check = false;

checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    check = true;
    document.querySelector("span").innerText = "Selesai dibaca";
  } else {
    check = false;
    document.querySelector("span").innerText = "Belum selesai dibaca";
  }
});

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByTagName("h3");
  
    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;
  
        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".book_item").style.display = "";
        } else {
            titles[i].closest(".book_item").style.display = "none";
        }
    }
  }
