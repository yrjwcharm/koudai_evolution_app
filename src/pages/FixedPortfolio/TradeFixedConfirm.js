/*
 * @Autor: xjh
 * @Date: 2021-01-20 15:37:25
 * @LastEditors: Please set LastEditors
 * @Description: 定投确认页
 * @LastEditTime: 2022-07-26 17:59:35
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
        arr[index] = event.nativeEvent.layout.height;
        this.setState({
            heightArr: arr,
        });
    };
    componentDidMount() {
        Http.get('/trade/fix_invest/result/20210101', {invest_id: this.props.route?.params?.invest_id}).then((res) => {
            this.setState({
                data: res.result,
            });
            this.props.navigation.setOptions({title: res?.result?.title});
        });
    }
    jumpTo = () => {
        this.props.navigation.replace(this.state.data.button?.url?.path, this.state.data.button?.url?.params);
    };
    render() {
        const {data, heightArr} = this.state;
        return (
            <View style={styles.container}>
                {Object.keys(data).length > 0 && (
                    <View style={{paddingHorizontal: text(16)}}>
                        <View style={styles.top_sty}>
                            {data.is_success == true ? (
                                <Ionicons
                                    name={'checkmark-circle'}
                                    color={'#4BA471'}
                                    size={50}
                                    style={{paddingBottom: text(17)}}
                                />
                            ) : (
                                <Ionicons
                                    name={'md-close-circle-sharp'}
                                    color={'#DC4949'}
                                    size={50}
                                    style={{paddingBottom: text(17)}}
                                />
                            )}
                            <Html
                                style={{color: data.is_success ? '#4BA471' : '#DC4949', fontSize: text(16)}}
                                html={data.content}
                            />
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
                                            {_index !== data.items.length - 1 && (
                                                <Text
                                                    style={[
                                                        styles.line_sty,
                                                        {
                                                            height:
                                                                _index == data?.items?.length - 1
                                                                    ? 0
                                                                    : heightArr[_index],
                                                        },
                                                    ]}
                                                />
                                            )}
                                            <View style={styles.list_wrap} key={_index + '_item'}>
                                                <View style={styles.circle_sty} />
                                                <Html style={styles.item_sty} html={_item} />
                                            </View>
                                        </View>
                                    );
                                })}
                            <Button title={data.button.text} style={styles.btn_sty} onPress={this.jumpTo} />
                        </View>
                    </View>
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

    content_sty: {
        paddingTop: text(24),
        paddingBottom: text(28),
        marginHorizontal: text(16),
    },
    circle_sty: {
        width: text(8),
        height: text(8),
        backgroundColor: '#9AA1B2',
        borderRadius: 50,
        zIndex: 4,
        position: 'relative',
        marginRight: text(5),
        marginTop: text(6),
    },
    line_sty: {
        backgroundColor: '#E2E4EA',
        position: 'absolute',
        top: text(18),
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
        alignItems: 'flex-start',
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
