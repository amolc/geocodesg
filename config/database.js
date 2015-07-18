var mysql 			= require( "mysql" )
,	NodeGeocoder	= require( "node-geocoder" )
,	geocoder 		= require('node-geocoder')('google')
,	CRUD 			= require('mysql-crud')
,	db 				= mysql.createPool( {
						"host": 'n2.transparent.sg',
						"user": 'transparent',
						"password": '10gXWOqeaf',
						"database": 'transparent'
					} )

, crudUnit 			= CRUD( db, 'tag_unit' )
, crudMRT			= CRUD( db, 'tag_mrt');



module.exports = {
	"getUnits": function getUnits ( callback , param ){
		
		crudUnit.load({}, function ( err, val ){
			
			val.map ( function ( data ){
				if( data.longitude === '0' && data.latitude === '0' ){

					geocoder.geocode ( data.address1 + ", " + data.country )

						.then ( function ( res ) {

							res.map ( function ( pin ) {
								
								crudUnit.update(
									{
										'unit_id': data.unit_id
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
							  console.log ('CLEAR');
							}

							var id;
							id = setTimeout(TimeoutHandler, 2000);
							console.log ('SET');
						});		

					

				}else{

				}
			});
			
		});

	},

	"getMRTs": function getMRTs ( callback, param ){

		crudMRT.load({}, function ( err, val ){
			
			val.map ( function ( data ){

				if( data.longitude === '0' && data.latitude === '0' ){

						geocoder.geocode ( data.mrt_name + ", Singapore" )

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
							  console.log ('CLEAR');
							}

							var id;
							id = setTimeout(TimeoutHandler, 2000);
							console.log ('SET');
						});		

				}else{

				}
			});
			
		});

	}

};
