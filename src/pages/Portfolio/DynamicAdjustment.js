/*
 * @Date: 2021-01-21 15:34:03
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-12-23 17:42:41
 * @Description: 智能调仓
 */
import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import http from '../../services';
import HTML from '../../components/RenderHtml';
import {percentStackColumn} from './components/ChartOption';
import {Chart} from '../../components/Chart';
import Accordion from 'react-native-collapsible/Accordion';
import Empty from '../../components/EmptyTip';

class DynamicAdjustment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            chartData: [],
            refreshing: false,
            showEmpty: false,
            activeSections: [],
        };
    }
    init = () => {
        const {poid, upid} = this.props.route.params || {};
        http.get('/portfolio/adjust/20210101', {
            poid,
            upid,
            card: 'index',
        }).then((res) => {
            const activeSections = res.result.card_list
                .map((item, index) => (item.toggle === 'open' ? index : undefined))
                .filter((item) => !isNaN(item));
            this.setState({data: res.result, refreshing: false, showEmpty: true, activeSections});
            this.props.navigation.setOptions({title: res.result.title});
        });
        http.get('/portfolio/adjust_chart/20210101', {
            poid,
            upid,
        }).then((res) => {
            const obj = {};
            res.result.chart?.map((item, index) => {
                obj[item.date] = obj[item.date]
                    ? (obj[item.date] * 10000 + item.percent * 10000) / 10000
                    : item.percent;
                item.percent = item.percent * 10000;
            });
            // console.log(obj);
            this.setState({
                chartData: res.result.chart,
                chartColor: res.result.colors,
            });
        });
    };
    updateSections = (activeSections) => {
        this.setState({activeSections});
    };
    renderHeader = (data, _, isActive) => {
        return (
            <View style={Style.flexBetween}>
                <Text style={[styles.adjustTitle]}>{data.title}</Text>
                <FontAwesome
                    name={isActive ? 'angle-down' : 'angle-up'}
                    size={20}
                    color={Colors.descColor}
                    style={{marginLeft: text(12)}}
                />
            </View>
        );
    };
    renderContent = (data) => {
        return data?.items?.length ? (
            <>
                {data?.items?.map((item, index) => {
                    return (
                        <View
                            key={item.id}
                            style={[styles.borderTop, index === data.items.length - 1 ? styles.borderBottom : {}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.adjustRecord, Style.flexRow]}
                                onPress={() =>
                                    this.props.navigation.navigate('HistoryAdjust', {
                                        adjust_id: item.id,
                                        upid: this.props.route.params?.upid || 1,
                                        fr: 'portfolio',
                                    })
                                }>
                                <View style={{flex: 1}}>
                                    <Text style={[Style.flexRow, {textAlign: 'justify'}]}>
                                        <Text style={[styles.recordTitle, {fontWeight: '500'}]}>{item.title}</Text>
                                        <Text style={[styles.recordTitle, {fontSize: Font.textH3}]}>
                                            &nbsp;&nbsp;({item.date})
                                        </Text>
                                    </Text>
                                    <HTML numberOfLines={1} html={item.content} style={styles.recordDesc} />
                                </View>
                                <FontAwesome
                                    name={'angle-right'}
                                    size={20}
                                    color={Colors.descColor}
                                    style={{marginLeft: text(12)}}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                })}
                {data?.btn && (
                    <TouchableOpacity
                        style={[styles.moreRecord, Style.flexCenter]}
                        onPress={() => this.props.navigation.navigate(data?.btn?.url?.path, data?.btn?.url?.params)}>
                        <Text style={[styles.moreText]}>{data.btn.title}</Text>
                        <FontAwesome
                            name={'angle-right'}
                            size={20}
                            color={Colors.brandColor}
                            style={{marginLeft: text(4)}}
                        />
                    </TouchableOpacity>
                )}
            </>
        ) : (
            <Text style={{paddingVertical: text(50), textAlign: 'center'}}>暂无数据</Text>
        );
    };
    componentDidMount() {
        this.init();
    }
    render() {
        const {data, chartColor, chartData, refreshing, showEmpty, activeSections} = this.state;
        return (
            <ScrollView
                style={[styles.container]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.init} />}>
                {data?.card_list?.length > 0 ? (
                    <>
                        <View style={[styles.topPart]}>
                            {chartData?.length > 0 && (
                                <Chart
                                    initScript={percentStackColumn(chartData, 'stack', chartColor)}
                                    data={chartData}
                                    style={{width: '100%'}}
                                />
                            )}
                        </View>
                        <Accordion
                            sections={data.card_list}
                            expandMultiple
                            touchableProps={{activeOpacity: 1}}
                            activeSections={activeSections}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                            onChange={this.updateSections}
                            sectionContainerStyle={[styles.adjustListContainer, {marginBottom: text(12)}]}
                            touchableComponent={TouchableOpacity}
                        />
                        <View style={{paddingBottom: isIphoneX() ? 34 : text(8)}} />
                    </>
                ) : showEmpty ? (
                    <Empty text={'暂无调仓信息'} />
                ) : null}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        backgroundColor: '#fff',
        minHeight: text(240),
        paddingBottom: text(12),
    },
    adjustListContainer: {
        margin: Space.marginAlign,
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingHorizontal: Space.marginAlign,
    },
    adjustTitle: {
        paddingTop: Space.marginVertical,
        paddingBottom: text(12),
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    borderBottom: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    adjustRecord: {
        paddingVertical: text(13),
    },
    recordTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
    },
    recordDesc: {
        marginTop: text(6),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
    moreRecord: {
        paddingVertical: text(14),
        flexDirection: 'row',
    },
    moreText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
});

export default DynamicAdjustment;
