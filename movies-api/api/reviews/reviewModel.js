import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  author: { type: String, required: true },
  movieId: { type: Number, required: true },
  rating: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true }
});

ReviewSchema.statics.findByReviewId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Review', ReviewSchema);


