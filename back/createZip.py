import zipfile
import os

def makeZip(stringAtributos):
    array = stringAtributos.split(';')
    nomeTemplate = array[0]
    nomeImagem1 = array[1]
    nomeImagem2 = array[2]
    diretorioTemplate   = './assets/templateFinal/' + nomeTemplate + '.html'
    diretorioImagens    = './imagensBackground/'
    diretorioFiles      = './assets/' + nomeTemplate + '_files'
    urlImagem1 = diretorioImagens + nomeImagem1
    urlImagem2 = diretorioImagens + nomeImagem2
    imagens = []
    imagens.append(urlImagem1)
    imagens.append(urlImagem2)

    files = os.listdir(diretorioFiles)
    for i in range(len(files)):
        files[i] = diretorioFiles + '/' + files[i]
    
    imagens.append(diretorioTemplate)
    nome_zip = "./zips/arquivo.zip"

    # Crie o arquivo zip
    with zipfile.ZipFile(nome_zip, 'w') as zipf:
        for imagem in imagens:
            nome_imagem = os.path.basename(imagem)
            zipf.write(imagem, nome_imagem)
        
        for file in files:
            nome_file = nomeTemplate + '_files' + '/' + os.path.basename(file)
            zipf.write(file, nome_file)

    return "Zip criado com sucesso"

