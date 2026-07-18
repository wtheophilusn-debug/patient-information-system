const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName:  { type: String, required: true, trim: true },
  username:  { type: String, required: true, unique: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ['Administrator', 'Receptionist', 'Nurse', 'Doctor', 'Patient'],
    default: 'Patient',
  },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || this.password.startsWith('$2')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
