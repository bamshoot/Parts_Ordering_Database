import asyncHandler from 'express-async-handler'
import generateToken from '../utilities/generateToken.js'
import User from '../models/userModel.js'



// @desc Auth the user and get a token
// @route POST /users/login
// @access Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne ({ email: email})

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(404)
        throw new Error('Invalid email or password')
    }
})

// @desc Register a new user
// @route POST /users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne ({ email: email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exits')
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password
    })

    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(404)
        throw new Error('Invalid user data')
    }
})

// @desc Get user profile
// @route GET /users/profile
// @access Private
const getUserProfile = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('Invalid email or password')
    }
})

export { authUser, registerUser, getUserProfile }