const API_KEY = "krx69f5lOwfnsSOyaEE511fePvgJojVqawDtSPOBAlltFtQvhhHtP6Po";
const BASE_URL = "https://api.pexels.com/v1";
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const notFound = document.getElementById("not-found");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const modalClose = document.getElementById("modal-close");
const pagination = document.getElementById("pagination");

let currentPage = 1;
let totalPages = 1;
let photos = [];
let currentQuery = "";

// Carregar fotos
async function loadPhotos(page = 1, query = "") {
    const url = query
        ? `${BASE_URL}/search?query=${query}&per_page=12&page=${page}`
        : `${BASE_URL}/curated?per_page=12&page=${page}`;
    try {
        const response = await fetch(url, { headers: { Authorization: API_KEY } });
        const data = await response.json();

        photos = data.photos;
        totalPages = Math.ceil((data.total_results || 0) / 12) || 1;

        if (photos.length > 0) {
            notFound.style.display = "none";
            displayPhotos(photos);
            updatePagination(page, totalPages);
        } else {
            notFound.style.display = "block";
            gallery.innerHTML = "";
            pagination.innerHTML = "";
        }
    } catch (error) {
        console.error("Erro ao carregar fotos:", error);
    }
}

// Exibir fotos
function displayPhotos(photoList) {
    gallery.innerHTML = "";
    photoList.forEach((photo) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");
        item.innerHTML = `
            <img src="${photo.src.medium}" alt="${photo.alt}" data-large="${photo.src.large}">
            <p>${photo.alt || "Sem título"}</p>
        `;
        item.querySelector("img").addEventListener("click", () =>
            openModal(photo.src.large, photo.alt)
        );
        gallery.appendChild(item);
    });
}

// Abrir modal
function openModal(imageUrl, altText) {
    modal.style.display = "flex";
    modalImage.src = imageUrl;
    modalCaption.textContent = altText || "Sem descrição";
}

// Fechar modal
modalClose.addEventListener("click", () => (modal.style.display = "none"));

// Atualizar paginação
function updatePagination(current, total) {
    pagination.innerHTML = "";
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, current - halfRange);
    let endPage = Math.min(total, current + halfRange);

    if (current <= halfRange) {
        endPage = Math.min(total, maxPagesToShow);
    } else if (current > total - halfRange) {
        startPage = Math.max(1, total - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === current ? "active" : "";
        button.addEventListener("click", () => {
            currentPage = i;
            loadPhotos(currentPage, currentQuery);
        });
        pagination.appendChild(button);
    }
}

// Eventos
searchButton.addEventListener("click", () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadPhotos(currentPage, currentQuery);
});

searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadPhotos(currentPage, currentQuery);
});

// Inicializar
loadPhotos();
