
/**
 * Ark constructor
 * 
 * @param settings object
 */
function Ark(settings) {

	this.sandbox = {}; 
	this.config = this.defaultConfig;
	
	/* 
	 * Shallow merge of user settings with default settings.
	 * Perhaps this should be improved to a deep merge.
	 */ 
	for(var attr in settings){
		this.config[attr] = settings[attr];
	}
	
	this.modules = this.config.modules || [];
	this.extensions = this.config.extensions || [];
	
	// init core extensions right away because the main library relies on some of them
	for (var i = 0; i < this.coreExtensions.length; i++) {
		var coreExtension = this.coreExtensions[i];
		this.initExtension(coreExtension, this.config[coreExtension.name]);
	}
	
	this.log('Ark constructed');
}

/**
 * Ark version number
 */
Ark.prototype.version = '0.0.1';

/**
 * Ark core extensions. 
 * 
 * This array should not be used/manipulated publicly.
 */
Ark.prototype.coreExtensions = [];

/**
 * Default config to be merged with user config. 
 * 
 * This object should not be used/manipulated publicly.
 */
Ark.prototype.defaultConfig = {
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
Ark.prototype.log = function(message){
	if (this.sandbox.logger.log){
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
Ark.prototype.error = function(message, ex){
	if(this.sandbox.error && this.sandbox.error.handle){
		this.sandbox.error.handle(message, ex);
	}
};

/**
 * The start function will bootstrap the extensions and modules.
 */
Ark.prototype.start = function(){
	this.log('Starting Ark...');
	
	if(this.started){
		this.error('Ark is already started.');
	}else{
		// init user extensions
		this.log('Initializing user extensions...');
		for(var i = 0; i < this.extensions.length; i++){
			var extension = this.extensions[i];
			this.log('Initializing ' + extension.name + '...');
			this.initExtension(this.extensions[i].instance, this.extensions[i].config);
		}
		this.log('User extensions initialized.');
		
		// sanitize sandbox to handle errors
		this.sandbox.error.sanitize(this.sandbox);
		
		
		// init user modules
		this.log('Initializing user modules...');
		this.scan(this.config.container);
		this.log('User modules initialized.');
		
		this.log('Ark started.');
		this.started = true;
	}
};



Ark.prototype.stop = function(moduleId){
	// TODO
};

/**
 * Instantiates and initializes an extension.
 * 
 * This function should not be used publicly.
 * 
 * @param extension
 * @param config
 */
Ark.prototype.initExtension = function(extension, config){
	if(this.started){
		this.error('Can not initialize extension after Ark has already been started.');
	}
	else{
		// make sure config is at least an empty but defined object
		config = config || {};
		
		this.sandbox[extension.name] = {};
		
		if(this.sandbox.error && this.sandbox.error.sanitize){
			this.sandbox.error.sanitize(extension);
		}
		
		if(typeof extension.init === 'function'){
			extension.init.call(extension, config);
		}

		for ( var property in extension) {
			if(extension.hasOwnProperty(property)){
				var value = extension[property];
				this.sandbox[extension.name][property] = value;
			}
		}
	}
};

/**
 * Registers a module.
 * 
 * @param creator	A function object that will return the module object.
 * @param element	The DOM element for this module instance
 * @param config	A config object for the module
 */
Ark.prototype.register = function(moduleId, parent, creator){
	if(arguments.length === 2){
		creator = parent;
		parent = null;
	}

	this.modules[moduleId] = {
		parent: parent,
		creator: creator
	};
};

/**
 * Scans for module instances in the arks container
 * 
 */
Ark.prototype.scan = function(container) {
	var i, 
		element, 
		moduleId, 
		container = container || window.document.body, 
		moduleElements = container.querySelectorAll('[data-module]');
	for (i = 0; i < moduleElements.length; i++) {
		element = moduleElements[i];
		moduleId = element.getAttribute('data-module');
		this.initModule(moduleId, element);
	}
};


/**
 * method to register a new module with the ark.
 * 
 * This function should not be used publicly.
 */
Ark.prototype.initModule = function(moduleId, element ) {
	
	var module = this.modules[moduleId], 
		instance = module.creator(this.sandbox, element);
	
	if(module.parent){
		instance.prototype = this.modules[module.parent].creator.prototype;
	}
	
	if(!this.config.debug){
		this.sandbox.error.sanitize(instance);
	}
	
	// call the init function of the module
	instance.init.call(instance);
	return instance;
};

/**
 * Registers an extension.
 * 
 * @param extension 	The extension object
 * @param config		The config object for the extension
 */
Ark.prototype.extend = function(extension, config) {
	if (this.started) {
		this.error('Can not register extension after Ark has already been started.');
	} else{
		this.extensions.push({
			instance: extension,
			config: config
		});
	}
};