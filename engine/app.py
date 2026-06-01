from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_limiter import Limiter 
from flask_limiter.util import get_remote_address 
from ai import best_move

app = Flask(__name__)
CORS(app)

limiter = Limiter(
    key_func = get_remote_address,
    app = app,
    default_limits = ["100 per minute"],
    storage_uri = "memory://"
)

@app.route("/")
def home():
    return render_template("intro.html")

@app.route("/game")
def game():
    return render_template("index.html")

@app.errorhandler(500)
def server_error(e):
    return render_template("500.html"), 500

@app.errorhandler(429)
def ratelimit_error(e):
    return jsonify({
        "error" : "Đừng spam! Định hack à!!"
    }), 429

@app.route("/move", methods=["POST"])
@limiter.limit("60 per minute")
def move():
    data = request.get_json()
    if not data:
        return jsonify({
            "error" : "INVALID JSON"
        }), 400
    
    board = data.get("board")
    if board is None:
        return jsonify({"error" : "Không thấy board"}), 400
    
    try:
        difficulty = int(data.get("difficulty", 0))
    except:
        return jsonify({"error" : "Kiểu không hợp lệ"}), 400
    if difficulty not in [-1,0,1]:
        return jsonify({
            "error" : "difficulty không hợp lệ"
        }), 400
    
    for row in board:
        for cell in row:
            if cell not in [".","X","O"]:
                return jsonify({
                    "error" : "Sai giá trị board"
                }), 400 

    r, c = best_move(board, difficulty)

    return jsonify({
        "row": r, 
        "col": c
    })
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5100, debug=False) 