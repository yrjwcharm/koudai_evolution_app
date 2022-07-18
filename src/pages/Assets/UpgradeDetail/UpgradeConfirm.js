import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';
import {Font} from '~/common/commonStyle';
import Agreements from '~/components/Agreements';
import BottomDesc from '~/components/BottomDesc';
import {Button} from '~/components/Button';
import {isIphoneX, px} from '~/utils/appUtil';

const UpgradeConfirm = () => {
    const [curCardLayout, setCurCardLayout] = useState(null);
    const [futureCardLayout, setFutureCardLayout] = useState(null);
    const [showCheckTag, setShowCheckTag] = useState(false);
    const [check, setCheck] = useState(false);

    return (
        <View style={styles.container}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 0.3}} colors={['#fff', '#F5F7F8']} style={{flex: 1}}>
                <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.content}>
                        {/* top */}
                        <View>
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                colors={['#F5F6F8', '#fff']}
                                style={{borderRadius: px(4), zIndex: 1}}
                                onLayout={(e) => {
                                    setCurCardLayout(e.nativeEvent.layout);
                                }}>
                                <View style={{height: px(2), backgroundColor: '#9AA0B1', borderRadius: px(4)}} />
                                <View style={styles.assetsWrap}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerLabel}>持仓产品</Text>
                                        <Text style={styles.headerLabel}>当前持仓金额(元)</Text>
                                    </View>
                                    {[1, 2].map((item, idx) => (
                                        <View key={idx} style={[styles.item, {marginTop: px(12)}]}>
                                            <Text style={styles.bigName}>国投瑞银新能源混合A</Text>
                                            <Text style={styles.bigAmount}>120,000.00</Text>
                                        </View>
                                    ))}
                                </View>
                            </LinearGradient>
                            {curCardLayout?.width ? (
                                <View style={{position: 'absolute', left: 0, top: 0}}>
                                    <BoxShadow
                                        setting={{
                                            color: '#3e5aa4',
                                            border: 4,
                                            radius: px(4),
                                            opacity: 0.1,
                                            x: 0,
                                            y: 2,
                                            width: curCardLayout?.width,
                                            height: curCardLayout?.height,
                                        }}
                                    />
                                </View>
                            ) : null}
                        </View>
                        {/* icon */}
                        <FastImage
                            style={styles.icon}
                            source={{
                                uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/151658114869_.pic_.png',
                            }}
                        />
                        {/* bottom */}
                        <View>
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 0.2}}
                                colors={['#FFF2E1', '#fff']}
                                style={{borderRadius: px(4), zIndex: 1}}
                                onLayout={(e) => {
                                    setFutureCardLayout(e.nativeEvent.layout);
                                }}>
                                <View style={{height: px(2), backgroundColor: '#FF7D41', borderRadius: px(4)}} />
                                <View style={styles.assetsWrap}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerLabel}>升级产品</Text>
                                        <Text style={styles.headerLabel}>升级后总持仓金额(元)</Text>
                                    </View>
                                    <View style={[styles.item, {marginTop: px(12)}]}>
                                        <Text style={styles.bigName}>某某某某某某组合全称</Text>
                                        <Text style={styles.bigAmount}>120,000.00</Text>
                                    </View>
                                    {/* 具体 */}
                                    <View style={styles.detail}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerLabel}>产品名称</Text>
                                            <Text style={styles.headerLabel}>升级后持仓(元)</Text>
                                        </View>
                                        {[1, 2, 3, 4, 5, 6].map((item, idx) => (
                                            <View key={idx} style={[styles.item, {marginTop: px(16)}]}>
                                                <Text style={styles.smallName}>某某某某某某组合全称</Text>
                                                <Text style={styles.smallAmount}>120,000.00</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </LinearGradient>
                            {futureCardLayout?.width ? (
                                <View style={{position: 'absolute', left: 0, top: 0}}>
                                    <BoxShadow
                                        setting={{
                                            color: '#3e5aa4',
                                            border: 4,
                                            radius: px(4),
                                            opacity: 0.1,
                                            x: 0,
                                            y: 2,
                                            width: futureCardLayout?.width,
                                            height: futureCardLayout?.height,
                                        }}
                                    />
                                </View>
                            ) : null}
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
            </LinearGradient>
            <View style={styles.bottomWrap}>
                {/* agreement agreement_bottom button */}
                {/* {agreement?.radio_text && showCheckTag && !check ? (
                    <View style={styles.checkTag}>
                        <Text style={{fontSize: px(14), lineHeight: px(20), color: '#fff'}}>
                            {agreement?.radio_text}
                        </Text>
                        <View style={styles.qualTag} />
                    </View>
                ) : null}
                <Agreements
                    check={agreement_bottom?.default_agree}
                    data={agreement_bottom?.list}
                    otherAgreement={agreement}
                    otherParam={otherParam}
                    title={agreement_bottom?.text}
                    text1={agreement_bottom?.text1}
                    onChange={(checkStatus) => {
                        setCheck(checkStatus);
                        setShowCheckTag(!checkStatus);
                    }}
                    suffix={agreement_bottom.agree_text}
                />
                <Button
                    style={{paddingVertical: px(8), paddingHorizontal: px(15)}}
                    disabled={!check || button.avail === 0}
                /> */}
            </View>
        </View>
    );
};

export default UpgradeConfirm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
    },
    assetsWrap: {
        padding: px(16),
        paddingTop: px(14),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLabel: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9aa0b1',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bigName: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    bigAmount: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    icon: {
        width: px(40),
        height: px(40),
        marginVertical: px(8),
        alignSelf: 'center',
    },
    detail: {
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        marginTop: px(16),
        paddingTop: px(15),
    },
    smallName: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
    },
    smallAmount: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    checkTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: px(8),
        paddingVertical: px(6),
        position: 'absolute',
        top: -px(30),
        zIndex: 10,
        left: px(12),
        borderRadius: px(4),
    },
    qualTag: {
        position: 'absolute',
        borderWidth: px(6),
        borderTopColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'transparent',
        left: px(8),
        bottom: -px(12),
    },
    bottomWrap: {
        paddingBottom: isIphoneX() ? 34 : px(8),
        backgroundColor: '#fff',
    },
});
