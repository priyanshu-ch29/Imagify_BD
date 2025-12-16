const User = require("../model/userMode")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: "user already exist",
                success: false
            })
        }

        var salt = bcrypt.genSaltSync(12);
        const hashpassword = await bcrypt.hashSync(password, salt);
        const newUser = await User.create({ name, email, password: hashpassword });
        await newUser.save();

        return res.status(200).json({
            message: "Account Created Successfully",
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: "Intern server error",
            success: false
        })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "email / password is not valid",
                success: false
            })
        }

        const passwordCheck = await bcrypt.compareSync(password, user.password);

        if (!passwordCheck) {
            return res.status(401).json({
                message: "email / password is not valid",
                success: false
            })
        }

        const token = await jwt.sign({ _id: user?._id }, process.env.JWT_SECRET2, {
            expiresIn: "1d"
        })

        return res.status(200).cookie("token1", token).json({
            message: "logged in successfully",
            success: true,
            user,
        })

    } catch (error) {
        return res.status(500).json({
            message: error,
            success: false
        })
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(0),
        });

        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const getOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendEmail = async (userEmail, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "OTP for Reset Password",
            text
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email ID",
            });
        }

        const myOTP = getOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.otp = myOTP;
        user.otpExpires = otpExpiry;
        await user.save();

        await sendEmail(user.email, `Your OTP is: ${myOTP}`);
        const token = await jwt.sign({ _id: user?._id, email: user.email }, process.env.JWT_SECRET1, {
            expiresIn: "15m"
        })
        return res.status(200).cookie("token2", token, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            httpOnly: true,        
            secure: process.env.NODE_ENV === "production", 
            sameSite: "None",
        }).json({
            success: true,
            message: 'OTP sent to your email',
        });
    } catch (error) {
        console.error('Error in sendOTP:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending the OTP. Please try again later.',
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const id = req.id;
        const { otp } = req.body;
        const user = await User.findById({ _id: id });

        if (user.otp !== Number(otp)) {
            return res.status(400).json({
                message: "Otp is not valid",
                success: false
            })
        }

        user.otp = undefined
        user.otpExpires = undefined
        await user.save();

        return res.status(200).json({ message: "otp verified successful", success: true })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.',
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        const id = req.id

        if (!id || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "User ID and new password are required",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        res.cookie("token2", null, {
            expires: new Date(0),
        });

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while resetting the password",
        });
    }
}
module.exports = { RegisterUser, Login, logout, sendOTP, verifyOtp, resetPassword }