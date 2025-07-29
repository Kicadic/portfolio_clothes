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

  const galleries = document.querySelectorAll('.gallery');

  galleries.forEach(gallery => {
    data.files.forEach(file => {
      if (file.mimeType.startsWith('image/')) {

        // >>> Nowy kontener dla jednego obrazka
        const imgContainer = document.createElement('div');
        imgContainer.style.textAlign = 'center';
        imgContainer.style.margin = '10px';
        imgContainer.style.display = 'inline-block'; // aby ustawiały się obok siebie
        imgContainer.style.verticalAlign = 'top'; 

        const imgElement = document.createElement('img');
        imgElement.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
        imgElement.alt = file.name;
        imgElement.style.width = '300px';
        imgElement.style.height = '300px';
        imgElement.style.display = 'block';
        imgElement.style.marginBottom = '5px';

        const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        const textElement = document.createElement('p');
        textElement.textContent = fileNameWithoutExtension;
        textElement.style.margin = '5px 0';
        textElement.style.maxWidth = '300px';
        textElement.style.wordWrap = 'break-word';
        textElement.style.textAlign = 'center';

        // Dodajemy wszystko do kontenera pojedynczego obrazka
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(textElement);
        // A teraz kontener do galerii
        gallery.appendChild(imgContainer);

        // Obsługa kliknięcia - otwieranie modala
        imgElement.addEventListener('click', function () {
          modal.style.display = "block";
          modalImg.src = this.src;
          modalImg.style.cursor = 'auto';
          modalImg.style.height = '100vh';
          modalImg.style.width = '100vh';
          modalImg.style.textAlign = 'center';
          this.style.opacity = "1"; 
          clickedImage = this;
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