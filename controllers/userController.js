import User from "../models/User.js";

export const greetUser = async (req, res) => {
    res.send(`Welcome, ${req.user.name}!`);
};

export const getUserData = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Id is required' });
    }
    const id = req.params.id;

    try {
        const userObj = await User.findOne({ _id: id });

        if (!userObj) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAuthUser = async (req, res) => {
    res.status(200).json({
        user: req.user
    })
}
