const UserModel = require("../../Models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        // Find user by email
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: `${req.body.email} User not found` });
        }

        // Check if password matches
        const isPasswordMatched = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatched) {
            return res.status(404).json({ message: `Password not matched` });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                userName: user.userName
            },
            process.env.JWT_SECRET,
            { expiresIn: '20h' }
        );

        // Set the cookie with the token
        res.cookie('access_token', token, {
            maxAge: 50 * 60 * 60 * 1000,    // 50 hours
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        // Respond with success and the token
        return res.status(200).json({ message: `Login Successful`, token: token });

    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: error.message });
    }
};

module.exports = loginUser;
