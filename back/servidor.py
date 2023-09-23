from flask import Flask, request, jsonify, send_from_directory, send_file
import json
from apiClip import apiChangeBackGround
from apiChat import apiChatGpt
from createZip import makeZip
from changeHtml import chngHtml
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'imagensBackground/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

@app.route("/change-background", methods=["POST"])
def change_img_bg():
    try:
        image_file = request.files["image"]  # Obtém o arquivo de imagem do formulário
        prompt = request.form["prompt"]  # Obtém o texto do formulário

        if image_file:
            # Faça algo com o arquivo de imagem, como salvar no servidor
            # Por exemplo, para salvar a imagem em um diretório chamado "uploads":
            pathImagem = apiChangeBackGround(image_file, prompt, app.config['UPLOAD_FOLDER'])
            # URL da imagem
            image_url = f"http://localhost:8000/change-background/{pathImagem}"
            return jsonify({"message": "Imagem enviada com sucesso!", "image_url": image_url})
        else:
            return jsonify({"error": "Nenhum arquivo de imagem recebido"}), 400
    except Exception as e:
        print("Erro no change img background")
        return jsonify({"error": str(e)}), 500

# Rota para acessar a imagem
@app.route("/change-background/<filename>", methods=["GET"])
def get_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print("Erro no get img")
        return jsonify({"error": str(e)}), 500

# Rota para enviar o zip para o front
@app.route("/download")
def download():
    arquivo_zip = "zips/arquivo.zip"  # nome do arquivo ZIP
    return send_file(
        arquivo_zip,
        as_attachment=True,
        download_name='arquivo.zip',  # O nome que o usuário verá ao baixar
        mimetype='application/zip'
    )


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
        
        if funcao == "apiChatGpt":
            resultado = apiChatGpt(parametro)
        elif funcao == "funcao_1":
            resultado = funcao_1(parametro)
        elif funcao == "makeZip":
            resultado = makeZip(parametro)
        elif funcao == "chngHtml":
            resultado = chngHtml(parametro)
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
