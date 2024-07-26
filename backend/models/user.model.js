const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieId: { type: String },
    title: { type: String },
    posterPath: { type: String },
    backdropPath: { type: String },
    releaseDate: { type: String },
    voteAverage: { type: Number },
    voteCount: { type: Number },
    overview: { type: String },
    rating: { type: Number, default: 0 },
    status: { type: String, enum: ['Planning to Watch', 'Watched'], default: 'Planning to Watch' }
});

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() },
    movieList: [movieSchema]
});

module.exports = mongoose.model("User", userSchema);
