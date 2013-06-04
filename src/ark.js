(function(window){

	var userExtensions = [],
		coreExtensions = [],
		userModules = {};
	
	/**
	 * Ark constructor
	 * 
	 * @param userConfig object
	 */
	function Ark(userConfig) {
		'use strict';

		this.sandbox = {}; 
		this.config = this._defaultConfig;
		
		/* 
		 * Shallow merge of user settings with default settings.
		 * Perhaps this should be improved to a deep merge.
		 */ 
		for(var attr in userConfig){
			if(userConfig.hasOwnProperty(attr)){
				this.config[attr] = userConfig[attr];
			}
		}
		
		// init core extensions right away because the main library relies on some of them
		for (var i = 0; i < coreExtensions.length; i++) {
			var coreExtension = coreExtensions[i];
			this._initExtension(coreExtension, this.config[coreExtension.name]);
		}
		
		this._log('Ark constructed');
	}
	
	Ark._coreExtend = function(name, factory){
		coreExtensions.push({
			name: name,
			factory: factory
		});
	};
	
	/**
	 * Registers an extension.
	 * 
	 * @param extension		The extension object
	 */
	Ark.extend = function(name, factory) {
		'use strict';
	
		userExtensions.push({
			name: name,
			factory: factory
		});
	};
	
	

	/**
	 * Registers a module.
	 */
	Ark.register = function(name, base, factory){
		'use strict';
		
		if(arguments.length === 2){
			factory = base;
			base = null;
		}

		userModules[name] = {
			base: base,
			factory: factory
		};
	};
	
	

	/**
	 * Ark version number
	 */
	Ark.prototype.version = '0.0.1';

	/**
	 * The start function will bootstrap the extensions and modules.
	 */
	Ark.prototype.start = function(){
		'use strict';
		
		this._log('Starting Ark...');
		
		if(this.started){
			this._error('Ark is already started.');
		}else{
			// init user extensions
			this._log('Initializing user extensions...');
			for(var i = 0; i < userExtensions.length; i++){
				var extension = userExtensions[i];
				this._initExtension(userExtensions[i]);
			}
			this._log('User extensions initialized.');
			
			// sanitize sandbox to handle errors
			this.sandbox.error.sanitize(this.sandbox);
			
			
			// init user modules
			this._log('Initializing user modules...');
			this.scan(this.config.container);
			this._log('User modules initialized.');
			
			this._log('Ark started.');
			this.started = true;
		}
	};



	/**
	 * Scans for module instances in the arks container
	 * 
	 */
	Ark.prototype.scan = function(containerElement) {
		'use strict';
		var i, 
			element, 
			moduleId, 
			container = containerElement || window.document.body, 
			moduleElements = container.querySelectorAll('[data-ark-module]');
		for (i = 0; i < moduleElements.length; i++) {
			element = moduleElements[i];
			moduleId = element.getAttribute('data-ark-module');
			this._initModule(moduleId, element);
		}
	};

	/**
	 * Ark core extensions
	 *
	 * This object should not be used/manipulated publicly
	 */
	Ark.prototype._coreExtensions = [];

	/**
	 * Default config to be merged with user config. 
	 * 
	 * This object should not be used/manipulated publicly.
	 */
	Ark.prototype._defaultConfig = {
		container: null,
		logger : {
			level : 'error',
			prefix : ''
		},
		debug: false
	};

	/**
	 * log function that delegates logging to the logging extension
	 * if it exists.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param message
	 */
	Ark.prototype._log = function(message){
		'use strict';
		
		if (this.sandbox.logger && this.sandbox.logger.log){
			this.sandbox.logger.log('trace', '[Ark.js] ' + message);
		}
	};

	/**
	 * error function that delegates error handling to the error extension
	 * if it exists.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param message Error message
	 * @param ex Exception
	 */
	Ark.prototype._error = function(message, ex){
		'use strict';
		
		if(this.sandbox.error && this.sandbox.error.handle){
			this.sandbox.error.handle(message, ex);
		}
	};


	/**
	 * Instantiates and initializes an extension.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param extension
	 * @param config
	 */
	Ark.prototype._initExtension = function(extension, config){
		'use strict';
		
		if(this.started){
			this._error('Can not initialize extension after Ark has already been started.');
		}
		else{
			this._log('Initializing extension: ' + extension.name);
			
			// make sure config is at least an empty but defined object
			config = config || {};
			
			this.sandbox[extension.name] = {};
			
			var extensionInstance = extension.factory();
			
			if(typeof extension.init === 'function'){
				extension.init.call(extensionInstance, config);
			}

			for ( var property in extensionInstance) {
				if(extensionInstance.hasOwnProperty(property)){
					var value = extensionInstance[property];
					this.sandbox[extension.name][property] = value;
				}
			}
		}
	};

	/**
	 * method to register a new module with the ark.
	 * 
	 * This function should not be used publicly.
	 */
	Ark.prototype._initModule = function(moduleId, element ) {
		'use strict';
		
		var module = userModules[moduleId], 
			instance = module.factory(this.sandbox, element);
		
		if(module.base && userModules[module.base]){
			var baseModule = userModules[module.base].factory(this.sandbox, element);
			instance = this._mergeModules(baseModule, instance);
		}
		
		/*
		 * Wrap each function of the module with an error handler to prevent 
		 * uncaught errors from stopping the entire application.
		 */
		if(!this.config.debug){
			this.sandbox.error.sanitize(instance);
		}
		
		// call the init function of the module
		instance.init.call(instance);
		return instance;
	};


	Ark.prototype._mergeModules = function(baseModule, extendedModule){
		'use strict';
		var finalModule = {};
		
		// create a hidden variable to store the base module
		finalModule.__base__ = baseModule;
		
		// a function to call the methods of the base module
		finalModule._super = function(methodName, args){
			var objectWithMethod = this;
			while( objectWithMethod.hasOwnProperty(methodName) === false){
				objectWithMethod = objectWithMethod.__base__;
			}
			objectWithMethod[methodName].apply(finalModule, args);
		};
		
		// add properties from the baseModule to the final module
		for(var prop in baseModule){
			if(baseModule.hasOwnProperty(prop)){
				if(prop != '__base__'){
					finalModule[prop] = baseModule[prop];
				}
			}
		}
		
		/* 
		 * add properties from the extended module to the final module 
		 * which might override the ones set by the base module.
		 */
		for(prop in extendedModule){
			if(extendedModule.hasOwnProperty(prop)){
				finalModule[prop] = extendedModule[prop];
			}
		}
		 
		return finalModule;
	};
	
	
	// add Ark to the global namespace
	window.Ark = Ark;
	
}(window));