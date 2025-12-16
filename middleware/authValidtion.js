const jwt = require("jsonwebtoken");

exports.authValidation = (req, res, next) => {
    try {
        const { token1 } = req.cookies;
        if (!token1) {
            return res.status(401).json({
                message: "Token is expired or not provided.",
                success: false,
            });
        }

        const decoded = jwt.verify(token1, process.env.JWT_SECRET2);
        const id = decoded._id
        req.id = id
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false,
        });
    }
};
