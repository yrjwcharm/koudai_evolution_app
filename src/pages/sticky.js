/*
 * @Date: 2021-01-06 21:53:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-27 11:32:46
 * @Description:
 */
// import React, {Component, useEffect, useState, useCallback} from 'react';
// import {Animated, FlatList, Text, View, StyleSheet} from 'react-native';
// import StickyHeader from '../components/Sticky';
// import {Button} from '../components/Button';

// export default class MovieListScreen extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             movieList: [1, 2, 3, 4, 5, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
//             scrollY: new Animated.Value(0),
//             headHeight: -1,
//         };
//     }

//     _keyExtractor = (item, index) => index.toString();

//     _itemDivide = () => {
//         return <View style={{height: 1, backgroundColor: '#ccc'}} />;
//     };
//     render() {
//         return (
//             <Animated.ScrollView
//                 style={{flex: 1}}
//                 onScroll={
//                     Animated.event(
//                         [
//                             {
//                                 nativeEvent: {contentOffset: {y: this.state.scrollY}}, // 记录滑动距离
//                             },
//                         ],
//                         {useNativeDriver: true}
//                     ) // 使用原生动画驱动
//                 }
//                 scrollEventThrottle={1}>
//                 <View
//                     onLayout={(e) => {
//                         let {height} = e.nativeEvent.layout;
//                         this.setState({headHeight: height}); // 给头部高度赋值
//                     }}>
//                     <View>
//                         <Text style={styles.topHeader}>这是头部</Text>
//                     </View>
//                 </View>

//                 <StickyHeader
//                     stickyHeaderY={this.state.headHeight} // 把头部高度传入
//                     stickyScrollY={this.state.scrollY} // 把滑动距离传入
//                 >
//                     <View>
//                         <Text style={styles.tab}>这是顶部</Text>
//                     </View>
//                 </StickyHeader>

//                 <FlatList
//                     data={this.state.movieList}
//                     renderItem={this._renderItem}
//                     keyExtractor={this._keyExtractor}
//                     ItemSeparatorComponent={this._itemDivide}
//                 />
//             </Animated.ScrollView>
//         );
//     }

//     _renderItem = (item) => {
//         return (
//             <View>
//                 <Text style={{height: 200}}>666</Text>
//             </View>
//         );
//     };
// }

// const Test = () => {
//     // const [count, setCount] = useState(0);
//     // const [a, setA] = useState(100);

//     // const fn = useCallback(() => {
//     //     console.log('callback', a);
//     // }, [a]);
//     // // 可知fn是依赖于a的，只有当a发生变化的时候fn才会变化，否则每轮render的fn都是同一个

//     // const f1 = () => {
//     //     console.log('f1');
//     // };
//     // // 对于f1，每轮循环都有独自的f1，所以相当于一直在变化，如果useEffect依赖于f1的话，每次render之后都会执行
//     // useEffect(() => {
//     //     console.log('this is effect');
//     // }, [fn]);
//     // // 当dependency数组里面是f1时，不管更新count还是a，都会执行里面的函数，打印出this is effect
//     // // 当dependency数组里面是fn时，只有更新a时才会执行该函数
//     // return (
//     //     <>
//     //         <Text>Count: {count}</Text>
//     //         <Text>a: {a}</Text>
//     //         <Button onPress={() => setCount(count + 1)} title="增加count" />
//     //         <Button onPress={() => setA(a + 1)} title="增加a" />
//     //     </>
//     // );
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         // const id = setInterval(() => {
//         //     setCount((preCount) => preCount + 1);
//         //     // 此时setCount里面的函数的入参是前一次render之后的count值，所以这样的情况下计时器可以work
//         // }, 1000);
//         // return () => clearInterval(id);
//     }, []);

//     return <Text>{count}</Text>;
// };
// export default Test;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     topHeader: {
//         height: 60,
//         textAlign: 'center',
//     },
//     tab: {
//         height: 80,
//         zIndex: 999,
//         textAlign: 'center',
//         backgroundColor: 'red',
//     },
// });
// import React, {PureComponent, Component} from 'react';
// import {AppRegistry, StyleSheet, Text, View, PanResponder} from 'react-native';

// export default class TouchStartAndRelease extends PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             backgroundColor: 'red',
//             marginTop: 100,
//             marginLeft: 100,
//         };
//         this.lastX = this.state.marginLeft;
//         this.lastY = this.state.marginTop;
//     }

//     componentWillMount() {
//         this._panResponder = PanResponder.create({
//             onStartShouldSetPanResponder: (evt, gestureState) => {
//                 return true;
//             },
//             onMoveShouldSetPanResponder: (evt, gestureState) => {
//                 return true;
//             },
//             // 开始手势操作
//             onPanResponderGrant: (evt, gestureState) => {
//                 this._highlight();
//             },
//             // 触摸点移动
//             onPanResponderMove: (evt, gestureState) => {
//                 console.log(`gestureState.dx : ${gestureState.dx}   gestureState.dy : ${gestureState.dy}`);
//                 this.setState({
//                     marginLeft: this.lastX + gestureState.dx,
//                     marginTop: this.lastY + gestureState.dy,
//                 });
//             },
//             onPanResponderRelease: (evt, gestureState) => {
//                 this._unhighlight();
//                 this.lastX = this.state.marginLeft;
//                 this.lastY = this.state.marginTop;
//             },
//             onPanResponderTerminate: (evt, gestureState) => {},
//         });
//     }

//     _unhighlight() {
//         this.setState({
//             backgroundColor: 'red',
//         });
//     }

//     _highlight() {
//         this.setState({
//             backgroundColor: 'blue',
//         });
//     }

//     render() {
//         return (
//             <View style={styles.container}>
//                 <View
//                     style={[
//                         styles.redView,
//                         {
//                             backgroundColor: this.state.backgroundColor,
//                             marginTop: this.state.marginTop,
//                             marginLeft: this.state.marginLeft,
//                         },
//                     ]}
//                     {...this._panResponder.panHandlers}
//                 />
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     redView: {
//         width: 100,
//         height: 100,
//     },
// });

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, Animated, TouchableOpacity, Easing, View} from 'react-native';

class AnimationRotateScene extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.spin();
    }

    spin() {
        this.spinValue.setValue(0);
        // Animated.timing(this.spinValue, {
        //     toValue: 1,
        //     duration: 4000,
        //     easing: Easing.linear,
        // }).start(() => this.spin());
        Animated.loop(
            Animated.timing(this.spinValue, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
            })
        ).start();
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return (
            <View style={styles.container}>
                <Animated.Image
                    style={{
                        width: 227,
                        height: 200,
                        transform: [{rotate: spin}],
                    }}
                    source={{
                        uri:
                            'https://s3.amazonaws.com/media-p.slid.es/uploads/alexanderfarennikov/images/1198519/reactjs.png',
                    }}
                />
                <TouchableOpacity onPress={() => this.spin()} style={styles.button}>
                    <Text>启动动画</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.spinValue.stopAnimation();
                    }}
                    style={styles.button}>
                    <Text>停止动画</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#808080',
        height: 35,
        width: 140,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AnimationRotateScene;
