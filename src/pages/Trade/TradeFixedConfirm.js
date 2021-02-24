/*
 * @Autor: xjh
 * @Date: 2021-01-20 15:37:25
 * @LastEditors: xjh
 * @Description: 定投确认页
 * @LastEditTime: 2021-02-24 18:56:31
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Linking,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    findNodeHandle,
} from 'react-native';

import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '../../components/Button';
import Http from '../../services';
export default class TradeFixedConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: '',
            data: {},
            heightArr: [],
        };
    }
    onLayout = (index, event) => {
        const arr = [...this.state.heightArr];
        const {data} = this.state;
        arr[index] = event.nativeEvent.layout.height;
        console.log(data);
        this.setState({
            heightArr: arr,
        });
    };
    componentDidMount() {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/trade/fix_invest/result/20210101', {}).then(
            (res) => {
                this.setState({
                    data: res.result,
                });
            }
        );
    }
    jumpTo() {
        this.props.navigation.navigate(data.button.url);
    }
    render() {
        const {data, viewHeight, heightArr} = this.state;
        return (
            <View style={styles.container}>
                {Object.keys(data).length > 0 && (
                    <>
                        <View style={styles.top_sty}>
                            <Ionicons
                                name={'checkmark-circle'}
                                color={'#4BA471'}
                                size={50}
                                style={{paddingBottom: text(17)}}
                            />
                            <Html style={styles.title_sty} html={data.content} />
                        </View>
                        <View style={styles.content_sty}>
                            {data.is_success == false && <Text style={styles.desc_sty}>{data.items}</Text>}
                            {data.items.length > 0 &&
                                data.items.map((_item, _index) => {
                                    return (
                                        <View
                                            style={{flexDirection: 'row'}}
                                            onLayout={(event) => this.onLayout(_index, event)}
                                            key={_index + '_item'}>
                                            <View style={styles.list_wrap} key={_index + '_item'}>
                                                <View style={styles.circle_sty} />
                                                <Html style={styles.item_sty} html={_item} />
                                            </View>

                                            {_index !== data.items.length - 1 && (
                                                <Text
                                                    style={[
                                                        styles.line_sty,
                                                        {
                                                            height: heightArr[_index]
                                                                ? text(heightArr[_index] - 5)
                                                                : text(31),
                                                        },
                                                    ]}
                                                />
                                            )}
                                        </View>
                                    );
                                })}
                            <Button title={data.button.text} style={styles.btn_sty} onPress={this.jumpTo} />
                        </View>
                    </>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    top_sty: {
        paddingTop: text(35),
        paddingBottom: text(28),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: '#E2E4EA',
    },
    title_sty: {
        color: '#4BA471',
        fontSize: Font.textH1,
    },
    content_sty: {
        paddingTop: text(24),
        paddingBottom: text(28),
        marginHorizontal: text(31),
    },
    circle_sty: {
        width: text(7),
        height: text(7),
        backgroundColor: '#9AA1B2',
        borderRadius: 50,
        zIndex: 4,
        position: 'relative',
        marginRight: text(5),
    },
    line_sty: {
        backgroundColor: '#E2E4EA',
        position: 'absolute',
        top: text(15),
        left: text(3.5),
        width: text(1),
        zIndex: -1,
    },
    item_sty: {
        fontSize: text(13),
        color: '#545968',
        lineHeight: text(20),
        marginLeft: text(16),
    },
    list_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    btn_sty: {
        marginTop: text(28),
        marginHorizontal: text(12),
    },
    desc_sty: {
        color: '#545968',
        fontSize: text(13),
        lineHeight: text(20),
    },
});
