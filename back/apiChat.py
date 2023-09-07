from senhaChat import API_KEY
import requests
import json

def apiChatGpt(textoEntrada):
    # headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type":"application/json"}
    # link = "https://api.openai.com/v1/chat/completions"
    # id_modelo = "gpt-3.5-turbo"

    # body_mensagem = {
    #     "model": id_modelo,
    #     "messages": [{"role": "user", "content": textoEntrada}]
    # }

    # body_mensagem = json.dumps(body_mensagem)

    # requisicao = requests.post(link, headers=headers, data=body_mensagem)
    # resposta = requisicao.json()
    # mensagem = resposta["choices"][0]["message"]["content"]
    mensagem = """
    "Frases Persuasivas:
    1. "Com o barber+, fazer a barba nunca foi tão fácil e confortável."
    2. "Experimente a sensação suave e sem irritações que só nosso barber+ pode oferecer."
    3. "Não perca mais tempo! Com o barber+, obtenha um corte rápido e preciso para se manter sempre bem aparentado."
    4. "Desfrute de uma experiência de barbear luxuosa com o nosso inovador barber+."
    5. "Barber+, a resposta para uma barba bem feita e sem esforço."

    Texto Persuasivo:
    1. "Não há nada como começar o dia com uma cara fresca e limpa, é por isso que apresentamos o Barber+. Este barbeador premium não é apenas um produto, mas sim um investimento em sua aparência pessoal. Fácil de usar, rápido no corte e suave na pele, você sentirá a diferença desde o primeiro uso. Com o Barber+ você estará sempre pronto para encarar seu dia da melhor maneira possível!"
    2. "O Barber+ redefine o ato de fazer a barba. Diga adeus às lâminas antigas que puxam e irritam a pele. Nosso barbeador dá-lhe um corte suave e perfeito todas as vezes, tornando sua rotina matinal mais rápida e menos dolorosa. Agora você pode ter uma barba bem feita e sem esforço, deixando mais tempo para as coisas que realmente importam."

    Slogans:
    1. "Barber+: Sua melhor imagem começa aqui."
    2. "Alcance a perfeição em cada corte com Barber+."
    3. "Barber+, elevando sua experiência de barbear ao máximo.""
    """

    return mensagem


# texto = "crie 5 frases de efeito curtas para vender bolsa"
# textoSaida =  apiChatGpt(texto)
# print(textoSaida)