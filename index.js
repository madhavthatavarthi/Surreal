const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userDetails = require('./routes/userDetails');
const movieDetails = require('./routes/movieDetails');
const authDetails = require('./routes/authentication');
const basicAuth = require('./middleware/auth');
const genreDetails = require('./routes/genre');
const actorDetails = require('./routes/actor');
const raingDetails = require('./routes/rating');



app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.use(basicAuth);

app.use("/api/register", userDetails);
app.use("/api/movie", movieDetails);
app.use("/api/authentication", authDetails);
app.use("/api/genre", genreDetails)
app.use("/api/actor", actorDetails)
app.use("/api/rating", raingDetails)


const port = 3000;

app.listen(port, () => {
    console.log(`App is listening to ${port}`)
})