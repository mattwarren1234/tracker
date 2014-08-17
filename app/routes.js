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
//route to handle creating (app.post)
    //route to handle delete (app.delete)

    app.get("/public/views/editable.html", function(req, res) {
        res.sendfile('./public/views/editable.html');
    });
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });

};
