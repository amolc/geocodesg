var express 		= require( "express" )
,	parser 			= require( "body-parser" )
,	route 			= require( "./config/route" )
,	orm 			= require( "./config/database" )
,	NodeGeocoder	= require( "node-geocoder" )
,	geocoder 		= require('node-geocoder')('google')
,	app 			= express( )
,	http 			= require('http').Server(app);


global[ "DB" ] 		= orm;

var cors = function cors ( request , response , next ) {	
	response.header( "Access-Control-Allow-Origin" , "*" );
	response.header( "Access-Control-Allow-Methods" , "GET, POST, DELETE" );
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	response.header( "Access-Control-Allow-Headers" , "Content-Type" );

	next( );
};


app.use( parser.json( ) );
app.use( parser.urlencoded( { "extended": false } ) );
app.use( cors );
app.use('/', express.static( __dirname + '/web' ));

route.set( app , __dirname );


app.listen( 9000, function (){
	console.log("listening to port 9000");	
});



