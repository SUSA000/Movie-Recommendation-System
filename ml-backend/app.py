import os
import gdown
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
# Enable CORS so your React frontend can talk to this server safely
CORS(app)

# --- GOOGLE DRIVE DOWNLOAD SETUP ---
SIMILARITY_FILE = 'similarity.pkl'
DICT_FILE = 'movie_dict.pkl'

# Your specific Google Drive File IDs
# Assuming the first link was similarity.pkl and the second was movie_dict.pkl
SIMILARITY_FILE_ID = '1j3xVfBMFQz9pAva_MWOOSwulKLl-hCja'
DICT_FILE_ID = '1lUFCFMiH1wtYavyD5SGMW8w-VxeU7p9t'

def download_file_from_drive(file_id, destination):
    if not os.path.exists(destination):
        print(f"Downloading {destination} from Google Drive...")
        url = f'https://drive.google.com/uc?id={file_id}'
        gdown.download(url, destination, quiet=False)
        print(f"Successfully downloaded {destination}!")
    else:
        print(f"{destination} already exists locally. Skipping download.")

# Download the files before starting up the AI
download_file_from_drive(SIMILARITY_FILE_ID, SIMILARITY_FILE)
download_file_from_drive(DICT_FILE_ID, DICT_FILE)

# Load your Machine Learning files into memory
movies_dict = pickle.load(open(DICT_FILE, 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open(SIMILARITY_FILE, 'rb'))

# --- ROUTE 1: The Dropdown Autocomplete ---
@app.route('/api/movies', methods=['GET'])
def get_all_movies():
    try:
        movie_titles = movies['title'].tolist()
        return jsonify(movie_titles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- ROUTE 2: The Machine Learning Engine ---
@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        movie_name = data.get('movie')

        if movie_name not in movies['title'].values:
            return jsonify({'error': 'Movie not found in our database.'}), 404

        movie_index = movies[movies['title'] == movie_name].index[0]
        distances = similarity[movie_index]
        
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_movies = []
        for i in movies_list:
            m_id = int(movies.iloc[i[0]].get('id', movies.iloc[i[0]].get('movie_id')))
            m_title = movies.iloc[i[0]].title
            recommended_movies.append({'id': m_id, 'title': m_title})

        return jsonify(recommended_movies), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Render assigns a dynamic port, so we check for it, defaulting to 5001 locally
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)