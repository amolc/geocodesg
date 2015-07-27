var mysql 			= require( "mysql" )
,	NodeGeocoder	= require( "node-geocoder" )
,	geocoder 		= require('node-geocoder')('google')
,	geolib			= require('geolib')
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
											console.log( rows );
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


	crudMRT.load({}, function ( err, val ){

		val.map ( function ( data ){

		
		var result = geolib.getDistance( {
											latitude: units.latitude,
											longitude: units. longitude
										}, {
											latitude: data.latitude,
											longitude: data.longitude
										} ) * 0.001;

		data.nearest = result;
		data.unit_id = units.unit_id;
		arrResult.push( result );		
		
		});

		nearest = Math.min.apply( Math , arrResult );
		
		val.map ( function ( data ){

		if( data.MRT1 != '0' && data.MRT2 != '0' ){

			if( nearest == data.nearest ){
				
				crudUnit.update(
					{
						'unit_id': data.unit_id
					},
					{
						'MRT1': data.mrt_name
						
					}, function ( err, vals ){

						console.log( "Successfully Updated" );
					
					});


			}
		}

		});
		
		
	});
}

