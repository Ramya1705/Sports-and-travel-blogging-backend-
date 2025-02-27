// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');

// // const userSchema = new mongoose.Schema({
// //   userType: { type: String, enum: ['user', 'admin'], default: 'user' },
// //   secretKey: { type: String, default: '' },
// //   username: { type: String, required: true, unique: true },
// //   email: { type: String, required: true, unique: true },
// //   mobileNo: { type: String, required: true },
// //   password: { type: String, required: true },
// //   isVerified: { type: Boolean, default: false },
// //   otp: { type: String },
// //   otpExpires: { type: Date },
// // });

// // userSchema.pre('save', async function (next) {
// //   if (this.isModified('password')) {
// //     this.password = await bcrypt.hash(this.password, 10);
// //   }
// //   next();
// // });

// // module.exports = mongoose.model('User', userSchema);
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   bio: {
//     type: String,
//     default: ''
//   },
//   profilePicture: {
//     type: String,
//     default: 'default-avatar.jpg'
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   },
//   favorites: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Blog'
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: 'default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
