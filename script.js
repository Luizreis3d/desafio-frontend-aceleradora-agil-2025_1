const API_KEY = "SEU_ACCESS_KEY";
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
let currentQuery = "";

// Função para carregar fotos
async function loadPhotos(page = 1, query = "") {
    const url = query
        ? `${BASE_URL}/search?query=${query}&per_page=12&page=${page}`
        : `${BASE_URL}/curated?per_page=12&page=${page}`;

    try {
        const response = await fetch(url, { headers: { Authorization: API_KEY } });
        const data = await response.json();
        const photos = data.photos;

        if (photos.length > 0) {
            notFound.style.display = "none";
            displayPhotos(photos);
            updatePagination(page, Math.ceil(data.total_results / 12) || 1);
        } else {
            gallery.innerHTML = "";
            notFound.style.display = "block";
            pagination.innerHTML = "";
        }
    } catch (error) {
        console.error("Erro ao carregar fotos:", error);
    }
}

// Exibir fotos na galeria
function displayPhotos(photos) {
    gallery.innerHTML = photos
        .map(
            (photo) => `
        <div class="gallery-item">
            <img src="${photo.src.medium}" alt="${photo.alt}" data-large="${photo.src.large}">
            <p>${photo.alt || "Sem título"}</p>
        </div>`
        )
        .join("");

    document.querySelectorAll(".gallery-item img").forEach((img) =>
        img.addEventListener("click", (e) =>
            openModal(e.target.getAttribute("data-large"), e.target.alt)
        )
    );
}

// Abrir modal
function openModal(imageUrl, altText) {
    modal.style.display = "flex";
    modalImage.src = imageUrl;
    modalCaption.textContent = altText || "Sem descrição";
}

// Fechar modal
function closeModal() {
    modal.style.display = "none";
}

// Fechar modal ao clicar no botão de fechar
modalClose.addEventListener("click", closeModal);

// Fechar modal ao clicar fora da imagem
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Atualizar paginação
function updatePagination(current, total) {
    pagination.innerHTML = "";

    const maxButtons = 5;
    const startPage = Math.max(1, current - Math.floor(maxButtons / 2));
    const endPage = Math.min(total, startPage + maxButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === current ? "active" : "";
        button.addEventListener("click", () => loadPhotos(i, currentQuery));
        pagination.appendChild(button);
    }
}

// Pesquisa
searchButton.addEventListener("click", () => {
    currentQuery = searchInput.value.trim();
    loadPhotos(1, currentQuery);
});

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        currentQuery = searchInput.value.trim();
        loadPhotos(1, currentQuery);
    }
});

// Inicializar aplicação
loadPhotos();
