(function(Ark){
	'use strict';
	
	Ark.register('first-module', function(sandbox, element){
			
		var logger = sandbox.logger,
			bus = sandbox.bus;
		
		return {
			init: function(){
				
				logger.log('info', 'First module initialized.');
				
				var $ele = $(element);
				var $header = $ele.find('h2');
				$header.text('First Module Initialized');
				
				$ele.on('click', function(event){
					logger.log('trace', 'First module clicked.');
					bus.notify('first-module-click', event);
				});
				
			},
			events: {
				
			},
			testLog: function(){
				logger.log('info', 'This is an inheritance test');
			}
		};
			
	});
	
}(Ark));