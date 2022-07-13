import React, {forwardRef, useRef, useImperativeHandle, useState, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Style} from '~/common/commonStyle';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';

const source = Platform.select({
    ios: require('../../../../components/Chart/f2chart.html'),
    android: {uri: 'file:///android_asset/f2chart.html'},
});
const colors = ['#E1645C', '#6694F3', '#F8A840', '#CC8FDD', '#5DC162', '#C7AC6B'];

const PKPortfolio = ({data, pkPinning, onScroll, _ref}) => {
    const [expand, setExpand] = useState(false);

    const scrolling = useRef(null);
    const scrollViewRef = useRef(null);

    const row1Height = useMemo(() => {
        const max = data.reduce((memo, cur) => {
            const len = cur?.asset_deploy?.length || 0;
            return len > memo ? len : memo;
        }, 0);
        return 90 + max * 22;
    }, [data]);

    const row2Height = useMemo(() => {
        const max = data.reduce((memo, cur) => {
            const len = cur?.stock_deploy?.length || 0;
            return len > memo ? len : memo;
        }, 0);
        return max * 25;
    }, [data]);

    useImperativeHandle(_ref, () => ({
        scrollTo: (x) => {
            scrollViewRef.current?.scrollTo?.({x, y: 0, animated: false});
        },
    }));

    const genLabels = () => {
        return (
            <View style={styles.labelsWrap}>
                <View style={[styles.labelWrap, {height: px(row1Height)}]}>
                    <Text style={styles.labelText}>占比</Text>
                </View>
                <View style={[styles.labelWrap, {height: px(row2Height)}]}>
                    <Text style={styles.labelText}>重仓股</Text>
                </View>
            </View>
        );
    };

    const genValues = (item, key) => {
        if (!item) return null;
        let map = {};
        item.asset_deploy.map((obj) => {
            map[obj.name] = obj.ratio + '%';
        });
        const initScript = `
        (function(){
          const chart = new F2.Chart({
            id: 'chart',
            pixelRatio: window.devicePixelRatio,
            padding: [0, 'auto'],
            width:${px(90)},
            height:${px(90)},
          });
          chart.source(${JSON.stringify(item.asset_deploy)},{
            ratio: {
              formatter: function formatter(val) {
                return (val * 100).toFixed(2)+ '%';
              }
            }
          });
          chart.tooltip(false);
          chart.legend(false);
          chart.coord('polar', {
            transposed: true,
            innerRadius: 0.7,
            radius: 0.85
          });
          chart.axis(false);
          chart.interval().position('1*ratio').color('name', ${JSON.stringify(colors)}).adjust('stack').style({
            lineWidth: 0.5,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
          });
          chart.render();
        })()
        `;
        return (
            <View style={styles.valuesWrap} key={key}>
                <View
                    style={[
                        {
                            borderBottomColor: '#E9EAEF',
                            borderBottomWidth: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        {height: px(row1Height)},
                    ]}>
                    <WebView
                        allowFileAccess
                        allowFileAccessFromFileURLs
                        allowUniversalAccessFromFileURLs
                        javaScriptEnabled
                        scrollEnabled={false}
                        style={{opacity: 0.99999, width: px(90)}}
                        renderLoading={() => <LoadingWebview />}
                        source={source}
                        injectedJavaScript={initScript}
                        startInLoadingState={true}
                        originWhitelist={['*']}
                        textZoom={100}
                        onMessage={(e) => {
                            console.log(e.nativeEvent.data);
                        }}
                    />
                    <View style={{width: '100%', paddingHorizontal: px(8), paddingBottom: px(8)}}>
                        {item.asset_deploy?.map((itm, idx) => (
                            <View style={styles.asset} key={idx}>
                                <View style={styles.assetLeft}>
                                    <View
                                        style={{
                                            width: px(6),
                                            height: px(6),
                                            borderRadius: px(6),
                                            backgroundColor: colors[idx],
                                            marginRight: px(3),
                                        }}
                                    />
                                    <Text style={styles.valueText}>{itm.name}</Text>
                                </View>
                                <View style={styles.assetRight}>
                                    <Text style={styles.valueText}>{itm.ratio || 0}%</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View
                    style={[
                        {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5},
                        {height: px(row2Height)},
                        {paddingHorizontal: px(8), paddingVertical: px(12)},
                    ]}>
                    {item?.stock_deploy?.[0] ? (
                        item.stock_deploy.map((itm, idx) => {
                            return (
                                <View key={idx} style={[Style.flexBetween, {marginTop: px(idx > 0 ? 5 : 0)}]}>
                                    <Text style={styles.valueText}>{itm.name}</Text>
                                    <Text style={styles.valueText}>{itm.ratio}%</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={{color: '#545968'}}>--</Text>
                    )}
                </View>
            </View>
        );
    };

    const genSup = () => {
        if (data?.length > 5) return null;
        const border = {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5};
        return (
            <View style={{width: px(40)}}>
                <View style={{height: px(row1Height), ...border}} />
                <View style={{height: px(row2Height), ...border}} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>资产分布</Text>
            </View>
            <View style={[styles.content, expand ? {} : {height: px(row1Height), overflow: 'hidden'}]}>
                {/* labels */}
                {genLabels()}
                {/* 占位 */}
                {pkPinning
                    ? genValues(
                          data.find((itm) => itm.code === pkPinning),
                          -1
                      )
                    : null}
                <ScrollView
                    style={{flex: 1}}
                    bounces={false}
                    horizontal={true}
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onMomentumScrollBegin={(_) => {
                        scrolling.current = true;
                    }}
                    onMomentumScrollEnd={(_) => {
                        scrolling.current = false;
                    }}
                    onScrollBeginDrag={(_) => {
                        scrolling.current = true;
                    }}
                    onScrollEndDrag={(_) => {
                        scrolling.current = false;
                    }}
                    onScroll={(e) => {
                        scrolling.current && onScroll?.(e.nativeEvent.contentOffset.x);
                    }}>
                    {/* list */}
                    <View style={{flexDirection: 'row'}}>
                        {data.filter((item) => item.code !== pkPinning).map((item, idx) => genValues(item, idx))}
                    </View>
                    {/* 补位 */}
                    {data.length > 1 ? genSup() : null}
                </ScrollView>
            </View>
            {/* expand */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.expandWrap}
                onPress={() => {
                    global.LogTool('PKContrast_ExpandAndCollapse', 3);
                    setExpand((val) => !val);
                }}>
                <Text style={styles.expandText}>{expand ? '收起' : '展开明细'}</Text>
                <Icon name={expand ? 'chevron-up' : 'chevron-down'} size={25} color="#0051CC" />
            </TouchableOpacity>
        </View>
    );
};

const _PKPriceRange = connect((state) => ({pkPinning: state.pkPinning}))(PKPortfolio);

export default forwardRef((props, ref) => <_PKPriceRange {...props} _ref={ref} />);

const LoadingWebview = () => {
    return (
        <View
            style={[
                Style.flexCenter,
                {position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: '#fff'},
            ]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: px(12),
        backgroundColor: '#fff',
    },
    title: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    titleText: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#121D3A',
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    expandWrap: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px(38),
    },
    expandText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
    labelsWrap: {
        width: px(87),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 0.5,
    },
    labelWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    labelText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        textAlign: 'center',
    },
    valuesWrap: {
        width: px(124),
        borderRightColor: '#E9EAEF',
        borderRightWidth: 0.5,
    },
    valueWrap: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    asset: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    assetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
