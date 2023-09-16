class ChamarServidorService {
  constructor () {
    this.urlServidor = 'http://localhost:8000'
  }

  enviarNomeEDescricaoProduto(nome, what, descricao) {
    const funcaoParaChamar = 'apiChatGpt' // Nome da função que você deseja chamar
    const parametro = "Nome: " + nome + "\n" + "Produto: " + what + "\n" + "Descrição: " + descricao
    const urlServidor = this.urlServidor

    return new Promise((resolve, reject) => {
      fetch(urlServidor, {
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

  mudarBackground(formData) {
    const urlServidor = this.urlServidor + '/change-background'

    return new Promise((resolve, reject) => {
      fetch(urlServidor, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.image_url) {
            resolve(data.image_url)
          } else {
            throw Error("URL da imagem não encontrada na resposta.");
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

function showImg() {
  const inputImagem = document.getElementById('input-image');
  const imagemPreview = document.getElementById('selected-image');
  // Verifica se um arquivo foi selecionado
  if (inputImagem.files && inputImagem.files[0]) {
    const leitor = new FileReader();

    // Configura um ouvinte de evento para quando o arquivo estiver pronto para ser exibido
    leitor.onload = function(e) {
      imagemPreview.src = e.target.result;
      imagemPreview.style.display = 'inline-block'; // Mostra a imagem
    };

    // Lê o arquivo selecionado como uma URL de dados (data URL)
    leitor.readAsDataURL(inputImagem.files[0]);
  }
}

function makeRequests(nome, oQueEh, descricao, imageFile) {
  // Cria um formData para enviar a imagem para o backend
  var formData = new FormData()
  formData.append('image', imageFile)
  
  // Mostrar a sobreposição escura e o spinner
  document.body.classList.add('overlay-visible');

  // Criação das Promises (chamadas para o servidor)
  chamarServidorService.enviarNomeEDescricaoProduto(nome, oQueEh, descricao)
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
      // window.location.href = `../userInteraction/userInteraction.html?image_url=${encodeURIComponent(image_url)}`
    })
    .catch((error) => {
      // Ocultar a sobreposição escura e o spinner
      document.body.classList.remove('overlay-visible');
      console.error("Erro ao fazer chamadas ao servidor:", error)
    })
}

function submitForm(event) {
  event.preventDefault()

  // Obtém o formulário
  const form = document.getElementById('form')

  // Obtém os dados inseridos
  const nome = form.querySelector('#input-word').value
  const oQueEh = form.querySelector('#input-what').value
  const descricao = form.querySelector('#prodDescr').value
  const inputImage = document.getElementById('input-image');
  const imageFile = inputImage.files[0]

  // Valida os dados inseridos
  if (nome === '' || oQueEh === '' || descricao === '' || imageFile === undefined) {
    alert('Por favor, preencha todos os campos antes de avançar.');
  } else {
    // Faz as chamadas para o servidor
    makeRequests(nome, oQueEh, descricao, imageFile)
  }
}