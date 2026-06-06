from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
# Enable CORS so your React frontend can talk to this server safely
CORS(app)

# Load your Machine Learning files into memory when the server starts
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl', 'rb'))

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

        # 1. Check if movie exists
        if movie_name not in movies['title'].values:
            return jsonify({'error': 'Movie not found in our database.'}), 404

        # 2. Find movie index and calculate distances
        movie_index = movies[movies['title'] == movie_name].index[0]
        distances = similarity[movie_index]
        
        # 3. Sort to find the top 5 closest matches
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        # 4. Package the results for React
        recommended_movies = []
        for i in movies_list:
            # Handle dataset variations (sometimes the column is 'movie_id', sometimes 'id')
            m_id = int(movies.iloc[i[0]].get('id', movies.iloc[i[0]].get('movie_id')))
            m_title = movies.iloc[i[0]].title
            recommended_movies.append({'id': m_id, 'title': m_title})

        return jsonify(recommended_movies), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- START SERVER ---
if __name__ == '__main__':
    app.run(port=5001, debug=True)