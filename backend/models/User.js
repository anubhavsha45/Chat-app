const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please gu=ive your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email"],
  },

  password: {
    type: String,
    required: [true, "please provide your password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Your password and password confirm fields do not match",
    },
  },
  profilePic: {
    type: String,
    default: "",
  },
});
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
