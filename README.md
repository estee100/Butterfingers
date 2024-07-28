# Butterfingers

Butterfingers is a full-stack movie tracking and management app. It allows users to search for movies, create and manage movie list, rate movies, and view movie details. The app provides a robust platform for movie enthusiasts to track their favorite films, explore new ones, and organize their movie experience.
![image](https://github.com/user-attachments/assets/8e0806bb-21a1-43c7-9173-d51c46fc20d7)

## Features

- **Movie Tracking**: Search for movies and view detailed information.
- **Lists Management**: Create and manage lists of movies, including a "My List" feature where users can rate and organize movies.
- **User Authentication**: Secure login and sign-up functionality for personalized experiences.
- **Recommendations**: View recommended movies based on selected titles.
- **Responsive Design**: A user-friendly interface that works well on desktop.

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **APIs**: TMDB API for movie data
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## Live Demo

You can view the live version of Butterfingers at [Butterfingers App](https://butterfingers-app.vercel.app/).

## Installation

### Frontend

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/butterfingers.git
   ```
   
2. Navigate to the frontend directory:
```
cd butterfingers/frontend
```
3. Install dependencies:
```
npm install
```

4. Create a .env file in the frontend directory and add your environment variables:
```
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
REACT_APP_API_KEY=YOUR_REACT_APP_API_KEY
```

Start the development server:
```
npm start
```
### Backend
1. Navigate to the backend directory:
```
cd butterfingers/backend
```
2. Install dependencies:
```
npm install
```
3. Create a .env file in the backend directory and add your environment variables:
```
TMDB_API_KEY=your_tmdb_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. Start the server:
```
npm start
```
## API Endpoints
### User Authentication
- POST /login: Log in a user
- POST /signup: Create a new user account
- GET /get-user: Fetch user information (requires authentication)
### Movie Management
- POST /add-to-list: Add a movie to the user's list (requires authentication)
- GET /movies/:type: Fetch a list of movies (e.g., popular, top-rated, upcoming)
- GET /movie/:id: Fetch detailed information about a specific movie
- DELETE /my-list/:movieId Remove movie from list
- PUT /my-list/:movieId Handle rating and status of movies
- GET /my-list Fetch movies in the users list
## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Submit a pull request.
## License
This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## Acknowledgements
- TMDB API for movie data
- React for building the user interface
- Express for creating the backend server
- MongoDB for database management
## Contact
For any questions or issues, please reach out to sktang@ualberta.ca

Feel free to adjust any details as necessary, such as repository URLs, environment variable names, or contact information.
