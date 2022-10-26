/*
 * @Date: 2022/9/30 13:28
 * @Author: yanruifeng
 * @Description:
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {isIphoneX, px} from '../../../utils/appUtil';
import {Colors, Font, Space} from '~/common/commonStyle';
import RenderList from './components/RenderList';
import AccEarningsCom from './components/AccEarningsCom';
const TotalProfit = React.memo(() => {
    return (
        <View style={styles.container}>
            <AccEarningsCom />
            <View
                style={{
                    paddingHorizontal: px(12),
                }}>
                <RenderList curDate={'my'} />
            </View>
        </View>
    );
});

TotalProfit.propTypes = {};

export default TotalProfit;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: px(22),
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
        marginBottom: isIphoneX() ? px(58) : px(24),
    },
    topLine: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    topPart: {
        marginTop: px(12),
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        paddingBottom: 0,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bigTitle: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    linkText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    labelBox: {
        marginLeft: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    tagText: {
        fontSize: px(9),
        lineHeight: px(13),
        color: Colors.descColor,
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    bigNumText: {
        fontSize: px(22),
        lineHeight: px(27),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    numText: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitBox: {
        marginTop: px(12),
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    profitText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    tradeMsgBox: {
        marginTop: px(12),
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    expandBox: {
        marginBottom: Space.marginVertical,
        paddingVertical: px(12),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        width: '100%',
    },
    angle: {
        position: 'relative',
        top: px(3),
        width: px(6),
        height: px(6),
        backgroundColor: Colors.bgColor,
        transform: [{rotate: '45deg'}],
    },
    menuBox: {
        marginTop: px(12),
        marginBottom: 0,
        marginHorizontal: 0,
    },
    menuIcon: {
        marginBottom: px(6),
        width: px(28),
        height: px(28),
    },
    divider: {
        marginVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
    },
    consoleSub: {
        marginTop: Space.marginVertical,
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    typeIcon: {
        width: px(32),
        height: px(16),
    },
    consoleSubText: {
        marginHorizontal: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        flex: 1,
    },
    consoleSubBtn: {
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        height: px(24),
    },
    upgradeBg: {
        position: 'absolute',
        top: px(2),
        right: px(56),
        width: px(40),
        height: px(36),
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 60,
    },
    signalModeIcon: {
        position: 'absolute',
        top: -px(32),
        right: 0,
        width: px(34),
        height: px(24),
    },
    groupBulletIn: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        borderTopWidth: px(2),
        borderColor: Colors.brandColor,
        backgroundColor: '#fff',
    },
    leftQuota: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        top: px(-10),
        left: 0,
    },
    partBox: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    videoBox: {
        paddingTop: px(8),
        paddingHorizontal: Space.marginAlign,
        paddingBottom: Space.padding,
        height: px(200),
    },
    serviceInfo: {
        marginTop: Space.marginVertical,
        paddingVertical: px(14),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    serviceIcon: {
        marginRight: px(8),
        width: px(44),
        height: px(44),
    },
    bottomList: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    bottomBtns: {
        paddingTop: px(12),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
    },
    bottomBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        fontWeight: Font.weightMedium,
    },
    fixedBtn: {
        borderTopLeftRadius: Space.borderRadius,
        borderBottomLeftRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    buyBtn: {
        marginRight: px(12),
        borderTopRightRadius: Space.borderRadius,
        borderBottomRightRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    chartTabs: {
        backgroundColor: '#fff',
        marginLeft: px(8),
    },
    legendTitle: {
        padding: 0,
        fontSize: px(13),
        lineHeight: px(19),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        width: '100%',
        textAlign: 'center',
    },
    lineLegend: {
        marginRight: px(4),
        width: px(8),
        height: px(2),
    },
    subTabBox: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    activeTab: {
        backgroundColor: '#DEE8FF',
    },
    tabelHeader: {
        marginTop: px(8),
        borderTopLeftRadius: Space.borderRadius,
        borderTopRightRadius: Space.borderRadius,
        height: px(37),
        backgroundColor: Colors.bgColor,
    },
    tabelRow: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        height: px(44),
    },
    toolNameBox: {
        paddingVertical: px(1),
        paddingRight: px(8),
        paddingLeft: px(1),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
    },
    toolIcon: {
        marginRight: px(4),
        width: px(18),
        height: px(18),
    },
    toolNum: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    toolBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    rootMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    keyChooseCon: {
        paddingHorizontal: px(4),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        position: 'absolute',
        zIndex: 2,
    },
    indexBox: {
        paddingVertical: px(8),
        paddingHorizontal: px(4),
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },
    publishAt: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
        fontFamily: Font.numRegular,
    },
    modeTitle: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    signalWrapper: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: px(32),
    },
    indicatorWrapper: {
        flex: 4,
        borderLeftWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    indicatorVal: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    circle: {
        marginRight: px(8),
        borderRadius: px(10),
        width: px(10),
        height: px(10),
    },
    dsFundBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    redeemBtn: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
});
