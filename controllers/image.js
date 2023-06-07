const Clarifai = require('clarifai');

 // Face detection API
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECTION_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
}


 const handleImage = (req, res, db) => {
	const { id } = req.body;
	db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json(err));
}

module.exports = {
	handleImage,
	handleApiCall
}