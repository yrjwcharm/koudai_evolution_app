/*
 * @Date: 2021-03-01 14:11:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-25 11:35:21
 * @Description:
 */
import React from 'react';
import {SafeAreaView, View, Text, TextInput, Animated, Dimensions, ViewStyle} from 'react-native';
import {Font, Colors} from '../common/commonStyle';
import {px, deviceHeight as height, deviceWidth as width} from '../utils/appUtil';
import lodash from 'lodash';
type Props = {
    /**
     * Container style
     */
    style: ViewStyle,

    /**
     * Container default value
     */
    value: number,

    /**
     * Component's width
     */
    width: number,

    /**
     * Component's height
     */
    height: number,

    /**
     * Vertical mode
     */
    vertical: boolean,

    /**
     * Minimum value of the ruler
     */
    minimum: number,

    /**
     * Maximum value of the ruler
     */
    maximum: number,

    /**
     * Each segment's width
     */
    segmentWidth: number,

    /**
     * Each segment's space
     */
    segmentSpacing: number,

    /**
     * Color of indicator
     */
    indicatorColor: string,

    /**
     * Indicator's width
     */
    indicatorWidth: number,

    /**
     * Indicator's height
     */
    indicatorHeight: number,

    /**
     * Indicator's space from bottom
     */
    indicatorBottom: number,

    /**
     * Step
     */
    step: number,

    /**
     * Steps color
     */
    stepColor: string,

    /**
     * Steps height
     */
    stepHeight: number,

    /**
     * Normal lines color
     */
    normalColor: string,

    /**
     * Normal lines height
     */
    normalHeight: number,

    /**
     * Background color
     */
    backgroundColor: string,

    /**
     * Number's font family
     */
    numberFontFamily: string,

    /**
     * Number's size
     */
    numberSize: number,

    /**
     * Number's color
     */
    numberColor: string,

    /**
     * Unit
     */
    unit: string,

    /**
     * Unit's space from bottom
     */
    unitBottom: number,

    /**
     * Unit's font family
     */
    unitFontFamily: string,

    /**
     * Unit's color
     */
    unitColor: string,

    /**
     * Unit's size
     */
    unitSize: number,

    /**
     * On value change
     */
    onChangeValue: Function,
};

class Ruler extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            scrollX: new Animated.Value(0),
            value: 0,
        };

        // References
        this.scrollViewRef = React.createRef();
        this.textInputRef = React.createRef();

        // Calculations
        this.snapSegment = (props.segmentWidth + props.segmentSpacing) * 2; //做了*2的操作，因为小刻度不算
        this.spacerWidth = (props.width - props.segmentWidth) / 2;
        this.rulerWidth = props.width - props.segmentWidth + (props.maximum - props.minimum) * this.snapSegment;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.rulerWidth =
                nextProps.width - nextProps.segmentWidth + (nextProps.maximum - nextProps.minimum) * this.snapSegment;
            this.scroll(nextProps.defaultValue, nextProps.minimum);
        }
    }

    scroll = (value, _minimum) => {
        this.timer = setTimeout(() => {
            this.scrollViewRef?.current?.scrollTo({
                x: (value - _minimum) * this.snapSegment,
                y: 0,
                animated: false,
            });
        });
        // this.textInputRef.current.setNativeProps({
        //     text: `${value}`,
        // });
    };
    componentDidMount() {
        const {minimum, defaultValue} = this.props;
        defaultValue && this.scroll(defaultValue, minimum);
        // Create a listener
        this.scrollListener = this.state.scrollX.addListener(
            lodash.debounce(({value}) => {
                if (defaultValue && value == (defaultValue * this.snapSegment) / 2) {
                    return;
                }
                if (this.textInputRef && this.textInputRef.current) {
                    this.textInputRef.current.setNativeProps({
                        text: `${Math.round(value / this.snapSegment) + this.props.minimum}`,
                    });
                    this.setState({
                        value: Math.round(value / this.snapSegment) + this.props.minimum,
                    });
                }
            }, 0)
        );
    }

    componentWillUnmount() {
        // Remove the above listener
        this.state.scrollX.removeListener(this.scrollListener);
    }

    renderRuler() {
        const {
            minimum,
            maximum,
            segmentWidth,
            segmentSpacing,
            step,
            stepColor,
            stepHeight,
            normalColor,
            normalHeight,
        } = this.props;

        // Create an array to make a ruler
        const data = [...Array(maximum - minimum + 1).keys()].map((i) => i + minimum);
        const arr = new Array(data.length * 2 - 1);
        return (
            <View
                style={{
                    width: this.rulerWidth,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                }}>
                {/* Spacer */}
                <View
                    style={{
                        width: this.spacerWidth,
                    }}
                />
                <View>
                    {/* Ruler */}
                    <View>
                        <View style={{height: 1, backgroundColor: '#E7E7E7', marginRight: px(38)}} />
                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                            {Array.from(arr).map((item, i) => {
                                return (
                                    <View
                                        key={i}
                                        style={{
                                            backgroundColor: i % step === 0 ? stepColor : normalColor,
                                            height: i % step === 0 ? stepHeight : normalHeight,
                                            width: segmentWidth,
                                            marginRight: segmentSpacing,
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: px(-5), marginTop: px(30)}}>
                        {data.map((i) => {
                            return (
                                <Text
                                    key={i + 'on'}
                                    style={{
                                        width: this.snapSegment,
                                        fontSize: px(18),
                                        color: '#D0D0D0',

                                        // textAlign: '',
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {i}
                                </Text>
                            );
                        })}
                    </View>
                </View>
                {/* Spacer */}
                <View
                    style={{
                        width: this.spacerWidth,
                    }}
                />
            </View>
        );
    }

    render() {
        const {
            style,
            minimum,
            defaultValue,
            segmentWidth,
            indicatorWidth,
            indicatorHeight,
            indicatorColor,
            indicatorBottom,
            backgroundColor,
            numberFontFamily,
            numberSize,
            numberColor,
            unit,
            unitBottom,
            unitFontFamily,
            unitColor,
            unitSize,
            width,
            height,
            vertical,
            onChangeValue,
        } = this.props;
        return (
            <SafeAreaView
                style={[
                    style,
                    {
                        width,
                        height,
                        // marginRight: px(16),
                        backgroundColor,
                        position: 'relative',
                        transform: vertical ? [{rotate: '90deg'}] : undefined,
                    },
                ]}>
                <Animated.ScrollView
                    ref={this.scrollViewRef}
                    horizontal
                    bounces={false}
                    // automaticallyAdjustContentInsets={false}
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={100}
                    // snapToInterval={this.snapSegment}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {x: this.state.scrollX},
                                },
                            },
                        ],
                        {useNativeDriver: true}
                    )}
                    onMomentumScrollEnd={() => onChangeValue(this.state.value)}>
                    {this.renderRuler()}
                </Animated.ScrollView>

                {/* Number && Unit */}
                <View
                    style={{
                        width: indicatorWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: indicatorBottom,
                        left: (width - indicatorWidth) / 2,
                    }}
                    pointerEvents="none">
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            transform: vertical ? [{rotate: '-90deg'}] : undefined,
                        }}>
                        {/* Number */}
                        <TextInput
                            ref={this.textInputRef}
                            style={{
                                fontSize: numberSize,
                                fontFamily: numberFontFamily,
                                color: numberColor,
                                textAlign: 'center',
                                padding: 0,
                            }}
                            defaultValue={defaultValue?.toString() || minimum.toString()}
                        />

                        {/* Unit */}
                        <Text
                            style={{
                                marginBottom: unitBottom,
                                fontSize: unitSize,
                                fontFamily: unitFontFamily,
                                color: unitColor,
                            }}>
                            {unit}
                        </Text>
                    </View>

                    {/* Indicator */}
                    <View
                        style={{
                            height: indicatorHeight,
                            backgroundColor: indicatorColor,
                            width: segmentWidth,
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

Ruler.defaultProps = {
    style: {},
    defaultValue: '', //默认值
    vertical: false,
    width,
    height: height * 0.23,
    onChangeValue: () => {},
    minimum: 0,
    maximum: 100,
    segmentWidth: px(1),
    segmentSpacing: px(24),
    indicatorColor: Colors.brandColor,
    indicatorWidth: px(100),
    indicatorHeight: px(49),
    indicatorBottom: px(40),
    step: 10,
    stepColor: '#D0D0D0',
    stepHeight: px(24),
    normalColor: '#E7E7E7',
    normalHeight: px(16),
    backgroundColor: '#FFFFFF',
    numberFontFamily: Font.numMedium,
    numberSize: px(48),
    numberColor: Colors.brandColor,
    unit: 'cm',
    unitBottom: px(10),
    unitFontFamily: 'System',
    unitColor: Colors.brandColor,
    unitSize: px(16),
};

export default Ruler;
