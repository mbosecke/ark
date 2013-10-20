(function(){

	var testApplication, $firstModule, $secondModule;

	module("core", {
		setup: function(){
			testApplication = new Ark({
				logger: {
					level: 'error'
				},
				error: {
				},
				debug: true
			});
			
			$firstModule = $('#first-module');
			$secondModule = $('#second-module');
		
		}, teardown: function(){
			testApplication.stop();
		}
	}); 

	test("Ark initialization", function(){
		notEqual( testApplication, null, "testApplication is not null" );
		notEqual( testApplication.sandbox, null, "testApplication has a non-null sandbox" );
		notEqual( testApplication.sandbox.logger, null, "Sandbox has a logger property" );
		strictEqual( testApplication.sandbox.logger.getLevel(), 'error', 'logger level is set correctly');
	});
	
	test("Ark starting", function(){
		var $header = $firstModule.find('h2');
		strictEqual("First Module", $header.text() , 'first module has correct text before initialization');
		testApplication.start();
		strictEqual("First Module Initialized", $header.text(), 'first module has correct text after initialization');
		
	});
	
}());