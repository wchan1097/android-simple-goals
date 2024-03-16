module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
	[
		"module-resolver", {
			extensions: ['.js', '.jsx', '.tsx', '.ts', '.svg'],
			"alias": {
				src: "./src",
				components: "./src/components",
				assets: "./src/assets",
				screens: "./src/screens"
			}
		}
	]]
};