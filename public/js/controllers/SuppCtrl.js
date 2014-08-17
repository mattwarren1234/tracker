angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.tagline = 'view supplements here!';
        $scope.itemToEdit = {};
        $scope.selected = {};

        Supps.get()
            .success(function(data) {
                console.log("got from server!");
                $scope.supps = data;
                if ($scope.supps.length === 0)
                {
//                    $scope.showInitial();
                }
            })
            .error(function(data) {
                console.log("failed, yo!" + data);
            });

        $scope.showInitialEmptyItem = false;
        $scope.initSupp = {
            name: "Click to set title",
            description: "",
            dosage: "",
            benefits: []
        };
        $scope.showInitial = function() {
            $scope.showInitialEmptyItem = true;
        };
        $scope.delete = function(item) {
            if (!confirm("Are you sure you want to delete this item?"))
                return;
            Supps.delete(item)
                .success(function(data) {
                    alert(data);
                    $scope.supps = data;
                });
        };
        $scope.reverseName = function() {
            console.log("name reversed!");
        };
        $scope.addSupp = function() {
              $scope.showInitial();
              $scope.itemToEdit = $scope.initSupp;
//            Supps.create($scope.newSupp)
//                .success(function(data) {
//                    $scope.supps = data;
//                })
//                .error(function(data) {
//                    console.log("errah brah!" + data);
//                });
        };

        $scope.message = "";
        $scope.update = function(item) {
            console.log("update called!");
            Supps.update(item)
                .success(function(data) {
                    console.log(data);
                    //not doing anything with data, b/c it should already match client side!
                    $scope.setEdit({});
                    $scope.message = "Item updated!";
                    setTimeout(function() {
                        $scope.message = "";
                        $scope.$apply();
                    }, 2500);
                })
                .error(function(data) {
                    console.log(data);
                });
        };
    })
    .directive("suppEditable",
        function() {
            return{
                templateUrl: '/public/views/editable.html',
                controller: function($scope) {
                    $scope.newBenefit = {};

                    $scope.titleEditMode = false;
                    $scope.toggleTitleEdit = function() {
                        $scope.titleEditMode = !$scope.titleEditMode;
                    };
                    $scope.saveTitle = function() {
                        $scope.titleEditMode = false;
                    };
                    $scope.addBenefit = function() {
                        if (!$.isEmptyObject($scope.newBenefit)) {
                            $scope.supp.benefits.push($scope.newBenefit);
                            $scope.newBenefit = {};
                        }
                    };
                    $scope.setEdit = function(item) {
                        if (item === $scope.itemToEdit)
                            return;
                        $scope.itemToEdit = item;
//                        $scope.selected = $scope.itemToEdit;
                        $scope.titleEditMode = false;
                    };
                },
                scope: {
                    supp: '=supp',
                    update: "&",
                    delete: "&",
                    itemToEdit: "=",
//                    selected: "=",
                },
//                transclude: true
            };
        });
