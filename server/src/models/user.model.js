import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    budgets: {
        Food: { type: Number, default: 0 },
        Rent: { type: Number, default: 0 },
        Transport: { type: Number, default: 0 },
        Shopping: { type: Number, default: 0 },
        Bills: { type: Number, default: 0 },
        Other: { type: Number, default: 0 },
    },
});

const User = mongoose.model("User", userSchema);
export default User;