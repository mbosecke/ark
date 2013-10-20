(function(){

	var testApplication, $firstModule, $secondModule;

	module("bus", {
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

	test('Simple message passing', function(){
		
		testApplication.start();
		
		var $secondModuleHeader = $secondModule.find('h2');
		strictEqual($secondModuleHeader.text(),'Second Module', 'second module has correct text before event clicking');
		
		$firstModule.click();
		strictEqual($secondModuleHeader.text(), '1', 'second module has correct text after first event');
		
		$firstModule.click();
		strictEqual($secondModuleHeader.text(), '2', 'second module has correct text after second event');
	});
	
}());