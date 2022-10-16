/*
 * @Date: 2022-09-28 14:02:48
 * @Description:
 */
module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
    plugins: [
        [
            'babel-plugin-root-import',
            {
                root: __dirname,
                rootPathPrefix: '~/',
                rootPathSuffix: 'src/',
            },
            // 'react-native-reanimated/plugin',
        ],
        // 'react-native-reanimated/plugin',
    ],
    // plugins: ["transform-decorators-legacy"]
};
