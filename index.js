var express 		= require( "express" )
,	parser 			= require( "body-parser" )
,	orm 			= require( "./config/database" )
,	app 			= express( )
,	http 			= require('http').Server(app);


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


orm.getUnits();
orm.getMRTs();
orm.getMRTDistance();
orm.getNearestMRT();

app.listen( 9000, function (){
	console.log("listening to port 9000");	
});



