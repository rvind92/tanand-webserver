(function() {
    
    var FloorplanController = function($scope, firebaseFactory) {

    	$scope.loadFile = function ($input) {
            if ($input.files && $input.files[0]) {
                var reader = new FileReader();

                console.log(reader);

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result)
                        .width(300)
                        .height(180);
                };

                reader.readAsDataURL($input.files[0]);
            }
        };
        
        $scope.reset = function(){
            document.getElementById('blah').src = "";
        };

    }

    FloorplanController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('FloorplanController', FloorplanController);
    
}());