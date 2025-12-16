const User = require("../model/userMode");

exports.getPlan = async (req, res) => {
    try {
        const id = req.id
        const planValue = req.body.planValue;
        console.log(planValue)
        const user = await User.findById({ _id: id });

        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (planValue === "Free") {
            user.plans = planValue
            user.credits = 5
        }

        await user.save();
        return res.status(200).json({
            message: "Plan Purchase Successful",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}