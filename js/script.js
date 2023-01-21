const simpanBuku = document.getElementById("inputBook");
const book_shelf = [];
const renderBook = "render_book";
const savedEvent = "saved_event";
const storageKey = "STORAGE_KEY";

function checkForStorage() {
  if (typeof Storage === undefined) {
    alert("browser tidak mendukung Local Storage");
    return false;
  }
  return true;
}

simpanBuku.addEventListener("submit", function (event) {
  event.preventDefault();
  addBuku();
});

function bukuId() {
  return +new Date();
}

function generateObjectBuku(id, judul, penulis, tahun, isComplete) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isComplete,
  };
}

function saveBookData() {
  if (checkForStorage()) {
    localStorage.setItem(storageKey, JSON.stringify(book_shelf));
    document.dispatchEvent(new Event(savedEvent));
  }
}

document.addEventListener(savedEvent, function () {
  console.log(localStorage.getItem(storageKey));
});

function dataFromStorage() {
  const getBook = localStorage.getItem(storageKey);
  let data = JSON.parse(getBook);

  if (data !== null) {
    for (const book of data) {
      book_shelf.push(book);
    }
  }
  document.dispatchEvent(new Event(renderBook));
}

document.addEventListener("DOMContentLoaded", function () {
  if (checkForStorage()) {
    dataFromStorage();
  }
});

//mengambil nilai inputan
function addBuku() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahun = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const bukuID = bukuId();

  const objectBuku = generateObjectBuku(bukuID, judulBuku, penulisBuku, tahun, isComplete);
  book_shelf.push(objectBuku);

  document.dispatchEvent(new Event(renderBook));
  saveBookData();
}

document.addEventListener(renderBook, function () {
  const belumSelesai = document.getElementById("incompleteBookshelfList");
  const selesai = document.getElementById("completeBookshelfList");
  belumSelesai.innerHTML = "";
  selesai.innerHTML = "";

  for (const itemBuku of book_shelf) {
    const isiRak = outputBuku(itemBuku);
    if (itemBuku.isComplete === true) {
      selesai.append(isiRak);
    } else {
      belumSelesai.append(isiRak);
    }
  }
});

//menangkap hasil inputan dg object javascript
function outputBuku(objectBuku) {
  const outputJudul = document.createElement("h3");
  outputJudul.innerText = objectBuku.judul;

  const ouputPenulis = document.createElement("p");
  ouputPenulis.innerHTML = "<b> Penulis: </b> " + objectBuku.penulis;

  const outputTahun = document.createElement("p");
  outputTahun.innerHTML = "<b> Tahun: </b> " + objectBuku.tahun;

  //class action berisi button
  const isiButton = document.createElement("div");
  isiButton.classList.add("action");

  //article class book_item
  const rakContainer = document.createElement("article");
  rakContainer.classList.add("book_item");
  rakContainer.append(outputJudul, ouputPenulis, outputTahun, isiButton);

  if (objectBuku.isComplete) {
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = "Belum Selesai dibaca";
    greenButton.addEventListener("click", function () {
      addToUnreadBook(objectBuku.id);
    });
    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus Buku";
    redButton.addEventListener("click", function () {
      removeBook(objectBuku.id);
    });

    isiButton.append(greenButton, redButton);
  } else {
    const greenButton = document.createElement("button");
    greenButton.setAttribute("id", objectBuku.id);

    greenButton.classList.add("green");
    greenButton.innerText = "Selesai dibaca";
    greenButton.addEventListener("click", function () {
      addToReadBook(objectBuku.id);
    });
    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus Buku";
    redButton.addEventListener("click", function () {
      removeBook(objectBuku.id);
    });
    isiButton.append(greenButton, redButton);
  }

  return rakContainer;
}

function addToReadBook(bookId) {
  const booktarget = findBook(bookId);
  if (booktarget == null) return;
  booktarget.isComplete = true;
  document.dispatchEvent(new Event(renderBook));
  saveBookData();
}

function addToUnreadBook(bookId) {
  const booktarget = findBook(bookId);
  if (booktarget == null) return;
  booktarget.isComplete = false;
  document.dispatchEvent(new Event(renderBook));
  saveBookData();
}

function removeBook(bookId) {
  const booktarget = findBookIndex(bookId);
  if (booktarget === -1) return;
  book_shelf.splice(booktarget, 1);
  document.dispatchEvent(new Event(renderBook));
  saveBookData();
}

function findBook(bookId) {
  for (const itemBuku of book_shelf) {
    if (itemBuku.id === bookId) {
      return itemBuku;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in book_shelf) {
    if (book_shelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const searching = document.getElementById("searchBook");
searching.addEventListener("submit", function (event) {
  event.preventDefault();

  const listPencarian = document.getElementById("searchBookshelfList");

  listPencarian.innerHTML = "";
  for (const itemBuku of book_shelf) {
    const isiRak = outputBuku(itemBuku);
    listPencarian.append(isiRak);
  }
  const cariJudul = document.getElementById("searchBookTitle").value.toLowerCase();
  const listJudul = document.querySelectorAll(".book_item > h3");

  for (const judul of listJudul) {
    if (judul.innerHTML.toLowerCase().includes(cariJudul)) {
      judul.parentElement.style.display = "block";
    } else {
      judul.parentElement.style.display = "none";
    }
  }
});
