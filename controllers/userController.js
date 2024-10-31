import User from "../models/User.js";

export const greetUser = async(req, res) => {
    res.send(`Welcome, ${req.user.username}!`);
};


export const getUserData = async (req, res) => {
    if (!req.params.username) {
        return res.status(400).json({ message: 'Username is required' }); 
    }
    const userName = req.params.username;

    try {
        const userObj = await User.findOne({ username: userName }); // Use the model

        if (!userObj) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userObj); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAuthUser = async(req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);  // Automatically populated by Passport
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
}
