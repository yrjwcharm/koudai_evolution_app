import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import {px} from '~/utils/appUtil';

const Header = ({data = {}}) => {
    const {base_list, target} = data;
    const [leftSize, setLeftSize] = useState({width: 0, height: 0});
    const [rightSize, setRightSize] = useState({width: 0, height: 0});

    const handlerLeftLayout = useCallback((e) => {
        const {width, height} = e.nativeEvent.layout;
        setLeftSize({width, height});
    }, []);

    const handlerRightLayout = useCallback((e) => {
        const {width, height} = e.nativeEvent.layout;
        setRightSize({width, height});
    }, []);

    return (
        <LinearGradient
            style={styles.headerWrap}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#FFFFFF', '#F5F7F8']}>
            <View>
                <LinearGradient
                    style={styles.headerLeft}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['#F5F6F8', '#fff']}
                    onLayout={handlerLeftLayout}>
                    <View style={styles.headerLeftBorderBar} />
                    {base_list?.map((item, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.headerLeftItem,
                                idx > 0 ? {borderTopColor: '#E9EAEF', borderTopWidth: 0.5} : {},
                            ]}>
                            <Text style={styles.headerItemText} numberOfLines={1}>
                                {item}
                            </Text>
                        </View>
                    ))}
                </LinearGradient>
                {leftSize.width ? (
                    <View style={styles.shadow}>
                        <BoxShadow
                            setting={{
                                color: '#3e5aa4',
                                opacity: 0.1,
                                width: leftSize.width,
                                height: leftSize.height,
                                border: 2,
                                radius: px(4),
                                x: 0,
                                y: 2,
                            }}
                        />
                    </View>
                ) : null}
            </View>
            <FastImage
                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png'}}
                style={{width: px(36), height: px(18)}}
            />
            <View>
                <LinearGradient
                    style={styles.headerRight}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['#FFEED6', '#fff']}
                    onLayout={handlerRightLayout}>
                    <View style={styles.headerRightBorderBar} />
                    <View style={[styles.headerRightItem]}>
                        <Text style={styles.headerItemText} numberOfLines={1}>
                            {target}
                        </Text>
                    </View>
                </LinearGradient>
                {rightSize.width ? (
                    <View style={styles.shadow}>
                        <BoxShadow
                            setting={{
                                color: '#3e5aa4',
                                opacity: 0.1,
                                width: rightSize.width,
                                height: rightSize.height,
                                border: 2,
                                radius: px(4),
                                x: 0,
                                y: 2,
                            }}
                        />
                    </View>
                ) : null}
            </View>
        </LinearGradient>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {},
    headerWrap: {
        padding: px(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        width: px(140),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(4),
        zIndex: 1,
    },
    headerRight: {
        width: px(140),
        padding: px(12),
        borderRadius: px(4),
        zIndex: 1,
    },
    headerLeftBorderBar: {
        height: 2,
        backgroundColor: '#9aa0b1',
        position: 'absolute',
        top: 0,
        width: px(140),
    },
    headerLeftItem: {
        paddingVertical: px(6),
    },
    headerItemText: {
        textAlign: 'center',
        fontSize: px(13),
        color: '#121d3a',
        lineHeight: px(18),
    },
    headerRightBorderBar: {
        height: 2,
        backgroundColor: '#FF7D41',
        position: 'absolute',
        top: 0,
        width: px(140),
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
