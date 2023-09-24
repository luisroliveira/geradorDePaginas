class ChamarServidorService {
  constructor () {
    this.urlServidor = 'http://localhost:8000'
  }

  chamarServidor(nomeFuncao, nomeParametro) {
    const funcaoParaChamar = nomeFuncao // Nome da função que você deseja chamar
    const parametro = nomeParametro
  
    fetch(this.urlServidor, {
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

  async criarZip(nomeTemplate) {
    const funcaoParaChamar = 'makeZip' // Nome da função que você deseja chamar
    const parametro = nomeTemplate

    return new Promise((resolve, reject) => {
      fetch(this.urlServidor, {
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

  downloadZip() {
    const serverUrl = this.urlServidor + "/download"
    fetch(serverUrl, {
    method: 'GET'
    })
    .then(response => {
    // Verificar se a solicitação foi bem-sucedida
      if (response.ok) {
        // Iniciar o download do arquivo ZIP
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'arquivo.zip'; // Nome do arquivo para download
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        // Lida com erros, se necessário
        console.error('Erro ao baixar o arquivo ZIP.');
      }
    })
    .catch(error => {
      // Lida com erros de rede ou outros erros
      console.error('Erro na solicitação: ' + error);
    });
  }
}

// const inputImage = document.getElementById('input-image')
// const selectedImage = document.getElementById('selected-image')
const botao = document.getElementById("download")
const chamarServidorService = new ChamarServidorService()

botao.addEventListener("click", async function() {
  await chamarServidorService.criarZip("HOME_TEMPLATE1")
  await chamarServidorService.downloadZip()
});