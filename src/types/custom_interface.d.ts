export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  zip_code: string;
  city:string;
  state:string;
  password: string;
  profile_pic: string;
  wallet_balance: Number;
  email_verified: Number,
  phone_verified: Number
}

export type AuthTokenPayload = {
  email: String,
  expires_in: string
};

export interface ForgotPassword extends Document {
  email: string,
  token: string,
  expiresAt: string,
}



export interface LoginHistoryInterface extends Document {
  email: string,
  device_info: string
  login_history: [
    {
      device_id: string,
      location: {
        latitude: Number,
        longitude: Number,
      },
      date_time: Number,
    }
  ]
}