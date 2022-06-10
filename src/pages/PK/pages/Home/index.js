import React, {useState} from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Font, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import pkCardBg from '../../../../assets/img/pk/pkCardBg.png';
import pkIcon from '../../../../assets/img/pk/pkIcon.png';
import PKParamRate from '../../components/PKParamRate';

const PKHome = () => {
    const insets = useSafeAreaInsets();
    const [searchBarHeight, setSearchBarHeight] = useState(0);
    return (
        <LinearGradient
            start={{x: 0, y: 0.35}}
            end={{x: 0, y: 1}}
            colors={['#fff', '#F4F5F7']}
            style={[styles.container, {paddingTop: insets.top + searchBarHeight}]}>
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
            <ScrollView style={{flex: 1}}>
                {/* topmenu */}
                <View style={styles.topMenu}>
                    {[1, 2, 3, 4, 5].map((item, idx) => (
                        <View key={idx} style={{alignItems: 'center', width: '20%', marginTop: idx > 4 ? px(15) : 0}}>
                            <FastImage
                                source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/06/public.png'}}
                                resizeMode="contain"
                                style={styles.topMenuIcon}
                            />
                            <Text style={styles.topMenuText}>公募基金</Text>
                        </View>
                    ))}
                </View>
                {/* pk */}
                <View style={styles.pkCard}>
                    <ImageBackground source={pkCardBg} resizeMode="stretch" style={styles.pkInfo}>
                        <View style={styles.pkInfoLeft}>
                            <Text style={styles.pkInfoName}>嘉实中证基建ETF发起式联接A</Text>
                            <Text style={styles.priceRate}>+19.12%</Text>
                            <Text style={styles.priceDesc}>近一年涨跌幅</Text>
                        </View>
                        <View style={styles.pkInfoRight}>
                            <Text style={[styles.pkInfoName, {textAlign: 'right'}]}>嘉实中证基建ETF发起式联接A</Text>
                            <Text style={[styles.priceRate, {textAlign: 'right'}]}>+19.12%</Text>
                            <Text style={[styles.priceDesc, {textAlign: 'right'}]}>近一年涨跌幅</Text>
                        </View>
                        <FastImage source={pkIcon} style={styles.pkIconStyle} />
                    </ImageBackground>
                    {true ? (
                        <>
                            <View style={styles.pkParams}>
                                {[1, 2, 3].map((item, idx) => (
                                    <View key={idx} style={styles.pkParamsItem}>
                                        <Text style={styles.pkParamsItemTitle}>抗风险能力</Text>
                                        <View style={styles.pkParamsItemRate}>
                                            <PKParamRate value={88} color="#1A4FEB" />
                                            <PKParamRate value={60} justifyContent="flex-end" color="#E74949" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.pkParamsTip}>
                                魔方将根据对比板块和权重设置，对基金进行PK，在PK中为您推荐分值更高的产品
                            </Text>
                        </>
                    ) : null}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: px(16),
    },
    searchWrap: {
        position: 'absolute',
        paddingVertical: px(6),
        paddingHorizontal: px(5),
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
    topMenu: {
        marginTop: px(15),
        paddingHorizontal: px(13),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    topMenuIcon: {
        width: px(32),
        height: px(32),
    },
    topMenuText: {
        marginTop: px(4),
        fontSize: px(12),
        color: '#3d3d3d',
        lineHeight: px(18),
        textAlign: 'center',
    },
    pkCard: {
        marginTop: px(15),
        borderRadius: px(6),
        backgroundColor: '#fff',
        paddingBottom: px(20),
    },
    pkInfo: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    pkInfoLeft: {
        flex: 1,
        padding: px(16),
        paddingRight: px(36),
        borderTopLeftRadius: px(6),
    },
    pkInfoRight: {
        flex: 1,
        padding: px(16),
        paddingLeft: px(36),
        borderTopRightRadius: px(6),
    },
    pkInfoName: {
        fontSize: px(14),
        color: '#fff',
        lineHeight: px(20),
        width: '100%',
    },
    priceRate: {
        marginTop: px(8),
        color: '#fff',
        lineHeight: px(18),
        fontWeight: '500',
        fontSize: px(20),
        fontFamily: Font.numFontFamily,
    },
    priceDesc: {
        fontSize: px(11),
        color: 'rgba(255, 255, 255, 0.69)',
        lineHeight: px(15),
    },
    pkIconStyle: {
        width: px(88),
        height: px(44),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: px(-44)}, {translateY: px(-22)}],
    },
    pkParams: {
        alignItems: 'center',
        paddingHorizontal: px(44),
    },
    pkParamsItem: {
        marginTop: px(16),
        width: '100%',
    },
    pkParamsItemTitle: {
        textAlign: 'center',
        fontSize: px(13),
        color: '#121D3A',
        lineHeight: px(18),
    },
    pkParamsItemRate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pkParamsTip: {
        marginTop: px(16),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        paddingHorizontal: px(19),
    },
});
export default PKHome;
