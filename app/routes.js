var Supp = require('./models/supp');
var JournalEntry = require('./models/journal');
module.exports = function(app, router) {
    app.get('/api/supps', function(req, res) {
        //use mongoose : find all nerds in db
        Supp.find(function(err, supps) {
            if (err)
                res.send(err);
            res.json(supps);
        });
    });
    app.get('/api/journal/', function(req, res) {
        var currentDate = new Date(parseInt(req.query.date));
        var formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var tomorrow = new Date(formattedDate);
        tomorrow.setDate(formattedDate.getDate() + 1);
        tomorrow.setHours(0);
        var userId = req.query.userId || -1;
        JournalEntry.find(
            {date: {$gte: formattedDate, $lt: tomorrow},
                userId: userId},
        function(err, results) {
            if (err)
                res.json(err);
            res.send(results);
            console.log(results);
        });
    });
    app.post('/api/journal/', function(req, res) {
        var currentDate = req.body.date;
        var userId = req.body.userId || 0;
        var benefit = req.body.benefit;
        console.log('user id is ' + userId);
        var query = {
            date: currentDate,
            benefitId: benefit.id,
            userId: userId,
        };
        var error = {};
        console.log("updating now!");
        JournalEntry.update(query, {"$set": {score: benefit.score}}, {upsert: true},
        function(err, numAffected) {
            console.log(err);
            console.log("Number affected:");
            console.log(numAffected);
            error = err;
        });
        if (error !== {}) {
            res.send(error);
        }
    });
    app.get('/api/records/all', function(req, res) {
        JournalEntry.aggregate(
            [
                {$match: {userId: 2}},
                {$group: {
                        _id: "$benefitId",
                        score: {$avg: "$score"}
                    }
                },
                {$project: {score: 1,
                        _id: 0,
                        "benefitId": "$_id"}}
            ],
            function(err, results) {
                if (err)
                    res.send(err);
                console.log("success");
                res.json(results); // [ { maxBalance: 98000 } ]
            });
    });
    app.get('/api/records/overTime', function(req, res) {
        var userId = parseInt(req.query.userId, 10);
        var suppId = req.query.suppId;
        JournalEntry.aggregate(
            [
                {$match: {userId: userId}},
                {$sort: {date: 1}},
                {$group: {
                        _id: "$benefitId",
                        scores: {$push:
                                {score: "$score",
                                    date: "$date"}}
                    }
                },
            ],
            function(err, results) {
                if (err)
                {
                    res.send(err);
                }
                res.json(results);
            });
    });
    app.delete('/api/supps/:supp_id', function(req, res) {
        Supp.remove({
            _id: req.params.supp_id
        }, function(err, supp) {
            if (err)
                res.send(err);
            res.json(supp);
        });
    });
    app.post('/api/supps/:supp_id', function(req, res) {
        var supp_data = {
            name: req.body.name,
            description: req.body.description,
            dosage: req.body.dosage,
            benefits: req.body.benefits
        };
        var id = req.params.supp_id;
        Supp.findByIdAndUpdate(id, {$set: supp_data}, function(err, supp) {
            if (err)
                res.send(err);
            res.json(supp);
        });
    });
    app.post('/api/supps', function(req, res) {
        var supp = new Supp();
        var supp_data = {
            name: req.body.name,
            description: req.body.description,
            dosage: req.body.dosage,
            benefits: req.body.benefits
        };
        supp.name = supp_data.name;
        supp.description = supp_data.description;
        supp.dosage = supp_data.dosage;
        supp.benefits = supp_data.benefits;
        try {
            supp.save(function(err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } catch (err) {
            console.log(err);
        }

    });
    app.get("/public/views/editable.html", function(req, res) {
        res.sendfile('./public/views/editable.html');
    });
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });
};
