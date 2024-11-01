import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String},
    headling: {type: String},
    backgroundImage: { type: String},
    socialAccounts: [
        {
            accountType: String,
            handle: String
        }
    ],
    whatsapp: {type: String},
    email: {type: String},
    address: {type: String},
    services: [
        {
            name: String,
            description: String,
            price: Number,
            productImage: String
        }
    ]
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('User', UserSchema);
