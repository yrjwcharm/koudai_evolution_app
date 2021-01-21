/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-20 15:37:25
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-21 11:55:19
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

// checkmark-circle  close-circle-sharp   circle-thin
export default class TradeFixedConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: '',
            data: [
                '第一笔定投扣款将在 XX月XX日进行',
                '第一笔定投扣款将在 XX月XX日进行',
                '第一笔定投扣款将在 XX月XX日进行(XX月XX日进行)',
                '第一笔定投扣款将在 XX月XX日进行',
            ],
        };
    }
    onLayout = (event) => {
        const viewHeight = event.nativeEvent.layout.height;
        this.setState({
            viewHeight: viewHeight,
        });
    };

    render() {
        const {data, viewHeight} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.top_sty}>
                    <Ionicons name={'checkmark-circle'} color={'#4BA471'} size={50} />
                    <Text style={styles.title_sty}>您的定投计划设置成功！</Text>
                </View>
                <View style={styles.content_sty}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginTop: 15}}>
                            {data.map((_item, _index) => {
                                return (
                                    <View style={{flexDirection: 'row', alignItems: 'baseline'}} key={_index + '_item'}>
                                        <View style={Style.columnAlign}>
                                            <View style={styles.circle_sty}></View>
                                            <Text
                                                style={[
                                                    styles.line_sty,
                                                    {height: _index == data.length - 1 ? 0 : 20},
                                                ]}></Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                            {data.map((_item, _index) => {
                                return (
                                    <Text style={styles.item_sty} onLayout={(event) => this.onLayout(event)}>
                                        {_item}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>
                </View>
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
        paddingTop: text(17),
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
    },
    line_sty: {
        backgroundColor: '#E2E4EA',
        width: text(1),
        height: 'auto',
    },
    item_sty: {
        fontSize: text(13),
        color: '#545968',
        // height: text(38),
        // paddingVertical: text(10),
        lineHeight: text(20),
        marginLeft: text(16),
    },
});
