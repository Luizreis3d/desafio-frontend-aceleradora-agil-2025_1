// Configuração da API
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/?client_id=krx69f5lOwfnsSOyaEE511fePvgJojVqawDtSPOBAlltFtQvhhHtP6Po";
const galleryElement = document.getElementById('gallery');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const notFoundElement = document.getElementById('not-found');
let photos = [];

// Função para carregar fotos da API
async function loadPhotos() {
    try {
        const response = await fetch(UNSPLASH_API_URL);
        if (!response.ok) throw new Error('Erro ao carregar as fotos');
        photos = await response.json();
        displayPhotos(photos);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Exibe as fotos na galeria
function displayPhotos(photoList) {
    galleryElement.innerHTML = '';
    photoList.forEach(photo => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${photo.urls.small}" alt="${photo.alt_description || 'Foto'}">
            <p>${photo.alt_description || 'Sem título'}</p>
        `;
        galleryElement.appendChild(item);
    });
}

// Função de pesquisa
function searchPhotos() {
    const keyword = searchInput.value.toLowerCase();
    const filteredPhotos = photos.filter(photo =>
        (photo.alt_description || '').toLowerCase().includes(keyword)
    );
    if (filteredPhotos.length > 0) {
        notFoundElement.style.display = 'none';
        displayPhotos(filteredPhotos);
    } else {
        notFoundElement.style.display = 'block';
        galleryElement.innerHTML = '';
    }
}

// Eventos
searchButton.addEventListener('click', searchPhotos);
searchInput.addEventListener('input', searchPhotos);

// Carregar fotos ao iniciar
loadPhotos();
