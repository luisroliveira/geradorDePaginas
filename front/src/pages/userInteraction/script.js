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

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get("image_url");

  if (imageUrl) {
    const displayImage = document.getElementById("displayImage");
    displayImage.src = imageUrl;
  }
})

let selectedOption = null;
    
function selectOption(optionNumber) {

  const selectedBox = document.getElementById(`option-${optionNumber}`);
  selectedBox.classList.add('selected');
  
  console.log('Opção selecionada:', optionNumber);
}
