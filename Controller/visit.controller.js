const Redis = require("redis");
let redisClient;

(async () => {
    redisClient = Redis.createClient({ socket: { port: 6379 } });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.connect();
    redisClient.on('connect', () => {
        console.log('connected');
    });
})();
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
/**
* =======================
* fill visitors array
* =======================
*/
const visits = (users) => {
    UserVisits.visitors = [];
    for (let i = 0; i < users.length; i++) {
        new UserVisits(users[i]._id);
    }
}

/**
* =======================
* return the visits in the date rang  and set it in cache
* =======================
*/

const getVisitors = (req, res) => {
    const { from, to, day } = req.query;
    const key = `${from}-${to}-${day}`;

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
                    console.log("fetch data");
                    visits(users)
                    getLessVisitors(users, filteredVisitors)
                    UserVisits.visitors.sort((a, b) => (a.count > b.count ? 1 : -1))
                    redisClient.setEx(key, 3600, JSON.stringify(UserVisits.visitors))
                    res.json(UserVisits.visitors);
                }
            })
        }
    })
}

/**
* =======================
* get data from cache if exist
* =======================
*/
const cache = async (req, res, next) => {
    const { from, to, day } = req.query;
    const key = `${from}-${to}-${day}`;
    console.log("cache");
    let data = await redisClient.get(key);
    if (data !== null) {
        console.log("log in cache ...");
        res.send(data)
    } else {
        console.log(" no data in cache ... ");
        next()
    }
}


/**
* =======================
* filleter Visits in rang time
* =======================
*/

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

module.exports = { getAllVisitors, cache, getVisitors }