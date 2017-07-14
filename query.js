var app = angular.module('search',[]);


app.controller('displayContent',function($scope, $http){

  $scope.keyword = '';
  $scope.result = 'Hi';
  $scope.showResults = 'hide';
  $scope.ranking = "lucene";
  $scope.snippet = '';

  $scope.init = function(){
    $http({
        method: 'GET',
        responseType: 'json',
        url: 'http://localhost:3000/getmap',
        }).then(function successCall(response){
                $scope.fileMap = new Map(response.data);
                });
  }

  $scope.getResults = function(){
    //$scope.qry = $scope.keyword;
    $scope.showResults = 'show';


    $http({
      method: 'GET',
      url: 'http://localhost/IR-HW4/Test.php',
      params: {qry : $scope.keyword}
    }).then(function success(response){
      // alert(response.data);
      $scope.qry = response.data;
      $http({
          method: 'GET',
          responseType: 'json',
          url: 'http://localhost:3000/query',
          params: {q : response.data, sort : $scope.ranking }
          }).then(function successCall(response){
                  $scope.result = response.data.docs;
                  });

    });

  }

  $scope.getUrl = function(uid){
    var urlId = uid.substring(uid.lastIndexOf('/')+1);
  
    var snip = $scope.getSnip(urlId, $scope.keyword).then(function(data){
      //console.log(data);
        //return data;
    });
    console.log(snip.$$state.value);
    return [$scope.fileMap.get(urlId), snip.$$state.value];
  }

  $scope.getSnip = function(id, qry){
    return $http({
        method: 'GET',
        url: 'http://localhost/IR-HW4/Test.php',
        params: {id : id, qry : qry}
        }).then(function successCall(response){
                return response.data;
                });
  }




});
