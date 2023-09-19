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

function armazenarVariaveis(nome, oQueEh, descricao) {
  // Criar um objeto JSON com as variáveis
  const dados = {
    nome: nome,
    oQueEh: oQueEh,
    descricao: descricao
  };

  // Converter o objeto JSON para uma string JSON
  const dadosJSON = JSON.stringify(dados);

  // Armazenar a string JSON no localStorage com uma chave específica
  localStorage.setItem('dadosDoProduto', dadosJSON);
}

function makeRequests(nome, oQueEh, descricao, imageFile, opcao1Selecionada, opcao2Selecionada) {
  armazenarVariaveis(nome, oQueEh, descricao);

  const caminhoDoArquivo = determinarCaminhoDoArquivo(opcao1Selecionada, opcao2Selecionada);
  localStorage.setItem('templatePath', caminhoDoArquivo);
  
  // Mostrar a sobreposição escura e o spinner
  document.body.classList.add('overlay-visible');

  // Criação das Promises (chamadas para o servidor)
  chamarServidorService.enviarNomeEDescricaoProduto(nome, oQueEh, descricao)
    .then((resultado) => {
      const resultadoGpt = JSON.parse(resultado) || []
      const chaves = Object.keys(resultadoGpt)
      const descricao1 = resultadoGpt[chaves[3]][0]
      const descricao2 = resultadoGpt[chaves[3]][1]
      var prompt1 = descricao1
      var prompt2 = descricao2

      // Cria um formData para enviar a imagem para o backend
      var formData1 = new FormData();
      formData1.append('image', imageFile);
      formData1.append('prompt', prompt1);
      // Fazer a primeira chamada de geração de imagem
      const mudarBackgroundPromise1 = chamarServidorService.mudarBackground(formData1);

      // Cria um formData para enviar a imagem para o backend
      var formData2 = new FormData();
      formData2.append('image', imageFile);
      formData2.append('prompt', prompt2);
      // Fazer a segunda chamada de geração de imagem
      const mudarBackgroundPromise2 = chamarServidorService.mudarBackground(formData2);

      // Usar Promise.all para aguardar ambas as chamadas
      return Promise.all([mudarBackgroundPromise1, mudarBackgroundPromise2]);
    })
    .then(([image_url1, image_url2]) => {
      // Ocultar a sobreposição escura e o spinner
      document.body.classList.remove('overlay-visible');
      window.location.href = `../userInteraction/userInteraction.html?image_url1=${encodeURIComponent(image_url1)}&image_url2=${encodeURIComponent(image_url2)}`
    })
    .catch((error) => {
      // Ocultar a sobreposição escura e o spinner
      document.body.classList.remove('overlay-visible');
      console.error("Erro ao fazer chamadas ao servidor:", error)
    })
}

function submitForm(event) {
  event.preventDefault()

  if (localStorage.getItem('opcoesSelecionadas')) {
    // Se estiver, remova-o do localStorage
    localStorage.removeItem('opcoesSelecionadas');
  }

  // Obtém o formulário
  const form = document.getElementById('form')

  // Obtém os dados inseridos
  const nome = form.querySelector('#input-word').value
  const oQueEh = form.querySelector('#input-what').value
  const descricao = form.querySelector('#prodDescr').value
  const inputImage = document.getElementById('input-image');
  const imageFile = inputImage.files[0]

  // Valida os dados inseridos
  if (nome.trim() === '' || oQueEh.trim() === '' || descricao.trim() === '' || imageFile === undefined) {
    alert('Por favor, preencha todos os campos antes de avançar.');
  } else {
    // Determina qual template foi escolhido
    const opcao1Selecionada = document.getElementById('option1').checked;
    const opcao2Selecionada = document.getElementById('option2').checked;
    // Faz as chamadas para o servidor
    makeRequests(nome, oQueEh, descricao, imageFile, opcao1Selecionada, opcao2Selecionada)
  }
}

// Função para determinar o caminho do arquivo com base nas opções selecionadas
function determinarCaminhoDoArquivo(opcao1Selecionada, opcao2Selecionada) {
  if (opcao1Selecionada) {
    return "../../../assets/HOME_TEMPLATE1.html";
  } else if (opcao2Selecionada) {
    return "../../../assets/HOME_TEMPLATE2.html";
  } else {
    return "../../../assets/HOME_TEMPLATE1.html";
  }
}