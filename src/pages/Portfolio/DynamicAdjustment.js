/*
 * @Date: 2021-01-21 15:34:03
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-04 20:27:34
 * @Description: 智能调仓
 */
import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';
import HTML from '../../components/RenderHtml';
import {percentStackColumn} from './components/ChartOption';
import {Chart} from '../../components/Chart';

class DynamicAdjustment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            chartData: [],
            refreshing: false,
        };
    }
    init = () => {
        const {upid} = this.props.route.params || {};
        http.get('/portfolio/adjust/20210101', {
            upid: upid || 1,
        }).then((res) => {
            this.setState({data: res.result, refreshing: false});
            this.props.navigation.setOptions({title: res.result.title});
        });
        http.get('/portfolio/adjust_chart/20210101', {
            upid: upid || 1,
        }).then((res) => {
            this.setState({
                chartData: res.result.chart,
            });
        });
    };
    componentDidMount() {
        this.init();
    }
    render() {
        const {data, chartData, refreshing} = this.state;
        const {navigation, route} = this.props;
        return (
            <ScrollView
                style={[styles.container]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.init} />}>
                <View style={[styles.topPart]}>
                    <Chart initScript={percentStackColumn(chartData)} data={chartData} style={{width: '100%'}} />
                </View>
                <View style={[styles.adjustListContainer]}>
                    <Text style={[styles.adjustTitle]}>{data.record?.title}</Text>
                    {data.record?.items?.map((item, index) => {
                        return (
                            <View
                                key={item.id}
                                style={[
                                    styles.borderTop,
                                    index === data.record.items.length - 1 ? styles.borderBottom : {},
                                ]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.adjustRecord, Style.flexRow]}
                                    onPress={() =>
                                        navigation.navigate({
                                            name: 'HistoryAdjust',
                                            params: {
                                                adjust_id: item.id,
                                                upid: route.params?.upid || 1,
                                                fr: 'portfolio',
                                            },
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
                    {data.record?.btn && (
                        <TouchableOpacity
                            style={[styles.moreRecord, Style.flexCenter]}
                            onPress={() => navigation.navigate('AdjustRecord')}>
                            <Text style={[styles.moreText]}>{data.record?.btn.title}</Text>
                            <FontAwesome
                                name={'angle-right'}
                                size={20}
                                color={Colors.brandColor}
                                style={{marginLeft: text(4)}}
                            />
                        </TouchableOpacity>
                    )}
                </View>
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
        height: text(228),
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
