import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';

const PKHome = () => {
    const insets = useSafeAreaInsets();
    const [searchBarHeight, setSearchBarHeight] = useState(0);
    return (
        <View style={[styles.container, {paddingTop: insets.top + searchBarHeight}]}>
            {/* search */}
            <View
                style={[styles.searchWrap, {top: insets.top}]}
                onLayout={(e) => {
                    setSearchBarHeight(e.nativeEvent.layout.height);
                }}>
                <TouchableOpacity style={[styles.searchBg, Style.flexCenter]}>
                    <View style={Style.flexRowCenter}>
                        <Icons name={'search'} color={'#545968'} size={px(18)} />
                        <Text style={styles.searchPlaceHolder}>搜基金代码/名称/经理/公司等</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* scrollView */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    searchWrap: {
        position: 'absolute',
        paddingVertical: px(6),
        paddingHorizontal: px(16),
        // paddingBottom: px(19),
        alignSelf: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    searchBg: {
        backgroundColor: '#F2F3F5',
        paddingVertical: px(8),
        borderRadius: px(146),
    },
    searchPlaceHolder: {
        fontSize: px(13),
        color: '#545968',
        lineHeight: px(18),
    },
});
export default PKHome;
