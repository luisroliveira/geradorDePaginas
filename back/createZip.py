import zipfile
import os

def makeZip(nomeTemplate):
    diretorioTemplate   = './../front/assets/' + nomeTemplate + '.html'
    diretorioImagens    = './imagensBackground'
    diretorioFiles      = './../front/assets/' + nomeTemplate + '_files'

    imagens = os.listdir(diretorioImagens)
    for i in range(len(imagens)):
        imagens[i] = diretorioImagens + '/' + imagens[i]

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

# makeZip("HOME_TEMPLATE1")