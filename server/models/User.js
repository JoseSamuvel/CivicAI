const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['citizen', 'admin', 'officer'], default: 'citizen' },
  phone: { type: String, trim: true },
  city: { type: String, default: 'Tirunelveli' },
  isActive: { type: Boolean, default: true },
  totalComplaints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook: hash password only if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: compare plain password with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
