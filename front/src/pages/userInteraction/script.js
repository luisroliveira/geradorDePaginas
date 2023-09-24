// CLASSE PARA CRIAR ELEMENTOS HTML
class CriarElementos {
  constructor () {}

  criarDivParaImg (imageURL, imgId) {
    // Crie a div com a classe "option-box" e atributos correspondentes
    var imgOptionDiv = document.createElement("div");
    imgOptionDiv.className = "option-box";
    imgOptionDiv.id = "img-option";

    // Crie a tag <img>
    var imgElement = document.createElement("img");
    imgElement.src = imageURL; // Substitua pelo caminho da sua imagem
    imgElement.alt = "Descrição da imagem";
    imgElement.id = "image-" + imgId;
    imgElement.className = "optionImage"

    // Anexe a tag <img> à div "imgOptionDiv"
    imgOptionDiv.appendChild(imgElement);

    // Adicionar um evento de clique a cada div de opção
    imgOptionDiv.addEventListener('click', function() {
      // Remove a classe "selected" de todas as opções
      var opcoesImgDivs = document.querySelectorAll('.option-box');
      opcoesImgDivs.forEach(function(div) {
          div.classList.remove('selected');
      });

      // Adiciona a classe "selected" à opção clicada
      imgOptionDiv.classList.add('selected');
    });

    return imgOptionDiv;
  }

  criarDivParaOpcaoTexto (texto) {
    // Crie a div com a classe "option-box" e atributos correspondentes
    var txtOptionDiv = document.createElement("div");
    txtOptionDiv.classList.add("option-txt");
    txtOptionDiv.textContent = texto;

    // Adicionar um evento de clique a cada div de opção
    txtOptionDiv.addEventListener('click', function() {
      // Remove a classe "selected" de todas as opções
      var opcoesDivs = document.querySelectorAll('.option-txt');
      opcoesDivs.forEach(function(div) {
          div.classList.remove('selected');
      });

      // Adiciona a classe "selected" à opção clicada
      txtOptionDiv.classList.add('selected');
    });
    return txtOptionDiv;
  }

  criarOpcoesGpt (frasesOptions) {
    // Selecione a div com a classe "options" para anexar a nova div
    var optionsDiv = document.querySelector(".options");
    frasesOptions.forEach(function(option) {
      optionsDiv.appendChild(option);
    });
  }
}


// CLASSE PARA SE COMUNICAR COM O SERVIDOR
class ChamarServidorService {
  constructor () {
    this.urlServidor = 'http://localhost:8000'
  }

  requisitarGPTBase(urlServidor, funcaoParaChamar, parametro, campoLocalStorage) {
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
          const resultadoJson = data.resultado // COLOCAR JSON.PARSE QUANDO FOR USAR A API
          const objetoArmazenado = JSON.parse(localStorage.getItem("ResultadoGpt")) || [];
          objetoArmazenado[campoLocalStorage] = resultadoJson["result"];
          localStorage.setItem('ResultadoGpt', JSON.stringify(objetoArmazenado));
          resolve(resultadoJson)
        })
        .catch(error => {
          console.error('Erro:', error)
          reject(error)
        })
    })
  }

  enviarNomeEDescricaoProduto(funcao) {
    const funcaoParaChamar = funcao // Nome da função que você deseja chamar
    const dadosDoProduto = JSON.parse(localStorage.getItem("dadosDoProduto"));
    const nome = dadosDoProduto['nome'];
    const what = dadosDoProduto['oQueEh'];
    const descricao = dadosDoProduto['descricao'];
    const parametro = "Nome: " + nome + "\n" + "Produto: " + what + "\n" + "Descrição: " + descricao
    const urlServidor = this.urlServidor

    var campoLocalStorage = null;
    
    if (funcao == 'gerarFrase') {
      campoLocalStorage = 'Frases Persuasivas';
    } else if (funcao == 'gerarTexto') {
      campoLocalStorage = 'Textos Persuasivos';
    } else {
      campoLocalStorage = 'Slogans';
    }

    return this.requisitarGPTBase(urlServidor, funcaoParaChamar, parametro, campoLocalStorage)
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


// ENUM PARA OS ESTADOS DA PÁGINA
const States = Object.freeze({
  IMAGE: 0,
  FRASE: 1,
  TEXTO: 2,
  SLOGAN: 3  
});
var pageState = null;


// OBJETO PARA ARMAZENAR AS OPÇÕES SELECIONADAS
var selectedOptions = {
  selectedImage: null,
  selectedFrase: null,
  selectedTexto: null,
  selectedSlogan: null
};


// FUNÇÕES AUXILIARES PARA ARMAZENAR AS OPÇÕES SELECIONADAS
function selecionarOpcao(opcao, valor) {
  selectedOptions[opcao] = valor;
}

function armazenarOpcoesSelecionadas() {
  // Converter o objeto JSON para uma string JSON
  const dadosJSON = JSON.stringify(selectedOptions);

  // Armazenar a string JSON no localStorage com uma chave específica
  localStorage.setItem('opcoesSelecionadas', dadosJSON);
}


// CRIAÇÃO DE OBJETOS E VARIÁVEIS GLOBAIS
const chamarServidorService = new ChamarServidorService()
const criarElementos = new CriarElementos()
const btnAvancar = document.getElementById('btn-avancar')
const btnRegerar = document.getElementById('btn-regerar')
const btnSelecionar = document.getElementById('btn-selecionar')


// O QUE FAZER QUANDO A PÁGINA CARREGAR
document.addEventListener("DOMContentLoaded", function () {
  pageState = States.IMAGE;
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl1 = urlParams.get("image_url1");
  const imageUrl2 = urlParams.get("image_url2");

  if (imageUrl1 && imageUrl2) {
    const imgOptionDiv1 = criarElementos.criarDivParaImg(imageUrl1, 1);
    const imgOptionDiv2 = criarElementos.criarDivParaImg(imageUrl2, 2);
    // Selecione a div com a classe "options" para anexar a nova div
    var optionsDiv = document.querySelector(".options");
    optionsDiv.style.flexDirection = "row";

    // Anexe a nova div à div "options"
    optionsDiv.appendChild(imgOptionDiv1);
    optionsDiv.appendChild(imgOptionDiv2);
  }
})



// FUNÇÕES PARA O PIPELINE DE GERAÇÃO DE SITE
function selecionarImagemMostrarFrase() {
  // Selecionar a imagem
  var selectedImgDiv = document.querySelector(".selected");
  if (selectedImgDiv) {
    var imageElement = selectedImgDiv.querySelector("img");
    selecionarOpcao('selectedImage', imageElement.src);
    armazenarOpcoesSelecionadas();
    mostrarOpcoesFrases();
  } else {
    alert('Selecione uma opção antes de avançar.');
  }
}

function clearOptions() {
  const optionsDiv = document.querySelector(".options");
  while (optionsDiv.lastElementChild) {
    optionsDiv.removeChild(optionsDiv.lastElementChild);
  }
}

function mostrarOpcoesFrases() {
  pageState = States.FRASE;
  // Limpar a div de opções
  clearOptions()

  var questionText = document.getElementById('textQuestion');
  questionText.textContent = '2. Escolha a frase do seu produto';

  // Mudar o css da div "options"
  var optionsDiv = document.querySelector(".options");
  optionsDiv.style.flexDirection = "column";

  // Pegar as frases retornadas pelo GPT
  const frasesArmazenadas = JSON.parse(localStorage.getItem("ResultadoGpt")) || []
  const chaves = Object.keys(frasesArmazenadas)
  const frases = frasesArmazenadas[chaves[0]]

  // Criar as divs de opção para cada frase
  var frasesOptions = []
  frases.forEach(function(frase) { 
    const txtOptionDiv = criarElementos.criarDivParaOpcaoTexto(frase);
    frasesOptions.push(txtOptionDiv)
  });

  // Anexar as divs de opção à div "options"
  criarElementos.criarOpcoesGpt(frasesOptions)

  // Mudar a função chamada no botão Avançar
  document.getElementById('btn-avancar').setAttribute('onclick', 'escolherFraseMostrarTexto()');
}

function escolherFraseMostrarTexto() {
  var fraseSelecionada = document.querySelector(".selected");
  if (fraseSelecionada) {
    selecionarOpcao('selectedFrase', fraseSelecionada.textContent);
    armazenarOpcoesSelecionadas();
    mostrarTexto();
  } else {
    alert('Selecione uma opção antes de avançar.');
  }
}

function mostrarTexto() {
  pageState = States.TEXTO;
  // Limpar a div de opções
  clearOptions()

  var questionText = document.getElementById('textQuestion');
  questionText.textContent = '3. Escolha a descrição do seu produto';

  // Pegar os textos retornados pelo GPT
  const frasesArmazenadas = JSON.parse(localStorage.getItem("ResultadoGpt")) || []
  const chaves = Object.keys(frasesArmazenadas)
  const textos = frasesArmazenadas[chaves[1]]

  // Criar as divs de opção para cada texto
  var textosOptions = []
  textos.forEach(function(texto) { 
    const txtOptionDiv = criarElementos.criarDivParaOpcaoTexto(texto);
    textosOptions.push(txtOptionDiv)
  });

  // Anexar as divs de opção à div "options"
  criarElementos.criarOpcoesGpt(textosOptions)

  // Mudar a função chamada no botão Avançar
  document.getElementById('btn-avancar').setAttribute('onclick', 'escolherTextoMostrarSlogan()');
}

function escolherTextoMostrarSlogan() {
  var textoSelecionado = document.querySelector(".selected");
  if (textoSelecionado) {
    selecionarOpcao('selectedTexto', textoSelecionado.textContent);
    armazenarOpcoesSelecionadas();
    mostrarSlogan();
  } else {
    alert('Selecione uma opção antes de avançar.');
  }
}

function mostrarSlogan() {
  pageState = States.SLOGAN;
  // Limpar a div de opções
  clearOptions()

  var questionText = document.getElementById('textQuestion');
  questionText.textContent = '4. Escolha o slogan do seu produto';

  // Pegar os slogans retornados pelo GPT
  const frasesArmazenadas = JSON.parse(localStorage.getItem("ResultadoGpt")) || []
  const chaves = Object.keys(frasesArmazenadas)
  const slogans = frasesArmazenadas[chaves[2]]

  // Criar as divs de opção para cada slogan
  var slogansOptions = []
  slogans.forEach(function(slogan) { 
    const txtOptionDiv = criarElementos.criarDivParaOpcaoTexto(slogan);
    slogansOptions.push(txtOptionDiv)
  });

  // Anexar as divs de opção à div "options"
  criarElementos.criarOpcoesGpt(slogansOptions)

  // Mudar a função chamada no botão Avançar
  document.getElementById('btn-avancar').setAttribute('onclick', 'escolherSlogan()');
}

function escolherSlogan() {
  var sloganSelecionado = document.querySelector(".selected");
  if (sloganSelecionado) {
    selecionarOpcao('selectedSlogan', sloganSelecionado.textContent);
    armazenarOpcoesSelecionadas();
    printAll();
    window.location.href = `../finalScreen/finalScreen.html`;
  } else {
    alert('Selecione uma opção antes de avançar.');
  }
}

function printAll() {
  console.log(selectedOptions);
}


// FUNÇÕES PARA REGERAR OPÇÕES
function refazerRequisicaoImagem(imageBlob) {
  const resultadoGpt = JSON.parse(localStorage.getItem('ResultadoGpt')) || []
  const chaves = Object.keys(resultadoGpt)
  const descricao1 = resultadoGpt[chaves[3]][0]
  const descricao2 = resultadoGpt[chaves[3]][1]
  var prompt1 = descricao1
  var prompt2 = descricao2

  // Cria um formData para enviar a imagem para o backend
  var formData1 = new FormData();
  formData1.append('image', imageBlob);
  formData1.append('prompt', prompt1);
  // Fazer a primeira chamada de geração de imagem
  const mudarBackgroundPromise1 = chamarServidorService.mudarBackground(formData1);

  // Cria um formData para enviar a imagem para o backend
  var formData2 = new FormData();
  formData2.append('image', imageBlob);
  formData2.append('prompt', prompt2);
  // Fazer a segunda chamada de geração de imagem
  const mudarBackgroundPromise2 = chamarServidorService.mudarBackground(formData2);

  return new Promise((resolve, reject) => {
    Promise.all([mudarBackgroundPromise1, mudarBackgroundPromise2])
    .then(([image_url1, image_url2]) => {
      var imgOptionDiv1 = document.getElementById('image-1');
      var imgOptionDiv2 = document.getElementById('image-2');
  
      imgOptionDiv1.src = image_url1;
      imgOptionDiv2.src = image_url2;
      console.log("operação concluída com sucesso!")
      resolve();
    })
    .catch((error) => {
      console.error("Erro ao fazer chamadas ao servidor:", error)
      reject(error);
    })
  })
}

function regerarImagem() {
  const imageFile = localStorage.getItem('imagemProduto');
  return new Promise((resolve, reject) => {
    fetch(imageFile)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return refazerRequisicaoImagem(blob);
      })
      .then(()=> {
        resolve();
      })
      .catch((error) => {
        console.error(error + " deu erro no blob")
        reject(error);
      })
  })
}

function regerarFrases() {
  return new Promise((resolve, reject) => {
    chamarServidorService.enviarNomeEDescricaoProduto('gerarFrase')
    .then(() => {
      mostrarOpcoesFrases();
      resolve();
    })
    .catch((error) => {
      console.error(error + " ERRO NA GERAÇÃO DE FRASES");
      reject(error);
    })
  })
}

function regerarTextos() {
  return new Promise((resolve, reject) => {
    chamarServidorService.enviarNomeEDescricaoProduto('gerarTexto')
    .then(() => {
      mostrarTexto();
      resolve();
    })
    .catch((error) => {
      console.error(error + " ERRO NA GERAÇÃO DE TEXTOS");
      reject(error);
    })
  })
}

function regerarSlogans() {
  return new Promise((resolve, reject) => {
    chamarServidorService.enviarNomeEDescricaoProduto('gerarSlogan')
    .then(() => {
      mostrarSlogan();
      resolve();
    })
    .catch((error) => {
      console.error(error + " ERRO NA GERAÇÃO DE SLOGANS");
      reject(error);
    })
  })
}


function regerarOpcoes() {
  // Mostrar a sobreposição escura e o spinner
  document.body.classList.add('overlay-visible');

  if (pageState == States.IMAGE) {
    regerarImagem().then(() => {
        document.body.classList.remove('overlay-visible');  
      }).catch((error) => {
        console.error(error + " ERRO NA GERAÇÃO DE IMAGENS");
      })
  } else if (pageState == States.FRASE) {
    regerarFrases().then(() => {
        document.body.classList.remove('overlay-visible'); 
      }).catch((error) => {
        console.error(error + " ERRO NA GERAÇÃO DE FRASES");
      })
  } else if (pageState == States.TEXTO) {
    regerarTextos().then(() => {
        document.body.classList.remove('overlay-visible'); 
      }).catch((error) => {
        console.error(error + " ERRO NA GERAÇÃO DE TEXTOS");
      })
  } else if (pageState == States.SLOGAN) {
    regerarSlogans().then(() => {
        document.body.classList.remove('overlay-visible'); 
      }).catch((error) => {
        console.error(error + " ERRO NA GERAÇÃO DE SLOGANS");
      })
  } else {
    console.log("no state")
  }
}