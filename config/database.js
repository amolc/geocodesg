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

, geoCrud 			= CRUD( db, 'tag_unit' );


module.exports = {
	"getUnits": function getUnits ( callback , param ){
		
		
		geoCrud.load({}, function ( err, val ){
			
			val.map ( function ( data ){
				if( data.longitude === '0' && data.latitude === '0' ){

					geocoder.geocode ( data.address1 + ", " + data.country )

						.then ( function ( res ) {

							res.map ( function ( pin ) {
								
								geoCrud.update(
									{
										'unit_id': data.unit_id
									},
									{
										'latitude': pin.latitude,
										'longitude': pin.longitude

									}, function ( err, vals ){

										console.log( vals );
									
									});

							});

						})

						.catch( function ( err ){
							console.log( err );
						});		

					

				}else{

				}
			});
			
		});

	}

};
