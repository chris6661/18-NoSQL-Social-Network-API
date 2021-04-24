const {
    Schema,
    model
} = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Please enter a username!'
    },
    email: {
        type: String,
        unique: true,
        required: 'Please enter an email.',
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// create User model using UserSchema
const User = model('User', UserSchema);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length
});

// export the User model
module.exports = User;