import mongoose, { Schema, Model } from 'mongoose';

import { ForgotPassword } from 'src/types/custom_interface';
const forgotSchema = new Schema<ForgotPassword>({
    email: String,
    token: String,
    expiresAt: String,
}, {
    versionKey: false,
    timestamps: true
})

export const forgotPasswordModel: Model<ForgotPassword> = mongoose.model('password_recovery', forgotSchema);