import React, {useRef} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {deviceWidth, px as text, px} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {BoxShadow} from 'react-native-shadow';
import Tab from '../../../components/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DayProfit from './DayProfit';
import MonthProfit from './MonthProfit';
import YearProfit from './YearProfit';
import TotalProfit from './TotalProfit';

const ProfitDistribution = () => {
    const tabsRef = useRef(['日收益', '月收益', '年收益', '累计收益']);
    const shadow = {
        color: '#AAA',
        border: 4,
        radius: px(5),
        opacity: 0.102,
        x: 0,
        y: 2,
        width: deviceWidth - px(32),
        height: text(71),
        style: {
            position: 'relative',
            top: px(12),
            left: Space.padding,
            zIndex: 0,
        },
    };
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <BoxShadow setting={{...shadow}}>
                <View style={styles.header}>
                    <View style={Style.flexEvenly}>
                        <View style={styles.headerItem}>
                            <Text style={[styles.profitLabel, {color: Colors.defaultColor}]}>0.00</Text>
                            <Text style={styles.profitValue}>昨日收益(元)</Text>
                        </View>
                        <View style={styles.headerItem}>
                            <Text style={[styles.profitLabel, {color: Colors.green}]}>-2,628.97</Text>
                            <Text style={styles.profitValue}>持仓收益(元)</Text>
                        </View>
                        <View style={styles.headerItem}>
                            <Text style={[styles.profitLabel, {color: Colors.red}]}>+532,628.97</Text>
                            <Text style={styles.profitValue}>累计收益(元)</Text>
                        </View>
                    </View>
                </View>
            </BoxShadow>
            <View style={{marginTop: px(26)}} />
            <View style={styles.section}>
                <ScrollableTabView
                    renderTabBar={() => (
                        //解决key unique
                        <Tab
                            style={styles.borderStyle}
                            btnColor={Colors.defaultColor}
                            inActiveColor={Colors.lightBlackColor}
                        />
                    )}
                    initialPage={0}
                    onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
                    {tabsRef.current.map((tab, index) => {
                        if (index == 0) return <DayProfit tabLabel={tab} u key={`${tab + '' + index}`} />;
                        if (index == 1) return <MonthProfit tabLabel={tab} key={`${tab + '' + index}`} />;
                        if (index == 2) return <YearProfit tabLabel={tab} key={`${tab + '' + index}`} />;
                        if (index == 3) return <TotalProfit tabLabel={tab} key={`${tab + '' + index}`} />;
                    })}
                </ScrollableTabView>
            </View>
        </ScrollView>
    );
};

ProfitDistribution.propTypes = {};

export default ProfitDistribution;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: px(5),
        backgroundColor: Colors.white,
        height: px(71),
    },
    headerItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    profitLabel: {
        fontSize: px(15),
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    profitValue: {
        marginTop: px(6),
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    borderStyle: {
        borderTopLeftRadius: px(5),
        borderTopRightRadius: px(5),
    },
    section: {
        marginHorizontal: px(16),
    },
});
