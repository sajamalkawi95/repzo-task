
const { visitModel } = require("../Models/visit.model");
const { userModel } = require("../Models/user.model");
class UserVisits {
    constructor(id, count = 0) {

        this.id = id;
        this.count = count;
        UserVisits.visitors.push(this);
    }
}
UserVisits.visitors = [];

const visits = (users) => {
    UserVisits.visitors = [];
    for (let i = 0; i < users.length; i++) {
        new UserVisits(users[i]._id);
    }
}

const getVisitors = (req, res) => {
    const { from, to, day } = req.query;
    visitModel.find((err, visitor) => {
        if (visitor === null) {
            res.json([]);
        }
        else {
            let filteredVisitors = filterVisitors(visitor, from, to, day)
            userModel.find((err, users) => {
                if (users === null) {
                    res.json([]);
                } else {
                    visits(users)
                    getLessVisitors(users, filteredVisitors)
                    UserVisits.visitors.sort((a, b) => (a.count > b.count ? 1 : -1))
                    res.json(UserVisits.visitors);
                }
            })
        }
    })
}
const filterVisitors = (visitor, from, to, day) => {
    var options = { weekday: 'long' };
    return visitor.filter(v => v.time >= from && v.time <= to)
        .filter(fv => new Date(fv.time).toLocaleDateString('en-US', options).toLowerCase() === day.toLowerCase())
}
const getLessVisitors = (users, filteredVisitors) => {
    users.forEach((user, index) => {
        filteredVisitors.forEach(vis => {
            if (vis.user == user._id) {
                UserVisits.visitors[index].count++;
            }
        });
    })
}
const getAllVisitors = async (req, res) => {
    try {
        visitModel.find((err, visitor) => {
            if (visitor === null) {
                res.json([]);
            } else {
                res.json(visitor);
            }
        })
    }
    catch (err) {
        console.log('some thing wrong', error)
    }
}

module.exports = { getAllVisitors, getVisitors }