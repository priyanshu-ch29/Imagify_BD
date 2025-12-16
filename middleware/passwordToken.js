const jwt = require("jsonwebtoken");

exports.passwordToken = (req, res, next) => {
    try {
        const { token2 } = req.cookies;
        if (!token2) {
            return res.status(404).json({
                message: "Token is expired or not provided.",
                success: false,
            });
        }

        const decoded = jwt.verify(token2, process.env.JWT_SECRET1);
        const id = decoded._id
        req.id = id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false,
        });
    }
};
