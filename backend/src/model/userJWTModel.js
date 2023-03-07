import mongoose, { Schema } from 'mongoose';

const userJwtSchema = new Schema({
    email: {type: String, required: true, unique: true},
    jwt: {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
});

export const UserJwt = mongoose.model('UserJwt', userJwtSchema);