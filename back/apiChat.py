from senhaChat import API_KEY
import requests
import json

def apiChatGpt(textoEntrada):
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-3.5-turbo"

    body_mensagem = {
        "model": id_modelo,
        "messages": [{"role": "user", "content": textoEntrada}]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]

    return mensagem


# texto = "crie 5 frases de efeito curtas para vender bolsa"
# textoSaida =  apiChatGpt(texto)
# print(textoSaida)