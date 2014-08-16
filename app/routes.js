var Supp = require('./models/supp');

module.exports = function(app) {

    app.get('/api/supps', function(req, res) {
        //use mongoose : find all nerds in db
        Supp.find(function(err, supps) {
            if (err)
                res.send(err);

            res.json(supps);

        });
    });

//    .post(function(req, res) {
//		
//		var bear = new Bear(); 		// create a new instance of the Bear model
//		bear.name = req.body.name;  // set the bears name (comes from the request)
//
//		// save the bear and check for errors
//		bear.save(function(err) {
//			if (err)
//				res.send(err);
//
//			res.json({ message: 'Bear created!' });
//		});
//		
//	});
    app.post('/api/supps', function(req, res) {
        var supp = new Supp();
//        var supp_data = {
//            name: req.params.name,
//            description: req.params.description,
//            dosage: req.params.dosage,
//            benefits: req.params.benefits
//        };

        var supp_data = {
            name: "test",
            description: "test description",
            dosage: "test dosage",
            benefits: []
        };

        supp.name = supp_data.name;
        supp.description = supp_data.description;
        supp.dosage = supp_data.dosage;
        supp.benefits = supp_data.benefits;
        console.log("api post requested");

//        var supp = new Supp(supp_data);
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
        //use mongoose : find all nerds in db
//        Supp.save(function(err, nerds) {
//            if (err)
//                res.send(err);
//
//            res.json(supps);
//
//        });
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
