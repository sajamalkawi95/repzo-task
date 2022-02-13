
const { userModel } = require("../Models/user.model");

const getAllUsers = async (req, res) => {
    try {
        userModel.find((err, user) => {
            if (user === null) {
                res.json([]);
            } else {
                res.json(user);
            }
        })
    }
    catch (err) {
        console.log('some thing wrong', err)
    }
}

module.exports = { getAllUsers }