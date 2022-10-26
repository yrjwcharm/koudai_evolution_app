/*
 * @Date: 2021-08-09 11:45:50
 * @Description:图片懒加载
 */
import React, {Component} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import Image from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {px} from '../utils/appUtil';
import {Style} from '../common/commonStyle';
const styles = StyleSheet.create({
    placeholderWrapper: {
        ...StyleSheet.absoluteFill,
        zIndex: 1,
        // width: '100%',
        // height: '100%',
    },
    placeholder: {
        width: px(55),
        height: px(60),
    },
});

class LazyImage extends Component {
    static propTypes = {
        /**
         * Image source
         */
        source: PropTypes.any,
        /**
         * Custom placeholder component
         */
        customPlaceholder: PropTypes.node,
        /**
         * Placeholder background color, if it is not provided,
         * it will fallback to `#e3e3e3`
         */
        placeholderColor: PropTypes.string,
    };

    static defaultProps = {
        customPlaceholder: null,
        placeholderColor: '#e6e7ec',
    };

    state = {
        isLoading: true,
        opacityStartValue: new Animated.Value(0),
    };

    handleLoadedImage = () => {
        const {opacityStartValue} = this.state;
        this.setState(
            {
                isLoading: false,
                opacityStartValue: new Animated.Value(0),
            },
            () => opacityStartValue.stopAnimation()
        );
    };

    runAnimation = () => {
        const {opacityStartValue} = this.state;
        Animated.loop(
            Animated.timing(opacityStartValue, {
                toValue: 1,
                duration: 1400,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };
    render() {
        const {source, customPlaceholder, placeholderColor, children, style, logoStyle, ...rest} = this.props;
        const {opacityStartValue, isLoading} = this.state;

        return (
            <Animated.View>
                {isLoading && (
                    <View
                        style={[
                            styles.placeholderWrapper,
                            {backgroundColor: placeholderColor || '#e6e7ec'},
                            Style.flexCenter,
                            style,
                        ]}>
                        {customPlaceholder || (
                            <Animated.Image
                                style={[
                                    styles.placeholder,
                                    {
                                        opacity: opacityStartValue.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [1, 0.5, 1],
                                        }),
                                    },
                                    logoStyle,
                                ]}
                                source={require('../assets/img/article/logo.png')}
                            />
                        )}
                    </View>
                )}
                <Image
                    style={style}
                    source={typeof source === 'string' ? {uri: source} : source}
                    onLoadStart={this.runAnimation}
                    onLoadEnd={this.handleLoadedImage}
                    {...rest}
                />
                {this.props.children}
            </Animated.View>
        );
    }
}

export default LazyImage;
