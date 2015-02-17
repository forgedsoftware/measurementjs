
var helpers = require('../../lib/helpers.js');

var ValidationException = (function () {
	function ValidationExceptionImpl(propertyName, reason, sender) {
		this.propertyName = propertyName;
		this.message = 'property ' + propertyName + ' ' + reason;
		this.sender = sender;
	}

	return ValidationExceptionImpl;
}());

module.exports = ValidationException;
