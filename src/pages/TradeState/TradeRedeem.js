/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-19 13:25:44
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    TabBarIOS,
    Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px as text} from '../../utils/appUtil';
import {Space, Style, Colors, Font} from '../../common/commonStyle';
import Radio from '../../components/Radio';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Table from '../../components/Table';
import {Button} from '../../components/Button';
const deviceWidth = Dimensions.get('window').width;
export default class TradeRedeem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            check: [false, false],
            inputValue: '',
            toggleList: false,
            btnClick: true,
            data: [
                {
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_jy_yhk@2x.png',
                    title: '银行卡',
                },
                {
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_jy_yhk@2x.png',
                    title: '魔方宝',
                    desc: '七日年化2.93%',
                },
            ],
            options: [
                {percent: 0.05, text: '5%'},
                {percent: 0.1, text: '10%'},
                {percent: 0.2, text: '20%'},
                {percent: 0.3, text: '30%'},
            ],
            tableData: {
                head: {percent: '当前持仓金额', amount: '赎回金额'},
                body: [
                    {name: '货币', percent: '20', amount: '3.45'},
                    {name: '货币', percent: '20', amount: '3.45'},
                    {name: '货币', percent: '20', amount: '3.45'},
                ],
            },
        };
    }
    radioChange(index) {
        let check = this.state.check;
        // const lastIndex = check.indexOf(true);
        check = check.map((item) => false);
        // if (index !== lastIndex) {
        //     check[index] = true;
        // }
        check[index] = true;
        this.setState({
            check,
        });
    }
    pressChange(percent) {
        this.setState({
            inputValue: (percent * 100).toString(),
        });
    }
    toggleFund() {
        const toggleList = this.state.toggleList;
        this.setState({
            toggleList: !toggleList,
        });
    }
    render() {
        const {data, tableData, toggleList, btnClick} = this.state;
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <Text style={styles.redeem_desc}>赎回至银行卡</Text>
                    {!!data.length > 0 &&
                        data.map((_item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        Style.flexRow,
                                        styles.card_item,
                                        styles.card_select,
                                        {
                                            borderBottomWidth: index < data.length - 1 ? 0.5 : 0,
                                            borderColor: Colors.borderColor,
                                        },
                                    ]}>
                                    <View style={[Style.flexRow, {flex: 1}]}>
                                        <FastImage
                                            style={{width: 24, height: 24}}
                                            source={{
                                                uri: _item.icon,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text style={{color: Colors.descColor, paddingLeft: text(10)}}>
                                            {_item.title}
                                        </Text>
                                        <Text style={{color: '#DC4949', paddingLeft: text(10)}}>{_item.desc}</Text>
                                    </View>
                                    <Radio
                                        checked={this.state.check[index]}
                                        index={index}
                                        onChange={() => this.radioChange(index)}></Radio>
                                </View>
                            );
                        })}
                    <View style={styles.card_wrap}>
                        <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                            <Text style={{fontSize: Font.textH1, color: '#1F2432'}}>赎回比例</Text>
                            <View style={Style.flexRow}>
                                {this.state.options.map((_i, _d) => {
                                    return (
                                        <TouchableOpacity
                                            style={styles.btn_percent}
                                            key={_d + _i}
                                            onPress={() => this.pressChange(_i.percent)}>
                                            <Text style={{color: '#0051CC'}}>{_i.text}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        <View
                            style={[
                                Style.flexRow,
                                {marginTop: text(12), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                            ]}>
                            <TextInput
                                style={{height: text(50), fontSize: text(26), flex: 1, textAlign: 'center'}}
                                placeholder="请输入赎回百分比"
                                value={this.state.inputValue}
                            />
                            <Text style={styles.percent_symbol}>%</Text>
                        </View>
                        <TouchableOpacity
                            style={[Style.flexRow, {marginTop: text(17)}]}
                            onPress={() => this.toggleFund()}
                            activeOpacity={1}>
                            <Text style={{color: '#1F2432', fontSize: Font.textH2, flex: 1}}>查看持有基金</Text>
                            <AntDesign name={toggleList ? 'down' : 'up'} size={12} color={'#9095A5'} />
                        </TouchableOpacity>
                        {toggleList && <Table data={tableData} />}
                    </View>
                </ScrollView>
                <Button
                    title="确认赎回"
                    // disabled={btnClick}
                    style={styles.btn_Style}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    redeem_desc: {
        color: Colors.descColor,
        fontSize: Font.placeholderFont,
        paddingVertical: text(12),
        paddingLeft: text(15),
    },
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: text(15),
        paddingRight: text(10),
    },
    card_item: {
        flex: 1,
        paddingVertical: text(16),
    },
    card_wrap: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
    },
    btn_percent: {
        borderRadius: text(10),
        backgroundColor: '#F1F6FF',
        paddingHorizontal: text(8),
        paddingVertical: text(3),
        marginLeft: text(10),
    },
    percent_symbol: {
        fontSize: text(20),
        color: '#333',
        width: text(20),
        fontWeight: 'bold',
    },
    btn_Style: {
        marginVertical: text(26),
        position: 'absolute',
        bottom: 0,
        width: deviceWidth - text(32),
        margin: Space.marginAlign,
    },
});
