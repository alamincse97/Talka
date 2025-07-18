import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName: {
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
        minlength: 6,
    },
    bio: {
        type: String,
        default: '',
    },
    profilePic:{
        type: String,
        default: '',
    },
    nativeLanguage: {
        type: String,
        default: '',
    },
    learningLanguage: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {timestamps: true});

// pre hook
// john@gmail.com 12345678


// TODO: Explain this once again pre hook
userSchema.pre('save', async function(next) {

    if(!this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error);
    }
});

/** ✅ INSTANCE METHOD: Compare password */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/** ✅ DEFINE MODEL AFTER HOOKS AND METHODS */
const User = mongoose.model("User", userSchema);
export default User;    