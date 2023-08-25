from senhaChat import API_KEY
import requests
import json

# Definir o nome do produto
produto = "microondas"

headears = {"Authorization": f"Bearer {API_KEY}", "Content-Type":"application/json"}
link = "https://api.openai.com/v1/chat/completions"
id_modelo = "gpt-3.5-turbo"

textoEntrada = "crie 5 frases de efeito, sendo pesuasivos, para vender " + produto

body_mensagem = {
    "model": id_modelo,
    "messages": [{"role": "user", "content": textoEntrada}]
}

body_mensagem = json.dumps(body_mensagem)

requisicao = requests.post(link, headears=headears, data=body_mensagem)
reposta = requisicao.json
mensagem = resposta["choices"][0]["message"]["content"]
