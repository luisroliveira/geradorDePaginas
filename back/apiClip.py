import requests
import os
import uuid

def generate_unique_filename(folder_path, extension):
    while True:
        unique_filename = str(uuid.uuid4()) + extension
        file_path = os.path.join(folder_path, unique_filename)
        if not os.path.exists(file_path):
            return unique_filename

def apiChangeBackGroundTest(nomeArquivo, prompt):
    pass
    # # Link da API
    # link = "https://clipdrop-api.co/replace-background/v1"
    # pathImagem = "imagensSaida/" + nomeArquivo  

    # # Vai abrir a imagem e colocar na variável image_data
    # with open(pathImagem, 'rb') as image_file:
    #     image_data = image_file.read()

    # # Comunicação com a API
    # r = requests.post(link,
    # files = {
    #     'image_file': ('teste.jpg', image_data, 'image/jpeg'),
    #     },
    # data = {'prompt': prompt},
    # headers = { 'x-api-key': API_KEY}
    # )

    # # Caso ocorra tudo certo, a imagem será salva na pasta imagensSaida
    # if r.ok:
    #     pathSaida = "imagensBackground/" + nomeArquivo
    #     with open(pathSaida, 'wb') as output_file:
    #         output_file.write(r.content)
    #     print("Imagem de saída salva com sucesso!")
    # else:
    #     r.raise_for_status()

def apiChangeBackGround(image_file, prompt, saveDirectory, apiKey):
    extension = ".jpeg"
    nomeArquivo = generate_unique_filename(saveDirectory, extension)

    # # Para rodar fazendo a chamada para a API, comentar as 3 linhas abaixo e descomentar as outras
    # pathSaida = saveDirectory + nomeArquivo
    # image_file.save(pathSaida)
    # return nomeArquivo

    # Link da API
    link = "https://clipdrop-api.co/replace-background/v1"
    
    # Vai abrir a imagem e colocar na variável image_data
    image_data = image_file.read()

    # Comunicação com a API
    r = requests.post(link,
    files = {
        'image_file': ('teste.jpg', image_data, 'image/jpeg'),
        },
    data = {'prompt': prompt},
    headers = { 'x-api-key': apiKey}
    )

    # Caso ocorra tudo certo, a imagem será salva na pasta imagensSaida
    if r.ok:
        pathSaida = saveDirectory + nomeArquivo
        with open(pathSaida, 'wb') as output_file:
            output_file.write(r.content)
        print("Imagem de saída salva com sucesso!")
        return nomeArquivo
    else:
        r.raise_for_status()


def apiRemoveBackGroundTest(nomeArquivo, apiKey): 
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
    headers = { 'x-api-key': apiKey}
    )

    # Caso ocorra tudo certo, a imagem será salva na pasta imagensSaida
    if r.ok:
        pathSaida = "imagensSaida/" + nomeArquivo
        with open(pathSaida, 'wb') as output_file:
            output_file.write(r.content)
        print("Background definido com sucesso!")
    else:
        r.raise_for_status()

def apiRemoveBackGround(image_file): 
    # Link da API
    link = "https://clipdrop-api.co/remove-background/v1"

    nomeArquivo = "teste.jpeg"
    
    # Vai abrir a imagem e colocar na variável image_data
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
        print("Background removido com sucesso!")
        return r
    else:
        r.raise_for_status()



# prompt = "On the wall of a house by the sea with a window nearby"
# nomeArquivoImagem = "prancha.jpeg"
# apiChangeBackGroundTest(nomeArquivoImagem, prompt)


# apiRemoveBackGroundTest(nomeArquivoImagem)
