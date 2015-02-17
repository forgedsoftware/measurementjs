
var Options = (function () {
	function OptionsImpl() {
	}

	// General
	OptionsImpl.allowReorderingDimensions = true;

	// Dimension Definitions
	OptionsImpl.allowDerivedDimensions = true;
	OptionsImpl.allowVectorDimensions = false;
	OptionsImpl.ignoredDimensions = [];

	// Units
	OptionsImpl.useRareUnits = false;
	OptionsImpl.useEstimatedUnits = false;

	// Systems
	OptionsImpl.allowedSystemsForUnits = [];
	OptionsImpl.ignoredSystemsForUnits = [];

	// Prefixes
	OptionsImpl.useRarePrefixes = false;
	OptionsImpl.useUnofficalPrefixes = false;

	return OptionsImpl;
}());

module.exports = Options;
