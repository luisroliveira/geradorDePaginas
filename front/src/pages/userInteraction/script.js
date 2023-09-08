class CriarElementos {
  constructor () {}

  criarDivParaImg (imageURL) {
    // Crie a div com a classe "option-box" e atributos correspondentes
    var imgOptionDiv = document.createElement("div");
    imgOptionDiv.className = "option-box";
    imgOptionDiv.id = "img-option";

    // Crie a tag <img>
    var imgElement = document.createElement("img");
    imgElement.src = imageURL; // Substitua pelo caminho da sua imagem
    imgElement.alt = "Descrição da imagem";
    imgElement.id = "image";

    // Crie o input de arquivo
    var inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.style.display = "none";
    inputElement.id = "imageFileInput";

    // Anexe a tag <img> à div "imgOptionDiv"
    imgOptionDiv.appendChild(inputElement);
    imgOptionDiv.appendChild(imgElement);

    return imgOptionDiv;
  }
}

class ChamarServidorService {
  constructor () {}

  addImageToInput (imageURL) {
    return new Promise((resolve, reject) => {
      fetch(imageURL)
        .then(function(response) {
          return response.blob();
        })
        .then(function(blob) {
          var file = new File([blob], "imagem.jpg", { type: "image/jpeg" });
          
          var inputImagem = document.getElementById("imageFileInput");
          var fileList = new DataTransfer()
          fileList.items.add(file)
          inputImagem.files = fileList.files
          resolve(inputImagem)
        })
        .catch(function(error) {
          console.error("Erro ao carregar a imagem:", error);
          reject(error)
        });
    })
  }

  mudarBackground(imagem) {
    fetch("http://localhost:8000//change-background", {
      method: "POST",
      body: imagem,
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.image_url) {
          var imageElement = document.getElementById("image");
          if (imageElement) {
            imageElement.src = data.image_url;
          }
        } else {
          console.error("URL da imagem não encontrada na resposta.");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar imagem:", error);
      })
  }
}

const chamarServidorService = new ChamarServidorService()
const criarElementos = new CriarElementos()
const btnAvancar = document.getElementById('btn-avancar')
const btnRegerar = document.getElementById('btn-regerar')
const btnSelecionar = document.getElementById('btn-selecionar')

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get("image_url");

  if (imageUrl) {
    const imgOptionDiv = criarElementos.criarDivParaImg(imageUrl);
    // Selecione a div com a classe "options" para anexar a nova div
    var optionsDiv = document.querySelector(".options");

    // Anexe a nova div à div "options"
    optionsDiv.appendChild(imgOptionDiv);
  }
})

function regerarImagem() {
  // Adicionar a imagem na tag de input
  var imageElement = document.getElementById("image");
  if (imageElement) {
    var imageURL = imageElement.src;
    chamarServidorService.addImageToInput(imageURL)
      .then(function() {
        // Pegar a imagem do input
        const inputImage = document.getElementById('imageFileInput')
        const imageFile = inputImage.files[0]
        // Cria um formData para enviar a imagem para o backend
        var formData = new FormData()
        formData.append('image', imageFile)
        // Enviar imagem para o servidor
        return chamarServidorService.mudarBackground(formData)
      })
      .then(function() {
        console.log("Operação concluída com sucesso!")
      })
      .catch(function(error) {
        console.error("Erro: " + error)
      })
  }
}

let selectedImage = null;
// Função para selecionar a imagem
function selecionarImagem() {
  // Selecionar a imagem
  var imageElement = document.getElementById("image");
  selectedImage = imageElement.src;

  // Mudar o css da opção de imagem
  const selectedBox = document.getElementById("img-option");
  selectedBox.classList.add('selected');

  // Esconder o botão "Selecionar Imagem"
  btnSelecionar.style.display = "none";

  // Mostrar o botão "Avançar"
  btnAvancar.style.display = "inline";
}

function printData() {
  var frasesArmazenadas = JSON.parse(localStorage.getItem("ResultadoGpt")) || []
  var chaves = Object.keys(frasesArmazenadas)
  chaves.forEach(function(chave) {
    console.log(chave + ': ' + frasesArmazenadas[chave])
  })
}