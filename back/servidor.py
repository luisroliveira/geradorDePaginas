from flask import Flask, request, jsonify
import json
from apiClip import apiRemoveBackGround
from apiChat import apiChatGpt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def funcao_1(parametro):
    resultado = f"Olá da Função 1, {parametro}!"
    return resultado

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        image_file = request.files["image"]  # Obtém o arquivo de imagem do formulário

        # Faça algo com o arquivo de imagem, como salvar no servidor
        # Por exemplo, para salvar a imagem em um diretório chamado "uploads":
        image_file.save("imagensSaida/teste.jpeg")

        return jsonify({"message": "Imagem enviada com sucesso!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
