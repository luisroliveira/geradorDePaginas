from flask import Flask, request, jsonify
import json
from apiClip import apiRemoveBackGround
from apiChat import apiChatGpt

app = Flask(__name__)

def funcao_1(parametro):
    resultado = f"Olá da Função 1, {parametro}!"
    return resultado

@app.route('/', methods=['POST', 'OPTIONS'])
def handle_request():
    if request.method == 'OPTIONS':
        response = app.response_class(
            response=json.dumps({}),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    elif request.method == 'POST':
        data = request.get_json()
        funcao = data.get('funcao')
        parametro = data.get('parametro')
        
        if funcao == "apiRemoveBackGround":
            resultado = apiRemoveBackGround(parametro)
        elif funcao == "apiChatGpt":
            resultado = apiChatGpt(parametro)
        elif funcao == "funcao_1":
            resultado = funcao_1(parametro)
        else:
            resultado = "Função desconhecida"
        
        response = app.response_class(
            response=json.dumps({'resultado': resultado}),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
