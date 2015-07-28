var mysql 			= require( "mysql" )
,	NodeGeocoder	= require( "node-geocoder" )
,	geocoder 		= require('node-geocoder')('google')
,	geolib			= require('geolib')
,	_				= require('lodash')
,	CRUD 			= require('mysql-crud')
,	db 				= mysql.createPool( {
						"host": 'n2.transparent.sg',
						"user": 'transparent',
						"password": '10gXWOqeaf',
						"database": 'transparent'
					} )

, 	crudUnit 		= CRUD( db, 'tag_unit' )
, 	crudMRT			= CRUD( db, 'tag_mrt');

var mrt1 = {}, mrt2 = {};


module.exports = {
	"getUnits": function getUnits ( callback , param ){
		
		crudUnit.load({}, function ( err, val ){
			
			val.map ( function ( data ){
				if( data.longitude === '0' && data.latitude === '0' || data.areacode === '0'){

					geocoder.geocode ( data.address1 + ", " + data.country )

						.then ( function ( res ) {

							res.map ( function ( pin ) {

								crudUnit.update(
									{
										'unit_id': data.unit_id
									},
									{
										'latitude': pin.latitude,
										'longitude': pin.longitude,
										'areacode': pin.zipcode

									}, function ( err, vals ){

										console.log( "Successfully Updated" );
									
									});

							});

						})

						.catch( function ( err ){
							function TimeoutHandler()
							{
							  clearTimeout(id);
							}

							var id;
							id = setTimeout(TimeoutHandler, 2000);
							
						});		

					

				}else{

				}
			});
			
		});

	},

	"getMRTs": function getMRTs ( callback, param ){

		var mrt1 = {};
		var mrt2 = {};

		crudMRT.load({}, function ( err, val ){
			
			val.map ( function ( data ){

				if( data.longitude === '0' && data.latitude === '0' ){

					var mrt = data.mrt_name;
					var res = [];
					var newMRT = "";

					res = mrt.split (' ');

					res.map ( function ( data ){

						if( data != "Station"){
							newMRT += data + " ";
						}
						
					});

						geocoder.geocode ( newMRT + ", Singapore" )

						.then ( function ( res ) {

							res.map ( function ( pin ) {
								
								crudMRT.update(
									{
										'mrt_id': data.mrt_id
									},
									{
										'latitude': pin.latitude,
										'longitude': pin.longitude

									}, function ( err, vals ){

										console.log( "Successfully Updated" );
									
									});



							});

						})


						.catch( function ( err ){
							function TimeoutHandler()
							{
							  clearTimeout(id);
						
							}

							var id;
							id = setTimeout(TimeoutHandler, 2000);
						
						});		

				}else{

				}
			});
			
		});

	},

	"getMRTDistance": function getMRTDistance ( callback , param ){
		

		crudUnit.load({}, function ( err, val ){
			
			val.map ( function ( data ){

				if( data.MRT1 != '0' && data.MRT2 != '0' ){


					geocoder.geocode ( data.MRT1 + ", Singapore" )

						.then ( function ( res ) {

							res.map ( function ( pin ) {
							
								mrt1 = {
									latitude: pin.latitude,
									longitude: pin.longitude
								};


							});

							geocoder.geocode ( data.MRT2 + ", Singapore" )

								.then ( function ( res ) {

									res.map ( function ( pin ) {
									
										mrt2 = {
											latitude: pin.latitude,
											longitude: pin.longitude
										};

									});

									var result = geolib.getDistance( mrt1, mrt2 ) * 0.001;
									

										var query = "UPDATE tag_unit SET MRT_distance_km = '"+ result +"' WHERE unit_id = '"+ data.unit_id +"' ";
										db.query ( query , function ( err, rows , fields ){
											//console.log( "Successfully Updated" );
										});

								})


								.catch( function ( err ){
									function TimeoutHandler()
									{
									  clearTimeout(id);
								
									}

									var id;
									id = setTimeout(TimeoutHandler, 2000);
								
								});		

						})


						.catch( function ( err ){
							function TimeoutHandler()
							{
							  clearTimeout(id);
						
							}

							var id;
							id = setTimeout(TimeoutHandler, 2000);
						
						});	





				}

			});
		});
	},


	"getNearestMRT": function getNearestMRT ( callback , param ){

		getAllUnits();

	},

	"sample": function sample ( callback , param ){

		var array = [0.210,2.211,2.33,1.01,1.41,5.90,0.10,1.81].sort();
		var top3 = array.slice(0,3);
		console.log( array );
		console.log( top3 );
	}


};


function getAllUnits (){

	crudUnit.load({}, function ( err, val ){

		val.map ( function ( data ){
			
			getNearestMRTs( data );
		
		});

	});

}

function getNearestMRTs( units ){
	
	var nearest;
	var arrResult = [];
	var newResult = [];

	crudMRT.load({}, function ( err, val ){

		val.map ( function ( data ){

			var result = geolib.getDistance( {
												latitude: units.latitude,
												longitude: units. longitude
											}, {
												latitude: data.latitude,
												longitude: data.longitude
											} ) * 0.001;
			
			arrResult.push( {
				MRT_Name: data.mrt_name,
				nearest: result
			} );	
		
		});

		_.map(_.sortByOrder( arrResult , ['nearest'], ['asc']), 
			function ( values ){
				newResult.push( values );
				
			});
			var unique = _.uniq(newResult, 'MRT_Name');
			
			console.log( units.unit_id );
			crudUnit.update(
			{
				'unit_id': units.unit_id
			},
			{
				'MRT1': unique[0].MRT_Name,
				'MRT2': unique[1].MRT_Name,
				'MRT3': unique[2].MRT_Name,
				
			}, function ( err, vals ){

				console.log( "Successfully Updated" );
			
			});

		
		
	});
}

