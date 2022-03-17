const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default:
        'http://res.cloudinary.com/dnjnlemli/image/upload/v1647535705/c4pnjlqj9wahx1npzbdv.png',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcryptjs.genSaltSync(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
