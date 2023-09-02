class ChamarServidorService {
  constructor () {}

  enviarNomeProduto(nomeProduto) {
    const funcaoParaChamar = 'funcao_1' // Nome da função que você deseja chamar
    const parametro = nomeProduto
  
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

  enviarDescricaoProduto(descricao) {
    const funcaoParaChamar = 'funcao_1' // Nome da função que você deseja chamar
    const parametro = descricao
  
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

  enviarImagem(imagem) {
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: imagem,
    })
      .then((response) => response.json())
      .then((data) => {
        // Manipule a resposta do backend, se necessário
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao enviar imagem:", error);
      })
  }

  mudarBackground(imagem) {
    fetch("http://localhost:8000//change-background", {
      method: "POST",
      body: imagem,
    })
      .then((response) => response.json())
      .then((data) => {
        // Manipule a resposta do backend, se necessário
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao enviar imagem:", error);
      })
  }
}

const chamarServidorService = new ChamarServidorService()
// Get image
const inputImage = document.getElementById('input-image')
const selectedImage = document.getElementById('selected-image')
inputImage.addEventListener('change', function () {
  const file = inputImage.files[0]
  if (file) {
    selectedImage.src = URL.createObjectURL(file)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form')
  const btnAvancar = document.getElementById('btn-avancar')
  
  btnAvancar.addEventListener('click', function (event) {
    event.preventDefault() // Impede o envio do formulário padrão

    // Get name and description
    const inputWord = form.querySelector('#input-word')
    const inputDescription = form.querySelector('#prodDescr')

    // Obtém os dados inseridos
    const word = inputWord.value
    const description = inputDescription.value
    const imageFile = inputImage.files[0]
    
    // Cria um formData para enviar a imagem para o backend
    var formData = new FormData()
    formData.append('image', imageFile)
    // Enviar imagem para o servidor
    chamarServidorService.mudarBackground(formData)
    
    // Função para fazer uma solicitação ao servidor
    chamarServidorService.enviarNomeProduto(word)
    chamarServidorService.enviarDescricaoProduto(description)

    //   // Redireciona para a nova página, passando os dados via URL
    //   const queryParams = new URLSearchParams(formData);
    //   window.location.href = "outra_pagina.html?" + queryParams.toString();
  })
})