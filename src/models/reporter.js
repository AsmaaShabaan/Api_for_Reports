
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        timestamps: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value, ["ar-EG"])) {
                throw new Error('Phone Number not Egyption')
            }
        }
    },

    tokens: [
        {
            type: String,
            required: true
        },

    ],
    news: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'News'
    }]
},

    {
        timestamps: { currentTime: () => Math.floor(new Date().setHours(new Date().getHours() + 2)) },
    })

reporterSchema.virtual('Reporter', {
    ref: 'News',
    localField: '_id',
    foreignField: 'reporter'
})










reporterSchema.pre('save', async function (next) {
    const reporter = this
    if (reporter.isModified('password')) { reporter.password = await bcrypt.hash(reporter.password, 8) }

})

// login 
reporterSchema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({ email })
    if (!reporter) {
        throw new Error('Unable to login..please check email')
    }
    const isMatch = await bcrypt.compare(password, reporter.password)
    if (!isMatch) {
        throw new Error('Unable to login.. please check password')
    }

    return reporter
}


reporterSchema.methods.generateToken = async function () {
    const reporter = this
    const token = jwt.sign({ _id: reporter._id.toString() }, 'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}


const Reporter = mongoose.model('Reporter', reporterSchema)

module.exports = Reporter