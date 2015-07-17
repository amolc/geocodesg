var fs = require( "fs" );

module.exports = {
	"set": function setRoute ( server , __dirname ) {
		fs.readdir( __dirname + "/routes" , 
			function ( err , routes ) {
				routes.map( function ( route ) {
					var routeModule = require( "../routes/" + route );

					for( var action in routeModule ) {
						server[ routeModule[ action ].method.toLowerCase( ) ]( action , routeModule[ action ].controller );
					}
				} );
			} );
	}
};