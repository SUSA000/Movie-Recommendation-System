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

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        movie_title = data.get('movie')

        # Check if the movie exists in your dataset
        if movie_title not in movies['title'].values:
            return jsonify({'error': 'Movie not found in our database.'}), 404

        # Find the index of the movie in the dataframe
        movie_index = movies[movies['title'] == movie_title].index[0]
        
        # Calculate distances using your pre-trained similarity matrix
        distances = similarity[movie_index]
        
        # Sort to find the top 5 most similar movies (skipping the first one, which is the movie itself)
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_movies = []
        for i in movies_list:
            # We grab the TMDB ID so your React frontend can fetch the live poster!
            # Note: change 'movie_id' to 'id' if your dataframe uses that column name
            movie_id = str(movies.iloc[i[0]].movie_id) 
            title = str(movies.iloc[i[0]].title)
            recommended_movies.append({'id': movie_id, 'title': title})

        return jsonify(recommended_movies), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # We run this on port 5001 so it doesn't clash with your Node.js backend on 5000!
    app.run(port=5001, debug=True)