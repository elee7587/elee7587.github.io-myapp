from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import function  # your updated function.py with process_data returning (restaurant, prediction) list
import os


app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        df = pd.read_csv(file)
        predictions = function.process_data(df)  # List of (restaurant, prediction)

        # Convert list of tuples into list of dicts for JSON response
        response = {
        "predictions": [{"restaurant": name, "predicted_label": int(label)} for name, label in predictions]
        }   
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # Default to 8080 if not set
    app.run(host='0.0.0.0', port=port)