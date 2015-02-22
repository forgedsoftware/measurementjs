/*jslint node: true */
'use strict';

var Options = (function () {
	function OptionsImpl() {
		// General
		this.allowReorderingDimensions = true;
		this.useAutomaticPrefixManagement = true;

		// Dimension Definitions
		this.allowDerivedDimensions = true;
		this.allowVectorDimensions = false;
		this.ignoredDimensions = [];

		// Units
		this.useRareUnits = false;
		this.useEstimatedUnits = true;

		// Systems
		this.allowedSystemsForUnits = [];
		this.ignoredSystemsForUnits = [];

		// Prefixes
		this.useRarePrefixes = false;
		this.useUnofficalPrefixes = false;
	}

	return OptionsImpl;
}());

module.exports = Options;
