const PEXELS_API_URL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
const SEARCH_API_URL = "https://api.pexels.com/v1/search?query=";
const API_KEY = "krx69f5lOwfnsSOyaEE511fePvgJojVqawDtSPOBAlltFtQvhhHtP6Po";

const galleryElement = document.getElementById("gallery");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const notFoundElement = document.getElementById("not-found");
let photos = [];

// Função para carregar fotos iniciais
async function loadPhotos() {
    try {
        const response = await fetch(PEXELS_API_URL, {
            headers: {
                Authorization: API_KEY,
            },
        });

        if (!response.ok) throw new Error("Erro ao carregar as fotos iniciais");

        const data = await response.json();
        photos = data.photos;
        displayPhotos(photos);
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Função para exibir fotos na galeria
function displayPhotos(photoList) {
    galleryElement.innerHTML = "";
    photoList.forEach((photo) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");
        item.innerHTML = `
            <img src="${photo.src.medium}" alt="${photo.alt}">
            <p>${photo.alt || "Sem título"}</p>
        `;
        galleryElement.appendChild(item);
    });
}

// Função de pesquisa por palavras-chave
async function searchPhotos(query) {
    try {
        const response = await fetch(`${SEARCH_API_URL}${query}&per_page=15&page=1`, {
            headers: {
                Authorization: API_KEY,
            },
        });

        if (!response.ok) throw new Error("Erro ao realizar a pesquisa");

        const data = await response.json();
        const filteredPhotos = data.photos;

        if (filteredPhotos.length > 0) {
            notFoundElement.style.display = "none";
            displayPhotos(filteredPhotos);
        } else {
            notFoundElement.style.display = "block";
            galleryElement.innerHTML = "";
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Eventos
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        searchPhotos(query);
    } else {
        loadPhotos();
    }
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query) {
        searchPhotos(query);
    } else {
        loadPhotos();
    }
});

// Carregar fotos ao iniciar
loadPhotos();
