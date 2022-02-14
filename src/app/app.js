{
	'use strict';

	angular.module("ct", ["ngMaterial"])

	.config(["$mdThemingProvider", n => {

		n.definePalette("ctPalette", {
			"50": "88403c",
			"100": "88403c",
			"200": "88403c",
			"300": "88403c",
			"400": "88403c",
			"500": "88403c",
			"600": "88403c",
			"700": "88403c",
			"800": "88403c",
			"900": "88403c",
			A100: "88403c",
			A200: "88403c",
			A400: "88403c",
			A700: "88403c",
			contrastDefaultColor: "light",
			contrastDarkColors: ["50", "100", "200", "300", "400", "A100"],
			contrastLightColors: ["88403c"]
		});

		n.definePalette("ctPaletteAccent", {
			"50": "88403c",
			"100": "88403c",
			"200": "88403c",
			"300": "88403c",
			"400": "88403c",
			"500": "88403c",
			"600": "88403c",
			"700": "88403c",
			"800": "88403c",
			"900": "88403c",
			A100: "88403c",
			A200: "88403c",
			A400: "88403c",
			A700: "88403c",
			contrastDefaultColor: "dark",
			contrastDarkColors: ["50", "100", "200", "300", "400", , "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"],
			contrastLightColors: ["88403c", "88403c"]
		});

		n.theme("default")
			.primaryPalette("ctPalette")
			.accentPalette("ctPaletteAccent");

	}]);
}