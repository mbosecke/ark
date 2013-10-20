(function(Ark){
	'use strict';
	
	Ark.register('second-module', 'first-module', function(sandbox, element) {
	
		var logger = sandbox.logger, 
			bus = sandbox.bus, 
			timesClicked = 0;
	
		return {
			init : function() {
				logger.log('info', 'Second module initialized.');
	
				//bus.listen('first-module-click', this.clickHandler, this);
				
				this._super('testLog');
			},
			events: {
				'first-module-click': function(event){
					this.clickHandler(event);
				}
			},
			clickHandler : function(data){
				timesClicked++;
				
				var $ele = $(element);
				var $header = $ele.find('h2');
				$header.text(timesClicked);
				
				logger.log('warn', 'This element now has the following text: ' + $ele.text());
				logger.log('info', 'Second module registered click from first module');
				
				if(timesClicked > 2){
					this.throwException();
				}
			},
			throwException: function(){
				throw new Error("too many clicks!");
			}
		};
	
	});
	
}(Ark));