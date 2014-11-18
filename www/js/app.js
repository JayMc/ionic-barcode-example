var app = angular.module('app', ['ionic', 'ngCordova', 'firebase']);

app.controller('barcodesCtrl', ['$scope', '$firebase', '$cordovaBarcodeScanner', '$ionicSideMenuDelegate', function($scope, $firebase, $cordovaBarcodeScanner, $ionicSideMenuDelegate){

  var ref = new Firebase("http://firebaseio.com/xyz");
  var sync = $firebase(ref);
  $scope.barcodes = sync.$asArray();

  $scope.barcode = '';

  // scanning
  $scope.scan = function(){
        $cordovaBarcodeScanner
        .scan()
        .then(function(imageData) {
          // Success! Barcode data is here
          //$scope.barcode = imageData.text;
          //$scope.barcodes.$add(imageData);
          $scope.save(imageData);
        }, function(error) {
          // An error occurred
          $scope.barcode = 'error';
        });
  }

  $scope.scantest = function(){
    //$scope.barcodes.$add({text: 't2'});
    $scope.save({text: 'test',type: 'a'});
  }

  /**
   * Given a barcode first checks if barcode exists in barcodes.
   * If it exists then increment scans and set date
   * If not exist then add to barcode with date and barcode info
   * @param  {[type]} barcode return from Cordova barcode scanner
   * @return {[type]}         [description]
   */
  $scope.save = function(barcode){
    var d = new Date();

    //prevent barcodes without text
    if(barcode.text == ''){
      return;
    }

    //check if barcode text is already scanned
    var found = $scope.findBarcode(barcode.text);

    //console.log(found);
    if(found != false){
      //update it
      found.scans = found.scans + 1;
      //found.lastScan = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
      found.lastScan = d.valueOf();
      $scope.barcodes.$save(found);

    }else{
      //create it
      $scope.barcodes.$add(
        {
          text: barcode.text,
          format: barcode.format,
          cancelled: barcode.cancelled,
          //lastScan: d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds(),
          lastScan: d.valueOf(),
          scans: 1
        });
      
    }

  }

  /**
   * Given barcode text checks if barcode is already inside barcodes
   * @param  {String} barcodeString what the barcode text is
   * @return {mixed}               If not found returns false, if found returns the barcode.
   */
  $scope.findBarcode = function(barcodeString){

    var found = false;
    if($scope.barcodes.length == 0){
      return false;
    }
    angular.forEach($scope.barcodes, function(b){
      console.log(barcodeString);
      console.log(b.text);
      if(barcodeString == b.text){
        found = b;
      }
    });
    return found;
  }

  /**
   * Given barcode, deletes it
   * @param  {array element} b barcode array element
   */
  $scope.delete = function(b){
    $scope.barcodes.$remove(b);
  }

  $scope.saveBarcode = function(b){
    $scope.barcodes.$save(b);
  }

  $scope.toggleMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  }

}])


//extend 
//https://www.firebase.com/docs/web/libraries/angular/guide.html
/*app.factory('barcodes', ['$FirebaseArray', '$firebase', function($FirebaseArray, $firebase){
  var extraFactory = $FirebaseArray.#extendFactory({
    expand
  })
  
}])
*/