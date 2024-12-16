import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// {
//   "adult": false,
//   "backdrop_path": "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
//   "belongs_to_collection": {
//       "id": 558216,
//       "name": "Venom Collection",
//       "poster_path": "/4bXIKqdZIjR8wKgZaGDaLhLj4yF.jpg",
//       "backdrop_path": "/vq340s8DxA5Q209FT8PHA6CXYOx.jpg"
//   },
//   "budget": 120000000,
//   "genres": [
//       {
//           "id": 28,
//           "name": "Action"
//       },
//       {
//           "id": 878,
//           "name": "Science Fiction"
//       },
//       {
//           "id": 12,
//           "name": "Adventure"
//       },
//       {
//           "id": 53,
//           "name": "Thriller"
//       }
//   ],
//   "homepage": "https://venom.movie",
//   "id": 912649,
//   "imdb_id": "tt16366836",
//   "origin_country": [
//       "US"
//   ],
//   "original_language": "en",
//   "original_title": "Venom: The Last Dance",
//   "overview": "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
//   "popularity": 9486.301,
//   "poster_path": "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
//   "production_companies": [
//       {
//           "id": 5,
//           "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
//           "name": "Columbia Pictures",
//           "origin_country": "US"
//       },
//       {
//           "id": 84041,
//           "logo_path": "/nw4kyc29QRpNtFbdsBHkRSFavvt.png",
//           "name": "Pascal Pictures",
//           "origin_country": "US"
//       },
//       {
//           "id": 53462,
//           "logo_path": "/nx8B3Phlcse02w86RW4CJqzCnfL.png",
//           "name": "Matt Tolmach Productions",
//           "origin_country": "US"
//       },
//       {
//           "id": 91797,
//           "logo_path": null,
//           "name": "Hutch Parker Entertainment",
//           "origin_country": "US"
//       },
//       {
//           "id": 14439,
//           "logo_path": null,
//           "name": "Arad Productions",
//           "origin_country": "US"
//       }
//   ],
//   "production_countries": [
//       {
//           "iso_3166_1": "US",
//           "name": "United States of America"
//       }
//   ],
//   "release_date": "2024-10-22",
//   "revenue": 468513700,
//   "runtime": 109,
//   "spoken_languages": [
//       {
//           "english_name": "English",
//           "iso_639_1": "en",
//           "name": "English"
//       }
//   ],
//   "status": "Released",
//   "tagline": "'Til death do they part.",
//   "title": "Venom: The Last Dance",
//   "video": false,
//   "vote_average": 6.774,
//   "vote_count": 1562
// }
const MovieSchema = new Schema({
  adult: { type: Boolean },
  id: { type: Number, required: true, unique: true },
  poster_path: { type: String },
  overview: { type: String },
  release_date: { type: String },
  original_title: { type: String },
  genres: [{ type: Schema.Types.Mixed }],
  revenue: { type: Number },
  original_language: { type: String },
  title: { type: String },
  backdrop_path: { type: String },
  popularity: { type: Number },
  vote_count: { type: Number },
  video: { type: Boolean },
  vote_average: { type: Number },
  production_countries: [{
    iso_3166_1: { type: String },
    name: { type: String }
  }],
  runtime: { type: Number },
  spoken_languages: [{
    iso_639_1: { type: String },
    name: { type: String }
  }],
  status: { type: String },
  tagline: { type: String },
});

MovieSchema.statics.findByMovieDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Movie', MovieSchema);


