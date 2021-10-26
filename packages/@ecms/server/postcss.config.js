module.exports = {
	plugins: function () {
		return [
			require("autoprefixer"),
			require("flex-gap-polyfill")
		];
	}
};