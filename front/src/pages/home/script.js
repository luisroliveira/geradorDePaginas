class ChamarServidorService {
  constructor () {}

  enviarNomeEDescricaoProduto(nome, what, descricao) {
    const funcaoParaChamar = 'apiChatGpt' // Nome da função que você deseja chamar
    const parametro = "Nome: " + nome + "\n" + "Produto: " + what + "\n" + "Descrição: " + descricao

    return new Promise((resolve, reject) => {
      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
      })
      .then(response => response.json())
      .then(data => {
          const resultadoJson = JSON.stringify(data.resultado) // REMOVER O STRINGIFY QUANDO FOR USAR A API
          localStorage.setItem("ResultadoGpt", resultadoJson)
          resolve(resultadoJson)
        })
        .catch(error => {
          console.error('Erro:', error)
          reject(error)
        })
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

  mudarBackground(formData) {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:8000//change-background", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.image_url) {
            resolve(data.image_url)
          } else {
            console.error("URL da imagem não encontrada na resposta.");
          }
        })
        .catch((error) => {
          console.error("Erro ao enviar imagem:", error);
          reject(error)
        })
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

    // Get name, what the product is and its description
    const inputWord = form.querySelector('#input-word')
    const inputWhat = form.querySelector('#input-what')
    const inputDescription = form.querySelector('#prodDescr')

    // Obtém os dados inseridos
    const word = inputWord.value
    const what = inputWhat.value
    const description = inputDescription.value
    const imageFile = inputImage.files[0]
    // Cria um formData para enviar a imagem para o backend
    var formData = new FormData()
    formData.append('image', imageFile)
    
    // Mostrar a sobreposição escura e o spinner
    document.body.classList.add('overlay-visible');

    // Criação das Promises (chamadas para o servidor)
    chamarServidorService.enviarNomeEDescricaoProduto(word, what, description)
      .then((resultado) => {
        const resultadoGpt = JSON.parse(resultado) || []
        const chaves = Object.keys(resultadoGpt)
        const descricao = resultadoGpt[chaves[3]][0]
        var prompt = descricao
        formData.append('prompt', prompt)
        return chamarServidorService.mudarBackground(formData)
      })
      .then((image_url) => {
        // Ocultar a sobreposição escura e o spinner
        document.body.classList.remove('overlay-visible');
        window.location.href = `../userInteraction/userInteraction.html?image_url=${encodeURIComponent(image_url)}`
      })
      .catch((error) => {
        // Ocultar a sobreposição escura e o spinner
        document.body.classList.remove('overlay-visible');
        console.error("Erro ao fazer chamadas ao servidor:", error)
      })
  })
})