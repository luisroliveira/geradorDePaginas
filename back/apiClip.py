from senhaClip import API_KEY
import requests

def apiRemoveBackGround(nomeArquivo):
    # Link da API
    link = "https://clipdrop-api.co/remove-background/v1"
    pathImagem = "imagensEntrada/" + nomeArquivo  

    # Vai abrir a imagem e colocar na variável image_data
    with open(pathImagem, 'rb') as image_file:
        image_data = image_file.read()

    # Comunicação com a API
    r = requests.post(link,
    files = {
        'image_file': ('teste.jpg', image_data, 'image/jpeg'),
        },
    headers = { 'x-api-key': API_KEY}
    )

    # Caso ocorra tudo certo, a imagem será salva na pasta imagensSaida
    if r.ok:
        pathSaida = "imagensSaida/" + nomeArquivo
        with open(pathSaida, 'wb') as output_file:
            output_file.write(r.content)
        print("Imagem de saída salva com sucesso!")
    else:
        r.raise_for_status()


# nomeArquivoImagem = "pessoa.jpg"
# apiRemoveBackGround(nomeArquivoImagem)
