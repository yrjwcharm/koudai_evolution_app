/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-18 11:17:19
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-18 16:54:31
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, SectionList, TouchableOpacity} from 'react-native';
import {px as text} from '../../utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Style, Colors, Font, Space} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';

// Item = ({title}) => (
//     <View style={{paddingHorizontal: text(15)}}>
//         <View style={styles.list_content}>
//             <View>
//                 <Text>{title}</Text>
//             </View>
//         </View>
//     </View>
// );
export default class TradeAdjust extends Component {
    constructor() {
        super();
        this.state = {
            toggle: [true, false],
            list: [
                {
                    title: '调仓前后对比',
                    item: [
                        {
                            head: {
                                name: '股票基金',
                                cur_ratio: '当前比例',
                                after: '调仓后',
                            },
                            body: [
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                            ],
                        },
                        {
                            head: {
                                name: '股票基金',
                                cur_ratio: '当前比例',
                                after: '调仓后',
                            },
                            body: [
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                            ],
                        },
                    ],
                },
                {
                    title: '调仓前后对比',
                    tips: 'aaa',
                    item: [
                        {
                            head: {
                                name: '股票基金',
                                cur_ratio: '当前比例',
                                after: '调仓后',
                            },
                            body: [
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                            ],
                        },
                        {
                            head: {
                                name: '股票基金',
                                cur_ratio: '当前比例',
                                after: '调仓后',
                            },
                            body: [
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                                {
                                    name: '鹏华空天军工指数(LOF)A',
                                    cur_ratio: '10.00%',
                                    after: '10.00%',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    toggleChange = (index) => {
        const toggle = this.state.toggle;
        toggle[index] = !toggle[index];
        this.setState({
            toggle,
        });
    };

    render() {
        const {toggle, list} = this.state;
        return (
            <ScrollView style={styles.container}>
                {list.map((_k, _l) => {
                    return (
                        <View style={{marginBottom: text(10)}} key={'_k' + _l}>
                            <TouchableOpacity
                                style={[styles.list_head, Style.flexRow]}
                                onPress={() => this.toggleChange(_l)}
                                activeOpacity={1}>
                                <View style={[Style.flexRow, styles.list_content]}>
                                    <View style={[{flex: 1}, Style.flexRow]}>
                                        <Text>{_k.title}</Text>
                                        {_k.tips && (
                                            <AntDesign
                                                name={'questioncircleo'}
                                                size={14}
                                                color={'#9095A5'}
                                                style={{marginLeft: text(5)}}
                                            />
                                        )}
                                    </View>
                                    <AntDesign name={toggle[_l] ? 'down' : 'up'} size={12} color={'#9095A5'} />
                                </View>
                            </TouchableOpacity>

                            {toggle[_l] && (
                                <View
                                    style={{
                                        paddingBottom: text(15),
                                        backgroundColor: '#fff',
                                        paddingHorizontal: text(15),
                                    }}>
                                    {_k.item.map((_item, index) => {
                                        return (
                                            <View key={_item + index}>
                                                <View style={[Style.flexRow]}>
                                                    <View style={[Style.flexRow, {flex: 1}]}>
                                                        <View style={styles.circle}></View>
                                                        <Text style={styles.content_head_title}>{_item.head.name}</Text>
                                                    </View>
                                                    <Text style={styles.content_head_title}>
                                                        {_item.head.cur_ratio}
                                                    </Text>
                                                    <Text style={styles.content_head_title}>{_item.head.after}</Text>
                                                </View>
                                                {_item.body.map((_i, _d) => {
                                                    return (
                                                        <View style={Style.flexRow} key={_i + _d}>
                                                            <Text
                                                                style={[
                                                                    styles.content_item_text,
                                                                    {flex: 1, textAlign: 'left'},
                                                                ]}>
                                                                {_i.name}
                                                            </Text>
                                                            <Text style={styles.content_item_text}>{_i.cur_ratio}</Text>
                                                            <Text style={styles.content_item_text}>{_i.after}</Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })}
                <View style={{margin: Space.marginAlign}}>
                    <Html html={'点击确认购买即代表您已阅读并同意组合基金'} style={styles.tips_sty} />
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    list_head: {
        color: Colors.defaultColor,
        backgroundColor: '#FFF',
        paddingHorizontal: text(15),
        paddingTop: text(18),
        borderColor: '#F5F6F8',
        borderTopWidth: 0.5,
    },
    list_content: {
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        // paddingTop: text(20),
        paddingBottom: text(18),
    },
    circle: {
        width: text(8),
        height: text(8),
        backgroundColor: '#E1645C',
        borderRadius: 50,
        marginRight: text(5),
        marginTop: text(15),
    },
    content_head_title: {
        color: Colors.lightGrayColor,
        fontSize: Font.textH3,
        minWidth: text(60),
        textAlign: 'center',
        paddingTop: text(15),
    },
    content_item_text: {
        color: Colors.descColor,
        fontSize: Font.textH3,
        minWidth: text(60),
        textAlign: 'center',
        paddingTop: text(10),
    },
    tips_sty: {
        color: Colors.lightGrayColor,
        fontSize: text(12),
        margin: 10,
    },
});
