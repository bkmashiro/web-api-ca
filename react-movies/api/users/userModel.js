import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const passwordValidator = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g.test(password);
}

UserSchema.path("password").validate(passwordValidator);
UserSchema.methods.comparePassword = async function (passw) {
  return await bcrypt.compare(passw, this.password);
}
UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};
UserSchema.pre('save', async function (next) {
  const saltRounds = 10; // You can adjust the number of salt rounds
  //const user = this;
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }

  } else {
    next();
  }
});
export default mongoose.model('User', UserSchema);