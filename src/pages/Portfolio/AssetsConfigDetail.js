/*
 * @Author: dx
 * @Date: 2021-01-15 18:29:42
 * @LastEditTime: 2021-10-22 11:48:55
 * @LastEditors: yhc
 * @Description: 资产配置详情
 * @FilePath: /koudai_evolution_app/src/pages/Detail/AssetsConfigDetail.js
 */
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput as Input} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';
import Loading from './components/PageLoading';
import {useFocusEffect} from '@react-navigation/native';

const RatioColor = [
    '#E1645C',
    '#5687EB',
    '#ECB351',
    '#CC8FDD',
    '#E4C084',
    '#5DC162',
    '#DE79AE',
    '#967DF2',
    '#62B4C7',
    '#B8D27E',
    '#F18D60',
    '#5E71E8',
    '#EBDD69',
];

function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );
    return null;
}

export class AssetsConfigDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: props.route?.params?.amount || '2000',
            activeSections: [],
            data: {},
        };
    }
    componentDidMount() {
        this.init();
    }
    init = () => {
        const {amount} = this.state;
        const {poid, upid, scene} = this.props.route.params || {};

        Http.get(scene === 'adviser' ? '/adviser/asset_deploy/20210923' : '/portfolio/asset_deploy/20210101', {
            amount,
            poid,
            upid,
        }).then((res) => {
            if (res.code === '000000') {
                this.setState({data: res.result});
                if (this.props.route.params.scene === 'adviser') {
                    this.props.navigation.setOptions({title: '持仓分布页'});
                } else {
                    this.props.navigation.setOptions({title: res.result.title || '资产配置详情'});
                }
            }
        });
        // http.get('/portfolio/asset_deploy/20210101', {
        //     amount,
        //     alloc_id,
        //     upid,
        // }).then((res) => {
        //     this.setState({data: res.result});
        //     this.props.navigation.setOptions({title: res.result.title});
        // });
    };
    // 点击快捷输入投资金额
    onLable = (amount) => {
        this.setState({amount}, () => this.init());
    };
    // 输入投资金额回调
    onChange = (val) => {
        val = val.replace(/\D/g, '');
        val = val * 1 > 10000000 ? '10000000' : val;
        this.setState({amount: val}, () => val >= 2000 && this.init());
    };
    // 手风琴展开回调
    updateSections = (activeSections) => {
        this.setState({activeSections});
    };
    // 手风琴内容渲染
    renderContent = (section) => {
        return (
            <>
                {section.items &&
                    section.items.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={item.code}
                                onPress={() => this.props.navigation.navigate('FundDetail', {code: item.code})}
                                style={[styles.assets_l2, Style.flexBetween]}>
                                <View>
                                    <Text style={[styles.assets_l2_name]}>{item.name}</Text>
                                    <Text style={[styles.assets_l2_code]}>{item.code}</Text>
                                </View>
                                <View style={[styles.assets_l2_right, {flexDirection: 'row'}]}>
                                    {item.amount ? (
                                        <Text style={[styles.assets_l2_amount, styles.assets_l2_right]}>
                                            {item.amount.toFixed(2)}
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.assets_l2_ratio, styles.assets_l2_right]}>{`${(
                                        item.ratio * 100
                                    ).toFixed(2)}%`}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
            </>
        );
    };
    // 手风琴头部渲染
    renderHeader = (section, index, isActive) => {
        return (
            <View style={[styles.assets_l1, Style.flexBetween, {borderTopWidth: index === 0 ? 0 : Space.borderWidth}]}>
                <View style={[styles.leftPart, Style.flexRow]}>
                    <View style={[styles.circle, {backgroundColor: section.color || RatioColor[index]}]} />
                    <Text style={[styles.assets_l1_name]}>{section.name}</Text>
                </View>
                <View style={[styles.rightPart, Style.flexRow]}>
                    {section.amount ? (
                        <Text style={[styles.assets_l1_amount, styles.rightPart]}>{section.amount.toFixed(2)}</Text>
                    ) : null}
                    <Text style={[styles.assets_l1_ratio, styles.rightPart]}>
                        {`${(section.ratio * 100).toFixed(2)}%`}
                    </Text>
                    <FontAwesome color={Colors.descColor} size={20} name={isActive ? 'angle-up' : 'angle-down'} />
                </View>
            </View>
        );
    };
    render() {
        const {amount, activeSections, data} = this.state;
        const {invest_form, deploy_title, deploy_content, deploy_detail, btns} = data;
        return (
            <>
                {Object.keys(data).length > 0 ? (
                    <ScrollView style={styles.container}>
                        <Focus init={this.init} />
                        {this.props.route.params.scene !== 'adviser' ? (
                            <View style={styles.topPart}>
                                <View style={[Style.flexBetween, {flexDirection: 'row'}]}>
                                    <Text style={[styles.lableTitle]}>{invest_form.title}</Text>
                                    <View style={[Style.flexRow]}>
                                        {invest_form.label.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    key={item.title}
                                                    style={[styles.lable]}
                                                    onPress={() => this.onLable(`${item.val}`)}>
                                                    <Text style={[styles.lableText]}>{item.title}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                                <View style={{position: 'relative'}}>
                                    <Input
                                        keyboardType="numeric"
                                        value={amount}
                                        // placeholder={invest_form.placeholder}
                                        // placeholderTextColor={Colors.placeholderColor}
                                        onChangeText={this.onChange}
                                        ref={(ref) => (this.inputRef = ref)}
                                        style={[styles.input]}
                                    />
                                    {`${amount}`.length === 0 && (
                                        <TouchableOpacity
                                            style={{position: 'absolute', left: text(18), top: text(28)}}
                                            activeOpacity={1}
                                            onPress={() => this.inputRef.focus()}>
                                            <Text style={styles.placeholder}>{invest_form.placeholder}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={[styles.percent_bar, Style.flexRow]}>
                                    {deploy_detail.map((item, index) => (
                                        <View
                                            key={item.type}
                                            style={[
                                                styles.barPart,
                                                {
                                                    backgroundColor: RatioColor[index],
                                                    width: `${(item.ratio * 100).toFixed(2)}%`,
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                                {deploy_title && deploy_content ? (
                                    <Text style={[styles.deploy_text]}>
                                        <Text style={[styles.deploy_title]}>{deploy_title}</Text>
                                        <Text style={[styles.deploy_content]}>{deploy_content}</Text>
                                    </Text>
                                ) : null}
                            </View>
                        ) : null}
                        <View style={[styles.deploy_detail]}>
                            <Accordion
                                activeSections={activeSections}
                                expandMultiple
                                onChange={this.updateSections}
                                renderContent={this.renderContent}
                                renderHeader={this.renderHeader}
                                sections={deploy_detail}
                                touchableComponent={TouchableOpacity}
                                touchableProps={{activeOpacity: 1}}
                            />
                        </View>
                        <BottomDesc />
                    </ScrollView>
                ) : (
                    <Loading />
                )}
                {Object.keys(data).length > 0 && btns && <FixedBtn btns={btns} />}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        paddingHorizontal: Space.marginAlign,
        paddingTop: text(24),
        paddingBottom: text(12),
        backgroundColor: '#fff',
    },
    lableTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    lable: {
        paddingHorizontal: text(12),
        paddingVertical: text(4),
        backgroundColor: '#F1F6FF',
        borderRadius: text(12),
        marginLeft: text(8),
    },
    lableText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
    },
    input: {
        height: text(50),
        fontSize: text(18),
        borderWidth: text(1),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.inputBg,
        color: Colors.defaultColor,
        borderRadius: Space.borderRadius,
        marginVertical: text(12),
        padding: 0,
        paddingHorizontal: Space.marginAlign,
        fontFamily: Font.numMedium,
    },
    percent_bar: {
        marginBottom: text(8),
        width: '100%',
        height: text(24),
    },
    barPart: {
        height: '100%',
    },
    deploy_text: {
        fontSize: text(13),
        lineHeight: text(22),
        textAlign: 'justify',
    },
    deploy_title: {
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    deploy_content: {
        color: Colors.darkGrayColor,
    },
    deploy_detail: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingHorizontal: Space.marginAlign,
    },
    assets_l1: {
        height: text(50),
        borderTopColor: Colors.borderColor,
        borderStyle: 'solid',
        flexDirection: 'row',
    },
    circle: {
        width: text(12),
        height: text(12),
        borderRadius: text(6),
        marginRight: text(8),
    },
    assets_l1_name: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
    },
    rightPart: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.descColor,
        fontFamily: Font.numMedium,
    },
    assets_l1_amount: {
        marginRight: text(12),
    },
    assets_l1_ratio: {
        textAlign: 'right',
        marginRight: text(12),
        width: text(48),
    },
    assets_l2: {
        flexDirection: 'row',
        height: text(49),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
        borderStyle: 'solid',
        paddingRight: text(24),
    },
    assets_l2_name: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.descColor,
        marginBottom: text(4),
    },
    assets_l2_code: {
        fontSize: Font.textSm,
        lineHeight: text(12),
        color: Colors.darkGrayColor,
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    assets_l2_right: {
        fontSize: Font.textH3,
        lineHeight: text(16),
        color: Colors.descColor,
        fontWeight: '500',
        fontFamily: Font.numMedium,
    },
    assets_l2_ratio: {
        textAlign: 'right',
        width: text(44),
    },
    assets_l2_amount: {
        marginRight: text(18),
    },
    placeholder: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.placeholderColor,
    },
});
export default AssetsConfigDetail;
