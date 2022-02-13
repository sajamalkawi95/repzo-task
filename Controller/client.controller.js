
const { clientModel } = require("../Models/client.model");

const getAllClients = async (req, res) => {
    try {
        clientModel.find((err, client) => {
            if (client === null) {
                res.json([]);
            } else {
                res.json(client);
            }
        })
    }
    catch (err) {
        console.log('some thing wrong', error)
    }
}

module.exports = { getAllClients }