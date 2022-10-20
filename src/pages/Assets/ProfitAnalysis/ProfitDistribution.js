import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {deviceWidth, px as text, px, delMille} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {BoxShadow} from 'react-native-shadow';
import Tab from '../../../components/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DayProfit from './DayProfit';
import MonthProfit from './MonthProfit';
import YearProfit from './YearProfit';
import TotalProfit from './TotalProfit';
import PropTypes from 'prop-types';
import Loading from '../../Portfolio/components/PageLoading';
import {getChartData} from './services';
import RenderList from './components/RenderList';
import {isIPhoneX} from '../../../components/IM/app/chat/utils';
import {useDispatch} from 'react-redux';
import {FixedButton} from '../../../components/Button';
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
export const appContext = React.createContext();
const ProfitDistribution = React.memo(({headData, type}) => {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const {profit_info, profit_acc_info, profit_all} = headData;
    const [unitType, setUnitType] = useState('day');
    const [tabs, setTabs] = useState([]);
    const initData = async () => {
        const res = await getChartData({type, unit_type: unitType});
        if (res.code === '000000') {
            const {profit_unit_tab = []} = res.result ?? {};
            setTabs(profit_unit_tab);
        }
        setLoading(false);
    };
    useEffect(() => {
        dispatch({type: 'updateUnitType', payload: unitType});
        initData();
    }, [type, unitType]);
    const callbackData = (data) => {
        setData(data);
    };
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={{flex: 1, position: 'relative'}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <BoxShadow setting={{...shadow}}>
                            <View style={styles.header}>
                                <View style={Style.flexEvenly}>
                                    <View style={styles.headerItem}>
                                        <Text
                                            style={[
                                                styles.profitLabel,
                                                {
                                                    color:
                                                        delMille(profit_info?.value) > 0
                                                            ? Colors.red
                                                            : delMille(profit_info?.value) < 0
                                                            ? Colors.green
                                                            : Colors.lightBlackColor,
                                                },
                                            ]}>
                                            {profit_info?.value}
                                        </Text>
                                        <Text style={styles.profitValue}>{profit_info?.text}</Text>
                                    </View>
                                    <View style={styles.headerItem}>
                                        <Text
                                            style={[
                                                styles.profitLabel,
                                                {
                                                    color:
                                                        delMille(profit_acc_info?.value) > 0
                                                            ? Colors.red
                                                            : delMille(profit_acc_info?.value) < 0
                                                            ? Colors.green
                                                            : Colors.lightBlackColor,
                                                },
                                            ]}>
                                            {profit_acc_info?.value}
                                        </Text>
                                        <Text style={styles.profitValue}>{profit_acc_info?.text}</Text>
                                    </View>
                                    <View style={styles.headerItem}>
                                        <Text
                                            style={[
                                                styles.profitLabel,
                                                {
                                                    color:
                                                        delMille(profit_all?.value) > 0
                                                            ? Colors.red
                                                            : delMille(profit_all?.value) < 0
                                                            ? Colors.green
                                                            : Colors.lightBlackColor,
                                                },
                                            ]}>
                                            {profit_all?.value}
                                        </Text>
                                        <Text style={styles.profitValue}>{profit_all?.text}</Text>
                                    </View>
                                </View>
                            </View>
                        </BoxShadow>
                        <View style={{marginTop: px(26)}} />
                        <View style={styles.section}>
                            {tabs.length > 1 && (
                                <ScrollableTabView
                                    renderTabBar={() => (
                                        //解决key unique
                                        <Tab
                                            style={styles.borderStyle}
                                            btnColor={Colors.defaultColor}
                                            inActiveColor={Colors.lightBlackColor}
                                        />
                                    )}
                                    locked={true}
                                    initialPage={0}
                                    onChangeTab={({i}) => {
                                        setUnitType(tabs[i].type);
                                    }}>
                                    {tabs.map((tab, index) => {
                                        if (index == 0)
                                            return <DayProfit tabLabel={tab.text} key={`${tab + '' + index}`} />;
                                        if (index == 1)
                                            return <MonthProfit tabLabel={tab.text} key={`${tab + '' + index}`} />;
                                        if (index == 2)
                                            return <YearProfit tabLabel={tab.text} key={`${tab + '' + index}`} />;
                                        if (index == 3)
                                            return <TotalProfit tabLabel={tab.text} key={`${tab + '' + index}`} />;
                                    })}
                                </ScrollableTabView>
                            )}
                        </View>
                    </ScrollView>
                    {data.length > 0 && <FixedButton title={'去理财市场看看'} />}
                </View>
            )}
        </>
    );
});

ProfitDistribution.propTypes = {
    setLoadingFn: PropTypes.func,
};

export default ProfitDistribution;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
    },
    renderList: {
        paddingBottom: px(20),
        paddingHorizontal: px(12),
        marginBottom: isIPhoneX() ? px(54) : px(20),
        backgroundColor: Colors.white,
        marginHorizontal: px(16),
        borderBottomRightRadius: px(5),
        borderBottomLeftRadius: px(5),
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
        flex: 1,
        marginHorizontal: px(16),
    },
});
