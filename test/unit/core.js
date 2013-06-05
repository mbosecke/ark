(function(){

	var testApplication, firstModule, secondModule;

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
			
			firstModule = document.getElementById('first-module');
			secondModule = document.getElementById('second-module');
		
		}, teardown: function(){
			testApplication = null;
		}
	}); 

	test("Ark initialization", function(){
		notEqual( testApplication, null, "testApplication is not null" );
		notEqual( testApplication.sandbox, null, "testApplication has a non-null sandbox" );
		notEqual( testApplication.sandbox.logger, null, "Sandbox has a logger property" );
		strictEqual( testApplication.sandbox.logger.getLevel(), 'error', 'logger level is set correctly');
	});
	
	test("Ark starting", function(){
		var header = firstModule.children[0];
		strictEqual("First Module", header.textContent, 'first module has correct text before initialization');
		testApplication.start();
		strictEqual("First Module Initialized", header.textContent, 'first module has correct text after initialization');
		
	});
	
}());