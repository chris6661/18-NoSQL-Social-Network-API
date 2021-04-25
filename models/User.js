const {
    Schema,
    model
} = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Please enter a username!',
        trim: true, 
        minLength: 5
    },

    email: {
        type: String,
        unique: true,
        required: 'Please enter an email.',
        validate: {
            validator(validateEmail) {
              return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})(\.[a-z]{2,6})?$/.test(validateEmail);
            },
            message: "Please enter a valid email address",
          },
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
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length
});

const User = model('User', UserSchema);

// export the User model
module.exports = User;