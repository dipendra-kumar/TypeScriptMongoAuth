import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from 'src/types/custom_interface';

const userSchema = new Schema<IUser>({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_pic: {
    type: String,
    default: null
  },
  address: {
    type: String,
    required: true
  },
  zip_code: {
    type: String,
    required: true
  },
  city:{
    type:String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  wallet_balance: {
    type: Number,
    required: true
  },
  phone_verified: {
    type: Number,
    default: 0
  },
  email_verified: {
    type: Number,
    default: 0
  }
});

userSchema.pre(`save`, function () {
  this.wallet_balance = Number(this.wallet_balance.toFixed(2));
})

export const userModel: Model<IUser> = mongoose.model('User', userSchema);
