/*
 * @Date: 2021-01-21 15:34:03
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-21 16:33:58
 * @Description:
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';

class DynamicAdjustment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }
    componentDidMount() {
        // const { account_id } = this.props.route.params || {};
        // http.get('/portfolio/adjust/20210101', { account_id }).then(res => {
        //   this.setState({ data: res.result });
        //   this.props.navigation.setOptions({ title: res.result.title });
        // });
        this.setState({
            data: {
                items: [
                    {
                        title: 'A股基金池调整，同时增加债券比例',
                        date: '（2020-12-12）',
                        desc: '在全市场8000多只基金中，筛选出稳定性强的基金…',
                    },
                    {
                        title: 'A股结构性调整，增配大盘、减配小盘股，总体配置比例不变，增加债券比例',
                        date: '（2020-12-12）',
                        desc: '在全市场8000多只基金中，筛选出稳定性强的基金大…',
                    },
                    {
                        title: 'A股基金池调整，同时增加债券比例',
                        date: '（2020-12-12）',
                        desc: '在全市场8000多只基金中，筛选出稳定性强的基金…',
                    },
                    {
                        title: 'A股结构性调整，增配大盘、减配小盘股，总体配置比例不变，增加债券比例',
                        date: '（2020-12-12）',
                        desc: '在全市场8000多只基金中，筛选出稳定性强的基金大…',
                    },
                ],
            },
        });
    }
    render() {
        const {data} = this.state;
        return (
            <ScrollView style={[styles.container]}>
                <View style={[styles.topPart]}>
                    <View />
                </View>
                <View style={[styles.adjustListContainer]}>
                    <Text style={[styles.adjustTitle]}>{'调仓记录'}</Text>
                    {data.items &&
                        data.items.map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.borderTop,
                                        index === data.items.length - 1 ? styles.borderBottom : {},
                                    ]}>
                                    <TouchableOpacity style={[styles.adjustRecord, Style.flexRow]}>
                                        <View style={{width: text(296)}}>
                                            <Text style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                                <Text style={[styles.recordTitle, {fontWeight: '500'}]}>
                                                    {item.title}
                                                </Text>
                                                <Text style={[styles.recordTitle, {fontSize: Font.textH3}]}>
                                                    {item.date}
                                                </Text>
                                            </Text>
                                            <Text style={[styles.recordDesc]}>{item.desc}</Text>
                                        </View>
                                        <FontAwesome
                                            name={'angle-right'}
                                            size={20}
                                            color={Colors.descColor}
                                            style={{marginLeft: text(8)}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    <TouchableOpacity style={[styles.moreRecord, Style.flexCenter]}>
                        <Text style={[styles.moreText]}>{'查看更多'}</Text>
                        <FontAwesome
                            name={'angle-right'}
                            size={20}
                            color={Colors.brandColor}
                            style={{marginLeft: text(4)}}
                        />
                    </TouchableOpacity>
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
