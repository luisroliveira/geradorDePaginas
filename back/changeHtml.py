from jinja2 import Environment, FileSystemLoader

def chngHtml(stringAtributos):
    array = stringAtributos.split(";")
    nomeTemplate = array[0]
    slogan = array[1]
    nomeLoja = array[2]
    nomeProduto = array[3]
    texto = array[4]
    frase = array[5]
    nomeImg1 = array[6]
    nomeImg2 = array[7]

    env = Environment(loader=FileSystemLoader('.'))
    urlTemplate = "./assets/templateBruto/" + nomeTemplate + ".html"
    template = env.get_template(urlTemplate)
    urlImg1 = nomeImg1
    urlImg2 = nomeImg2
    html_renderizado = template.render(slogan = slogan, nomeLoja = nomeLoja, nomeProduto = nomeProduto, frase = frase, texto = texto, diretorioImagem1= urlImg1, diretorioImagem2 = urlImg2)

    urlTemplateSaida = "./assets/templateFinal/" + nomeTemplate + ".html" 
    # Salve o HTML renderizado em um arquivo de saída
    with open(urlTemplateSaida, 'w') as arquivo_saida:
        arquivo_saida.write(html_renderizado)

# chngHtml("HOME_TEMPLATE1", "SLOGAM TESTE", "NOMELOJA", "NOMEPRODUTO", "TEXTO", "FRASE", "prancha.jpeg")