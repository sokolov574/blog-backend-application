import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    text: {
        type: [String], // Теперь это массив строк
        required: true,
        unique: true,
    },
    tags: {
        type: [String], // Теперь это массив строк
        required: true,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
 }, {
    timestamps: true,
 });

 export default mongoose.model('Post', PostSchema);
