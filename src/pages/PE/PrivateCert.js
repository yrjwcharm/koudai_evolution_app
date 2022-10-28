/*
 * @Autor: xjh
 * @Date: 2021-01-19 12:19:22
 * @LastEditors: Please set LastEditors
 * @Desc:私募合格投资者认证
 * @LastEditTime: 2022-10-28 16:04:19
 */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import CheckBox from '../../components/CheckBox';
import {FixedButton} from '../../components/Button';
import Http from '../../services';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';

const deviceWidth = Dimensions.get('window').width;

const withMyHook = (Page) => {
    return function WrappedPage(props) {
        const jump = useJump();
        return <Page {...props} jump={jump} />;
    };
};
function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );

    return null;
}

class PrivateCert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            check: [true, true],
            fund_code: props.route?.params?.fund_code || '',
        };
    }

    onChange(check, index) {
        const checkIndex = this.state.check;
        checkIndex[index] = !checkIndex[index];
        this.setState({check: checkIndex});
    }
    clickBtn = () => {
        const {data, check, fund_code} = this.state;
        if (check[0] && (data?.items[1] ? check[1] : true)) {
            if (data.tip) {
                Modal.show({
                    title: data.tip.title,
                    content: data.tip.content,
                    confirm: true,
                    cancelText: data.tip.button[1]?.text,
                    confirmText: data.tip.button[0]?.text,
                    confirmCallBack: () => this.props.jump(data.tip.button[0]?.url),
                });
            } else {
                Http.post('/pe/confirm/20210101', {
                    fund_code: fund_code,
                }).then((res) => {
                    if (res.code === '000000') {
                        this.props.jump(data.button.url, 'replace');
                    }
                });
            }
        } else {
            Toast.show('请勾选协议');
        }
    };
    init = () => {
        Http.get('/pe/validate/20210101', {
            fund_code: this.state.fund_code,
        }).then((res) => {
            this.props.navigation.setOptions({title: res.result?.title});
            this.setState({
                data: res.result,
            });
        });
    };
    render() {
        const {check, data} = this.state;
        return (
            <View style={styles.container}>
                <Focus init={this.init} />
                {Object.keys(data).length > 0 && (
                    <View>
                        <View style={[styles.card_wrap]}>
                            <Image source={require('../../assets/img/fof/robot.png')} style={styles.robot_sty} />

                            <Text style={styles.card_title}>您好，投资者</Text>
                            <View style={styles.card_content}>
                                <Image
                                    source={require('../../assets/img/fof/leading.png')}
                                    style={styles.leading_sty}
                                />
                                <Html html={data?.desc} style={{lineHeight: 24, color: Colors.darkGrayColor}} />
                            </View>
                        </View>
                        <View style={styles.card_wrap}>
                            <View
                                style={[
                                    Style.flexRow,
                                    {alignItems: 'flex-start', paddingBottom: text(15), paddingRight: 16},
                                ]}>
                                <CheckBox
                                    checked={check[0]}
                                    onChange={() => this.onChange(check[0], 0)}
                                    color={'#CEA26B'}
                                    style={{marginTop: 3, marginRight: text(5)}}
                                />
                                <Html style={styles.check_text} html={data?.items[0]?.text} />
                            </View>
                            {!!data?.items[1] && (
                                <View style={[Style.flexRow, styles.check_nd]}>
                                    <CheckBox
                                        checked={check[1]}
                                        onChange={() => this.onChange(check[1], 1)}
                                        color={'#CEA26B'}
                                        style={{marginRight: text(5)}}
                                    />
                                    <Text style={{lineHeight: text(18)}}>{data?.items[1]?.text}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                {Object.keys(data).length > 0 && (
                    <FixedButton
                        title={data.button.text}
                        onPress={() => this.clickBtn()}
                        style={styles.btn_Style}
                        color={'#CEA26B'}
                    />
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        padding: Space.padding,
    },
    card_wrap: {
        backgroundColor: '#fff',
        padding: Space.padding,
        borderRadius: text(10),
        width: '100%',
        marginTop: text(17),
    },
    card_title: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: text(-30),
    },
    leading_sty: {
        width: text(20),
        height: text(20),
        marginRight: text(5),
    },
    card_content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingRight: text(16),
        marginTop: text(28),
    },
    robot_sty: {
        width: text(86),
        height: text(86),
        position: 'absolute',
        top: text(-30),
        left: text(8),
    },
    check_text: {
        lineHeight: 24,
        color: Colors.defaultColor,
    },
    check_nd: {
        paddingTop: text(15),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    btn_Style: {
        // marginVertical: text(26),
        // position: 'absolute',
        // bottom: 0,
        // width: deviceWidth - text(32),
        // margin: Space.marginAlign,
        backgroundColor: '#CEA26B',
    },
});

export default withMyHook(PrivateCert);
