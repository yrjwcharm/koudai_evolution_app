/*
 * @Autor: xjh
 * @Date: 2021-01-19 12:19:22
 * @LastEditors: xjh
 * @Desc:私募合格投资者认证
 * @LastEditTime: 2021-02-22 14:45:08
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
    Dimensions,
} from 'react-native';
import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import CheckBox from '../../components/CheckBox';
import {Button} from '../../components/Button';
import Http from '../../services';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';
const deviceWidth = Dimensions.get('window').width;

export default class PrivateCert extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                title: '私募合格投资者认证',
                desc:
                    '理财魔方谨遵<font class="co">《私募投资基金募集行为管理办法》</font>之规定，只向特定对象宣传推介私募基金。<br>若您有意进行私募投资基金投资，请确认您符合法律法规所规定的投资者标准：',
                items: [
                    {
                        type: 'item1',
                        text:
                            '本人承诺具备相应风险识别能力和风险承担能力，投资于单只产品的金额符合产品合同约定的起投金额的个人：<br>\n<font class="co">（1）具有2年以上投资经历，且满足以下条件之一：家庭金融净资产不低于300万元，家庭金融资产不低于500万元，或者近3年本人年均收入不低于50万元。<br>\n（2）金融管理部门视为合格投资者的其他情形</font>',
                        checked: true,
                    },
                    {
                        type: 'item2',
                        text: '本人承诺仅为自己购买私募基金。',
                        checked: true,
                    },
                ],
                tip: [],
                button: {
                    text: '确认我是合格投资者',
                    url: 'PrivateProduct',
                },
            },
            check: [true, true],
        };
    }
    onChange(check, index) {
        const checkIndex = this.state.check;
        checkIndex[index] = !checkIndex[index];
        this.setState({check: checkIndex});
    }
    clickBtn = () => {
        if (this.state.check[0] && this.state.check[1]) {
            Modal.show({
                title: '风险等级不匹配',
                content: '您的风险评测结果为：XX，本基金的风险等级为XXXX，根据适当性要求，本人主动申请查看该基金内容',
                confirm: true,
                confirmCallBack: () => {
                    this.props.navigation.navigate(this.state.data.button.url);
                },
            });
        } else {
            Toast.show('请勾选协议');
        }
    };
    componentDidMount() {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/pe/validate/20210101').then((res) => {});
    }
    render() {
        const {check, data} = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.card_wrap]}>
                    <Image source={require('../../assets/img/fof/robot.png')} style={styles.robot_sty} />

                    <Text style={styles.card_title}>您好，投资者</Text>
                    <View style={styles.card_content}>
                        <Image source={require('../../assets/img/fof/leading.png')} style={styles.leading_sty} />
                        <Html html={data.desc} style={{lineHeight: 24, color: Colors.darkGrayColor}} />
                    </View>
                </View>
                <View style={styles.card_wrap}>
                    <View
                        style={[Style.flexRow, {alignItems: 'flex-start', paddingBottom: text(15), paddingRight: 16}]}>
                        <CheckBox
                            checked={check[0]}
                            onChange={() => this.onChange(check[0], 0)}
                            color={'#CEA26B'}
                            style={{marginTop: 3, marginRight: text(5)}}
                        />
                        <Html style={styles.check_text} html={data.items[0].text} />
                    </View>
                    <View style={[Style.flexRow, styles.check_nd]}>
                        <CheckBox
                            checked={check[1]}
                            onChange={() => this.onChange(check[1], 1)}
                            color={'#CEA26B'}
                            style={{marginRight: text(5)}}
                        />
                        <Text>{data.items[1].text}</Text>
                    </View>
                </View>
                <Button
                    title={data.button.text}
                    // disabled={btnClick}
                    onPress={() => this.clickBtn()}
                    style={styles.btn_Style}
                    color={'#CEA26B'}
                />
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
        marginVertical: text(26),
        position: 'absolute',
        bottom: 0,
        width: deviceWidth - text(32),
        margin: Space.marginAlign,
        backgroundColor: '#CEA26B',
    },
});
