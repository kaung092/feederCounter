angular.module('app.services', [])

.factory('APIService', function($http){
	var species = [];
	var chosenSpecies = [];
	var totalCount=0;
	return{
		getTotalCount: function(){
			return totalCount;
		},
		setTotalCount: function(num){
			totalCount = num;
		},
		getChosenSpecies: function(){
			return chosenSpecies;
		},
		addChosenSpecies: function(newItem){
			if(!chosenSpecies.includes(newItem)){
				//remove from species
				newItem.count = 0;
				chosenSpecies.push(newItem);
				return true;
			}
			return false;

		},
		emptyChosenSpecies: function(){
			chosenSpecies = [];
		},
		getSpecies: function(){
			return $http.get("http://52.70.188.192/BirdieWatch/species.php").then(function(response){
				species = response;
				return species;
			});
		},
		alreadyAdded: function(speciesName,$ionicPopup){
		   	var alertPopup = $ionicPopup.alert({
		    	title: 'Oops!',
		    	template: speciesName+' is already added'
		   	});
		},
		quitReport: function($ionicPopup,$state){
			var confirmPopup = $ionicPopup.confirm({
		    	title: 'Cancel Report',
		     	template: 'Are you sure you want to cancel this report?'
		   	});
		   	confirmPopup.then(function(res) {
		   		if(res){
		   			$state.go('menu.reportPage');
		   		}
		   	});
		},
		confirm: function($state,$ionicPopup,startTime,endTime,count){

			var confirmPopup = $ionicPopup.confirm({
		    	title: 'Confirm Submission',
		     	template: 'Do you want to submit this data?<br><br> Start Time: '+startTime+'<br> End Time: '+endTime+'<br>Total Count: '+count
		   	});
		   	confirmPopup.then(function(res) {
		   		if(res){
		   			var report = {};
		   			report.data = chosenSpecies;
		   			report.startTime = startTime;
		   			report.endTime = endTime;
		   			report.totalCount = count;
		   			report.label = "Report ("+startTime+" - "+endTime+"), Count: "+ count;
		   			chosenSpecies = [];
		   			$state.go('menu.reportPage',{params:report});
		   		}
		   	});
		}
	
	};
})

.service('utilService',[function(){

	return{
		getTime: function(){
			var date = new Date();
			date = date.toLocaleTimeString();
			var tmp = date.split(":");
			date = tmp[0]+":"+tmp[1]+" "+ tmp[2].split(" ")[1];
			return date;
		}
	};
}])

.service('AuthService',function($http,Session){
	return{
		login : function(credentials){
			return $http({
					withCredentials: false,
					url:'http://52.70.188.192/BirdieWatch/login.php',
					method:'POST',
					data: {'message':credentials},
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(res){
					Session.create(res.data.id, res.data.user.id);
					return res.data.user;
				});
		},
		isAuthenticated : function(){
			return !!Session.userId;
		},
		createAccount: function(userInfo){
			 return true;
		}
	};
})

//Singleton Session Object
.service('Session',function(){
	this.create = function(sessionId, userId){
		this.id = sessionId;
		this.userId = userId;
	};
	this.destroy = function(){
		this.id = null;
		this.userId = null;
	}
})

.service('reportService',[function(){
	var reports = {};
	var dateString = new Date().toDateString();
	reports[dateString] = [];

	return{
		addReport: function(chosenSpecies){
			reports[dateString].push(chosenSpecies);
		},
		getReports: function(){
			return reports;
		}
	};
}]);
