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

const inputImage = document.getElementById('input-image')
const selectedImage = document.getElementById('selected-image')
const chamarServidorService = new ChamarServidorService()

inputImage.addEventListener('change', function () {
  const file = inputImage.files[0]
  if (file) {
    selectedImage.src = URL.createObjectURL(file)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form')
  const btnAvancar = document.getElementById('btn-avancar')
  const inputWord = document.getElementById('input-word')

  btnAvancar.addEventListener('click', function (event) {
    event.preventDefault() // Impede o envio do formulário padrão

    // Obtém a palavra inserida
    const word = inputWord.value
    const image = inputImage.value

    // Função para fazer uma solicitação ao servidor
    let string = "crie 5 frases de efeito curtas para vender " + word
    console.log(string)
    chamarServidorService.chamarServidor('funcao_1', word)

    //   // Redireciona para a nova página, passando os dados via URL
    //   const queryParams = new URLSearchParams(formData);
    //   window.location.href = "outra_pagina.html?" + queryParams.toString();
  })
})

let selectedOption = null;
    
function selectOption(optionNumber) {

  const selectedBox = document.getElementById(`option-${optionNumber}`);
  selectedBox.classList.add('selected');
  
  console.log('Opção selecionada:', optionNumber);
}
