/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-19 12:19:22
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-19 15:30:38
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
const deviceWidth = Dimensions.get('window').width;

export default class PrivateCert extends Component {
    constructor() {
        super();
        this.state = {
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
            console.log('---clickBtn');
        }
    };
    render() {
        const {check} = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.card_wrap]}>
                    <Image source={require('../../assets/img/fof/robot.png')} style={styles.robot_sty} />

                    <Text style={styles.card_title}>您好，投资者</Text>
                    <View style={styles.card_content}>
                        <Image source={require('../../assets/img/fof/leading.png')} style={styles.leading_sty} />
                        <Html
                            html={
                                "理财魔方谨遵<span style='color:#D7AF74'>《私募投资基金募集行为管理办》</span>理财魔方谨遵<br>理财魔方谨遵理财魔方谨遵理财魔方谨遵"
                            }
                            style={{lineHeight: 24, color: Colors.darkGrayColor}}
                        />
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
                        <Html
                            style={styles.check_text}
                            html={
                                '本人承诺具备相应风险识别能力和风险承担能相应风险识别能力和风险承担能<br><span style="font-size:12px;color:#4E556C;marginTop:12px">一. 具有2年以上投资经历，且满足以下条</span>'
                            }
                        />
                    </View>
                    <View style={[Style.flexRow, styles.check_nd]}>
                        <CheckBox
                            checked={check[1]}
                            onChange={() => this.onChange(check[1], 1)}
                            color={'#CEA26B'}
                            style={{marginRight: text(5)}}
                        />
                        <Text>本人承诺仅为自己购买私募基金</Text>
                    </View>
                </View>
                <Button
                    title="确认我是合格投资者"
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
