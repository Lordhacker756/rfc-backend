import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    headline: { type: String },
    backgroundImage: { type: String },
    activeTheme: { type: String },
    validTill: { type: Date, required: true },
    role: { type: String, enum: ['admin', 'moderator', 'user'], required: true, default: 'user' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socialAccounts: [
        {
            accountType: String,
            profileUrl: String
        }
    ],
    whatsapp: { type: String },
    email: { type: String, required: true },
    address: { type: String },
    services: [
        {
            name: String,
            description: String,
            price: Number,
            productImage: String
        }
    ]
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('User', UserSchema);
