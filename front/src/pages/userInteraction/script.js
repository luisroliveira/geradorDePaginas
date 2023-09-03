class CriarElementos {
  constructor () {}

  criarDivParaImg (imageURL) {
    // Crie a div com a classe "option-box" e atributos correspondentes
    var imgOptionDiv = document.createElement("div");
    imgOptionDiv.className = "option-box";
    imgOptionDiv.id = "option-1";

    // Crie a tag <img>
    var imgElement = document.createElement("img");
    imgElement.src = imageURL; // Substitua pelo caminho da sua imagem
    imgElement.alt = "Descrição da imagem";

    // Anexe a tag <img> à div "imgOptionDiv"
    imgOptionDiv.appendChild(imgElement);

    // Adicione um manipulador de evento de clique
    imgOptionDiv.onclick = function() {
      selectOption(1); // Substitua esta função pelo seu código real
    };
    return imgOptionDiv;
  }
}

class ChamarServidorService {
  constructor () {}

  chamarServidor(nomeFuncao, nomeParametro) {
    const funcaoParaChamar = nomeFuncao // Nome da função que você deseja chamar
    const parametro = nomeParametro
  
    fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
    })
      .then(response => response.json())
      .then(data => {
        const resultado = data.resultado
        console.log(resultado)
      })
      .catch(error => {
        console.error('Erro:', error)
      })
  }
}

const chamarServidorService = new ChamarServidorService()
const criarElementos = new CriarElementos()

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

let selectedOption = null;
    
function selectOption(optionNumber) {

  const selectedBox = document.getElementById(`option-${optionNumber}`);
  selectedBox.classList.add('selected');
  
  console.log('Opção selecionada:', optionNumber);
}
