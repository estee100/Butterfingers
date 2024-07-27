require("dotenv").config();

const apiKey = process.env.TMDB_API_KEY;
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const port = 4321;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3600m",
        });
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: "",
    });
});

// Add to movie list
app.post("/add-to-list", authenticateToken, async (req, res) => {
    const { movieId } = req.body;
  
    if (!movieId) {
      return res.status(400).json({ error: true, message: "Movie ID is required" });
    }
  
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: apiKey },
      });
  
      const movie = {
        movieId: response.data.id,
        title: response.data.original_title,
        posterPath: response.data.poster_path,
        backdropPath: response.data.backdrop_path,
        releaseDate: response.data.release_date,
        voteAverage: response.data.vote_average,
        voteCount: response.data.vote_count,
        overview: response.data.overview
      };
  
      const user = req.user.user;
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { movieList: movie } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
  
      return res.json({ error: false, message: "Movie added to My List successfully", user: updatedUser });
    } catch (error) {
      console.error("Error adding movie to list:", error);
      return res.status(500).json({ error: true, message: "Internal server error" });
    }
});  

// Remove from list
app.delete('/my-list/:movieId', authenticateToken, async (req, res) => {
    const { movieId } = req.params;
    const userId = req.user.user._id;

    try {
        const result = await User.updateOne(
            { _id: userId, 'movieList.movieId': movieId },
            { $pull: { movieList: { movieId: movieId } } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send('Movie removed successfully');
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (error) {
        console.error('Error removing movie:', error);
        res.status(500).send('Server error');
    }
});

// Handle rating and status
app.put('/my-list/:movieId', authenticateToken, async (req, res) => {
    const { movieId } = req.params;
    const { rating, status } = req.body;

    try {
        console.log('Request Body:', req.body);

        const user = await User.findById(req.user.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const movie = user.movieList.find(movie => movie.movieId === movieId);
        if (movie) {
            if (rating !== undefined) {
                if (typeof rating !== 'number' || rating < 0 || rating > 10) {
                    return res.status(400).json({ message: 'Invalid rating value' });
                }
                movie.rating = rating;
            }
            if (status !== undefined) {
                if (!['Planning to Watch', 'Watched'].includes(status)) {
                    return res.status(400).json({ message: 'Invalid status value' });
                }
                movie.status = status;
            }

            await user.save();
            res.json({ message: 'Movie updated successfully' });
        } else {
            res.status(404).json({ message: 'Movie not found in your list' });
        }
    } catch (error) {
        console.error('Error updating movie:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.get('/my-list', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user._id;
        const user = await User.findById(userId).select('movieList');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.movieList);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
