var Supp = require('./models/supp');

module.exports = function(app, router) {
    app.get('/api/supps', function(req, res) {
        //use mongoose : find all nerds in db
        Supp.find(function(err, supps) {
            if (err)
                res.send(err);
            res.json(supps);

        });
    });

//    var sameDay = function(date1, date2) {
//        try {
//            return (date1.getFullYear() === date2.getFullYear()
//                && date1.getDate() === date2.getDate()
//                && date1.getMonth() === date2.getMonth());
//        } catch (err) {
//            console.log(err);
//        }
//
//    }

    app.get('/api/journal/:journalDate', function(req, res) {
        //get from db using new Date(req.params.journalDate)
        var fakeResponse =
            [{"name": "supp1",
                    "benefits": [
                        {"name": "benefit1",
                            "score": 0.3
                        },
                        {"name": "benefit2",
                            "score": 0.4}
                    ]},
                {"name": "supp2",
                    "benefits": [
                        {"name": "does stuff",
                            "score": 1
                        },
                        {"name": "does other stuff",
                            "score": 0.9}
                    ]}];

        res.send(fakeResponse);

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
                return handleError(err);
            res.send(supp);
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
