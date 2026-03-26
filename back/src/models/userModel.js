import mongoose from "mongoose";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false
  }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const hashedPassword = await hashPassword(this.password);
        this.password = hashedPassword;
    } catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;