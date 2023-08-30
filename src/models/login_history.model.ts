import mongoose, { Schema, Model } from 'mongoose'
import { LoginHistoryInterface } from 'src/types/custom_interface'


const loginHistorySchema = new Schema<LoginHistoryInterface>({
    email: {
        type: String,
        required: true
    },
    login_history: [
        {
            device_id: { type: String, required: true },
            device_info: { type: String, required: true },
            location: {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true },
            },
            date_time: { type: String, required: true },
        }
    ]
}, {
    versionKey: false,
})

export const loginHistoryModel: Model<LoginHistoryInterface> = mongoose.model('Login_History', loginHistorySchema)