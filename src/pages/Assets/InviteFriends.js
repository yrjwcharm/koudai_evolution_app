/*
 * @Date: 2021-03-02 14:25:55
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-05-08 17:04:32
 * @Description: 邀请好友注册(得魔分)
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {ShareModal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';

const InviteFriends = ({navigation}) => {
    const [activeSections, setActiveSections] = useState([]);
    const [data, setData] = useState({});
    const shareModal = useRef(null);

    const renderHeader = (section, index, isActive) => {
        return (
            <View style={[styles.header, Style.flexBetween]}>
                <Text style={[styles.title, {fontWeight: '500'}]}>{'邀请好友记录'}</Text>
                <Icon name={`${isActive ? 'angle-up' : 'angle-down'}`} size={20} color={Colors.lightGrayColor} />
            </View>
        );
    };
    const renderFooter = (section, index, isActive) => {
        return (
            (data?.invitees?.length === 0 || !data?.invitees) &&
            isActive && (
                <Text
                    style={[
                        styles.moreText,
                        {color: Colors.defaultColor, paddingBottom: text(20), textAlign: 'center'},
                    ]}>
                    {'暂无邀请记录'}
                </Text>
            )
        );
    };
    const renderContent = () => {
        return (
            <View style={{paddingHorizontal: Space.padding, paddingBottom: data.has_more ? 0 : Space.padding}}>
                <View style={[Style.flexRow, styles.tableHead]}>
                    <Text style={[styles.desc, styles.headText, {textAlign: 'left'}]}>{'日期'}</Text>
                    <Text style={[styles.desc, styles.headText]}>{'用户状态'}</Text>
                    <Text style={[styles.desc, styles.headText, {textAlign: 'right'}]}>{'获得魔分'}</Text>
                </View>
                {data?.invitees?.map((item, index) => {
                    return (
                        <View key={`row${index}`} style={[Style.flexRow, {height: text(30)}]}>
                            <Text
                                style={[styles.desc, styles.rowText, {textAlign: 'left', fontFamily: Font.numRegular}]}>
                                {item[0]}
                            </Text>
                            <Text style={[styles.desc, styles.rowText, {flex: 1.5}]}>
                                <Text style={{fontFamily: Font.numRegular}}>{item[1]} </Text>({item[2]})
                            </Text>
                            <Text
                                style={[
                                    styles.desc,
                                    styles.rowText,
                                    {textAlign: 'right', fontFamily: Font.numRegular},
                                ]}>
                                {item[3]}
                            </Text>
                        </View>
                    );
                })}
                {data.has_more && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.moreRecord, Style.flexCenter]}
                        onPress={() => {
                            global.LogTool('click', 'more');
                            navigation.navigate('InviteRecord');
                        }}>
                        <Text style={[styles.moreText]}>{'查看更多'}</Text>
                        <Icon name={'angle-right'} size={20} color={Colors.brandColor} style={{marginLeft: text(4)}} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <TouchableOpacity
                        style={[Style.flexCenter, styles.topRightBtn]}
                        onPress={() => {
                            global.LogTool('click', 'exchange');
                            navigation.navigate('MyScore');
                        }}>
                        <Text style={styles.title}>{'兑换魔分'}</Text>
                    </TouchableOpacity>
                </>
            ),
        });
        http.get('/promotion/invite/summary/20210101').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <Image source={{uri: data.banner}} style={styles.banner} />
            <View style={styles.inviteBox}>
                <Image source={{uri: data.step_image}} style={styles.stepImg} />
                <View style={[Style.flexRow, styles.stepBox]}>
                    {data.steps?.map((step, index) => {
                        return (
                            <Text key={`step${index}`} style={[styles.desc, {width: text(73)}]}>
                                {step}
                            </Text>
                        );
                    })}
                </View>
                <View style={[Style.flexRow, {marginBottom: text(28)}]}>
                    <View style={[Style.flexCenter, {flex: 1}, styles.borderRight]}>
                        <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(11)}]}>
                            <Text style={[styles.numStyle, {marginRight: text(5)}]}>{data.bonus || '0'}</Text>
                            <Text style={[styles.desc, {color: Colors.lightGrayColor, marginBottom: text(3)}]}>
                                {'魔分'}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'累计获得魔分'}</Text>
                    </View>
                    <View style={[Style.flexCenter, {flex: 1}]}>
                        <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(11)}]}>
                            <Text style={[styles.numStyle, {marginRight: text(5)}]}>{data.count || '0'}</Text>
                            <Text style={[styles.desc, {color: Colors.lightGrayColor, marginBottom: text(3)}]}>
                                {'人'}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'累计邀请人数'}</Text>
                    </View>
                </View>
                {/* <TouchableOpacity style={{marginHorizontal: text(32)}}>
                    <HTML
                        html={
                            '<div style="width: 279px;height: 46px;background: linear-gradient(180deg, #FFF0B3 0%, #FFDC77 35%, #FFD666 48%, #FEC340 100%);box-shadow: 0px 4px 8px 0px rgba(248, 178, 24, 0.3);border-radius: 23px;font-size: 18px;line-height: 27px;color: #923808;font-family: SourceHanSansCN-Medium, SourceHanSansCN;font-weight: 500;display: flex;justify-content: center;align-items: center;">邀请好友赚魔分</div>'
                        }
                    />
                </TouchableOpacity> */}
                {/* <Button title={'邀请好友赚魔分'} color={'#FFD666'} style={styles.btn} textStyle={styles.btnText} /> */}
                <TouchableOpacity
                    onPress={() => {
                        global.LogTool('click', 'showShare');
                        shareModal.current.show();
                    }}
                    activeOpacity={0.8}
                    style={[Style.flexCenter, styles.btn, {backgroundColor: '#FFD24D'}]}>
                    <Text style={styles.btnText}>{'邀请好友'}</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: Space.marginAlign}}>
                <Accordion
                    sections={[1]}
                    expandMultiple
                    touchableProps={{activeOpacity: 1}}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    renderFooter={renderFooter}
                    onChange={(active) => setActiveSections(active)}
                    sectionContainerStyle={styles.tableWrap}
                    touchableComponent={TouchableOpacity}
                />
                <Text style={[styles.title, {fontWeight: '500', marginBottom: text(8)}]}>{'邀请规则'}</Text>
                <HTML
                    html={
                        '邀请新用户购买获取魔分红包</br>1、邀请新用户在理财魔方购买智能组合成功，您就可以获取5000魔分红包</br>魔分换申购费</br>2、魔分可兑换从您账户内开始有魔分红包后，所有新产生的新申购费用，兑换比例：100魔分=1元钱。（如您获得魔分后没有投资，请投资后再兑换魔分）</br>3、魔分所兑换金额将发送到您在理财魔方申购基金时绑定银行卡（如绑定有两张或以上的银行卡，将发送到您的主卡中）</br>4、此活动最终解释权归理财魔方所有</br>'
                    }
                    style={styles.rules}
                />
            </View>
            <ShareModal
                ctrl={'invite_friends'}
                ref={shareModal}
                title={'邀请好友'}
                shareContent={data?.share_info || {}}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(64),
        marginRight: text(14),
    },
    banner: {
        width: '100%',
        height: text(189),
        marginBottom: text(-48),
    },
    inviteBox: {
        marginHorizontal: Space.marginAlign,
        marginBottom: Space.marginVertical,
        paddingTop: text(20),
        paddingBottom: text(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    stepImg: {
        width: text(268),
        height: text(56),
        marginBottom: text(4),
    },
    stepBox: {
        marginBottom: text(28),
        paddingHorizontal: text(12),
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: '100%',
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightBlackColor,
        textAlign: 'center',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    numStyle: {
        fontSize: text(28),
        lineHeight: text(32),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    btn: {
        borderRadius: text(8),
        width: text(308),
        height: text(45),
        backgroundColor: '#FFD24D',
        overflow: 'hidden',
    },
    btnText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    tableWrap: {
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        marginBottom: text(28),
    },
    header: {
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(50),
    },
    tableHead: {
        marginBottom: text(3),
        paddingBottom: text(6),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    headText: {
        color: Colors.lightGrayColor,
        flex: 1,
    },
    rowText: {
        color: Colors.lightBlackColor,
        flex: 1,
    },
    rules: {
        fontSize: Font.textH3,
        lineHeight: text(21),
        color: Colors.lightGrayColor,
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

export default InviteFriends;
