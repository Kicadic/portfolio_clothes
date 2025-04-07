const folderId = '';  // Wstaw ID folderu z Google Drive. FolderID znajduje się po adresie https://drive.google.com/drive/folders/
const apiKey = '';  // Wstaw tutaj swój klucz API Google. Znajdziesz go po ustawieniu Google Cloud.
const corsProxy = "https://cors-anywhere.herokuapp.com/";

// Pobranie referencji do modala
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("fullImage");
const closeModal = document.querySelector(".close");

// Funkcja pobierająca listę plików z Google Drive
async function fetchImages() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;
  const response = await fetch(url);
  const data = await response.json();
  var increm = 0;

  // Pobieramy wszystkie elementy z klasą 'gallery'
  const galleries = document.querySelectorAll('.gallery');

  galleries.forEach(gallery => {
    data.files.forEach(file => {
      if (file.mimeType.startsWith('image/')) {
        const imgElement = document.createElement('img');
        imgElement.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
        imgElement.alt = file.name;
        imgElement.style.width = '300px';
        imgElement.style.height = '300px';
        imgElement.style.margin = '10px';
        
        // Style numerowanie
        gallery.appendChild(imgElement);
        increm = increm + 1;
        const numElement = document.createElement('p');
        numElement.textContent = increm; 
        numElement.style.top = '14px';
        numElement.style.right = '27%';
        numElement.style.position = 'relative';
        numElement.style.height = '40px';
        numElement.style.width = '40px';
        numElement.style.color = '#2D1262';
        numElement.style.fontSize = 'x-large';
        numElement.style.borderRadius = '200px';
        numElement.style.border = '2px solid #190D31';
        numElement.style.display = 'inline-block';
        numElement.style.textAlign = 'center';
        numElement.style.fontWeight = '600';
        numElement.style.backgroundImage = 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7))';
        gallery.appendChild(numElement);

        // Obsługa kliknięcia - otwieranie modala
        imgElement.addEventListener('click', function () {
          modal.style.display = "block";
          modalImg.src = this.src;
          modalImg.style.cursor = 'auto';
          // Usunięcie efektu opacity
          this.style.opacity = "1"; 
          clickedImage = this; // Zapamiętaj, który obrazek został kliknięty
        });
      } else {
        const textElement = document.createElement('p');
        textElement.textContent = `Plik: ${file.name}`;
        gallery.appendChild(textElement);
      }
    });
  });
}

// Zamknięcie modala po kliknięciu na "X"
closeModal.addEventListener("click", function () {
  modal.style.display = "none"; 
  // Przywrócenie efektu hover po zamknięciu modala
  if (clickedImage) {
    clickedImage.style.opacity = ""; // Usunięcie inline-style, wraca do CSS
    clickedImage = null; // Reset zmiennej
}
});

// Zamknięcie modala po kliknięciu poza obraz
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    // Przywrócenie efektu hover po zamknięciu modala
    if (clickedImage) {
      clickedImage.style.opacity = ""; // Usunięcie inline-style, wraca do CSS
      clickedImage = null; // Reset zmiennej
  }
  }
});

// Wywołanie funkcji
fetchImages().catch(error => console.error('Błąd podczas pobierania obrazów:', error));