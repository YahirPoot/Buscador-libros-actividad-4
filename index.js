const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const btnLoadMore = document.getElementById("load-more");
const searchType = document.getElementById("search-type");
let currentPage = 1; // Página inicial
let currentQuery = ""; // Consulta actual

btnLoadMore.classList.add("hidden");// Ocultar botón "Cargar más" 

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  if (!currentQuery) return;

  currentPage = 1;
  resultsDiv.innerHTML = ""; // Limpiar resultados previos
  fetchBooks(currentQuery, currentPage);
});

searchType.addEventListener("change", (e) => {
  searchInput.value = ""; // Limpiar el campo de búsqueda
  resultsDiv.innerHTML = ""; // Limpiar resultados
  btnLoadMore.classList.add("hidden");
});

function fetchBooks(query, page) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {

      const limitedBooks = data.docs.slice(0,10);
      displayResults(limitedBooks);

      if (data.docs.length > 0) {
        btnLoadMore.classList.remove("hidden");
      } else {
        btnLoadMore.classList.add("hidden");
      }
    })
    .catch((error) => console.error("Error al buscar libros:", error));
}

    btnLoadMore.addEventListener("click", () => {
      currentPage++;
      fetchBooks(currentQuery, currentPage);
    });

function displayResults(books) {
  if (books.length === 0 && currentPage === 1) {
    resultsDiv.innerHTML = '<p class="text-gray-600">No se encontraron libros.</p>';
    btnLoadMore.style.display = "none";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className =
      "p-4 bg-white rounded-md shadow hover:shadow-lg border border-gray-200";

      const isbnList = book.isbn?.slice(0, 5).join(", ") || "Desconocido";
    bookElement.innerHTML =  `
    <h3 class="text-lg font-bold text-gray-800">${book.title}</h3>
    <p><strong>Autor:</strong> ${book.author_name?.join(", ") || "Desconocido"}</p>
    <p><strong>Año:</strong> ${book.first_publish_year || "Desconocido"}</p>
    <p><strong>ISBN:</strong> ${isbnList}</p>
  `;
    resultsDiv.appendChild(bookElement);
  });
}
