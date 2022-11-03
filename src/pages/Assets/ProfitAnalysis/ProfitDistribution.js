import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, DeviceEventEmitter} from 'react-native';
import {deviceWidth, px as text, px, delMille} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {BoxShadow} from 'react-native-shadow';
import Tab from '../../../components/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PropTypes from 'prop-types';
import Loading from '../../Portfolio/components/PageLoading';
import {getChartData, getHeadData} from './services';
import RenderList from './components/RenderList';
import {isIPhoneX} from '../../../components/IM/app/chat/utils';
import {useDispatch, useSelector} from 'react-redux';
import {FixedButton} from '../../../components/Button';
import {useJump} from '../../../components/hooks';
import DayProfit from './DayProfit';
import MonthProfit from './MonthProfit';
import YearProfit from './YearProfit';
import TotalProfit from './TotalProfit';
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
        left: px(16),
        zIndex: 0,
    },
};
const comObj = {
    日收益: DayProfit,
    月收益: MonthProfit,
    年收益: YearProfit,
    累计收益: TotalProfit,
};

const ProfitDistribution = React.memo(({poid = '', type, fund_code = ''}) => {
    const [data, setData] = useState({});
    const dispatch = useDispatch();
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [{profit_info, profit_acc_info, profit_all}, setHeadData] = useState({});
    const [enabled, setEnabled] = useState(true);
    const tabsRef = useRef([
        {type: 'day', text: '日收益'},
        {type: 'month', text: '月收益'},
        {type: 'year', text: '年收益'},
        {type: 'all', text: '累计收益'},
    ]);
    useEffect(() => {
        dispatch({type: 'updateUnitType', payload: 'day'});
        let scrollListener = DeviceEventEmitter.addListener('changeScrollViewEnable', (enabled) => setEnabled(enabled));
        let listener = DeviceEventEmitter.addListener('sendTrigger', (data) => setData(data));
        return () => {
            listener && listener.remove();
            scrollListener && scrollListener.remove();
        };
    }, []);
    useEffect(() => {
        (async () => {
            const res = await getHeadData({type, poid, fund_code});
            if (res.code === '000000') {
                const {title: navigationTitle = '', header = {}} = res.result || {};
                setHeadData(header);
                setLoading(false);
            }
        })();
    }, [type]);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <>
                    <View style={{flex: 1, position: 'relative'}}>
                        <ScrollView scrollEnabled={enabled} showsVerticalScrollIndicator={false}>
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
                                    locked={true}
                                    prerenderingSiblingsNumber={0}
                                    onChangeTab={({i}) => {
                                        global.LogTool(
                                            'click',
                                            i == 0
                                                ? 'day_earnings'
                                                : i == 1
                                                ? 'month_earnings'
                                                : i == 2
                                                ? 'year_earnings'
                                                : 'accumlated_earnings'
                                        );
                                        dispatch({type: 'updateUnitType', payload: tabsRef.current[i].type});
                                    }}>
                                    {tabsRef.current.map((tab, index) => {
                                        const Com = comObj[tab.text];
                                        return (
                                            <Com
                                                type={type}
                                                poid={poid}
                                                unit_type={tab.type}
                                                fund_code={fund_code}
                                                tabLabel={tab.text}
                                                key={`tab${index}`}
                                            />
                                        );
                                    })}
                                </ScrollableTabView>
                            </View>
                        </ScrollView>
                        {Object.keys(data).length > 0 && (
                            <FixedButton title={data?.text} onPress={() => jump(data?.url)} />
                        )}
                    </View>
                </>
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
