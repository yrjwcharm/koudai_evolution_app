/*
 * @Date: 2022-03-24 16:13:33
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-25 19:37:52
 * @Description:风险等级调整工具
 */
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AdjustSlider from '../../components/AdjustSlider';
import {isIphoneX, px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import http from '../../services';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo';
import RenderHtml from '../../components/RenderHtml';
import LoadingTips from '../../components/LoadingTips';
const themeColor = '#2B7AF3';
const Title = ({title}) => {
    return (
        <View style={[styles.title_con, Style.flexRow]}>
            <View style={styles.title_tag} />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};
//每个step的高度
const Steps = ({data, style}) => {
    const [stepHeight, setStepHeight] = useState([]);
    const onLayout = (evt, index) => {
        const {height} = evt.nativeEvent.layout;
        const arr = [...stepHeight];
        arr[index] = height;
        setStepHeight(arr);
    };
    return (
        <View style={style}>
            {data?.map((item, index) => {
                return (
                    <View
                        key={index}
                        style={{flexDirection: 'row'}}
                        onLayout={(e) => {
                            onLayout(e, index);
                        }}>
                        <>
                            <View style={styles.circle} />
                            <View style={[styles.line, {height: index == data.length - 1 ? 0 : stepHeight[index]}]} />
                        </>

                        <View style={{marginBottom: px(16), flex: 1}}>
                            <Text style={styles.steps_title}>{item.title}</Text>
                            <Text style={styles.steps_desc}>{item.desc}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
//table
const Table = ({data, risk, style, current_risk}) => {
    const table_data = data?.filter((item) => item.value == risk);
    return table_data?.length && table_data[0] > 0 ? (
        <View style={{paddingBottom: px(20)}}>
            <View style={[{flexDirection: 'row', alignItems: 'flex-start'}, style]}>
                <View style={styles.column}>
                    <View style={[{backgroundColor: '#F7F8FA', height: px(40)}, Style.flexRow]}>
                        <Text style={{flex: 1}} />
                        <Text style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>当前等级{current_risk}</Text>
                    </View>
                    {Object.values(table_data[0]?.table)?.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={[
                                    Style.flexRow,
                                    {backgroundColor: index % 2 == 0 ? '#fff' : '#F7F8FA', height: px(40)},
                                ]}>
                                <Text style={{flex: 1, textAlign: 'center', color: '#0B1E3E'}}>{item.key}</Text>
                                <Text style={styles.numMedium}>{item.value}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.floatColumn}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={['rgba(214, 229, 255, 1)', 'rgba(245, 249, 255, 1)']}
                        style={[Style.flexRowCenter, {height: px(44), paddingTop: px(4), borderRadius: px(4)}]}>
                        <Text>
                            调后
                            <Text style={{color: themeColor}}>等级{risk != current_risk ? risk : '-'}</Text>
                        </Text>
                    </LinearGradient>
                    {Object.values(table_data[0]?.table)?.map((item, index) => {
                        const length = Object.values(table_data[0]?.table)?.length;
                        return (
                            <View
                                key={index}
                                style={[
                                    Style.flexRowCenter,
                                    {
                                        height: index == length - 1 ? px(44) : px(40),
                                        borderRadius: index == length - 1 ? px(4) : 0,
                                        backgroundColor: index % 2 == 0 ? '#fff' : '#F5F9FF',
                                    },
                                ]}>
                                <Text style={{fontSize: px(14), fontFamily: Font.numMedium, color: themeColor}}>
                                    {item?.comp?.updown != '-' ? item?.comp?.diff : '-'}
                                </Text>
                                {item?.comp?.updown != '-' ? (
                                    <Icon
                                        name={`arrow-long-${item?.comp?.updown}`}
                                        color={item?.comp?.updown == 'down' ? Colors.green : Colors.red}
                                    />
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </View>
            {/* {table_data[0]?.card?.content ? (
                <View style={styles.table_card}>
                    <RenderHtml
                        html={table_data[0]?.card?.content}
                        style={{fontSize: px(13), lineHeight: px(20), color: Colors.lightBlackColor}}
                    />
                </View>
            ) : null} */}
        </View>
    ) : null;
};
const RiskAdjustTool = ({route, navigation}) => {
    const [data, setData] = useState();
    const [adjustRisk, setAdjustRisk] = useState();
    const getInfo = () => {
        http.get(
            'http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/tool/riskchange/detail/20220323?uid=1010011225'
        ).then((res) => {
            navigation.setOptions({title: route?.params?.title || '风险等级调整工具'});
            setAdjustRisk(res.result?.current_risk);
            setData(res.result);
        });
    };
    useEffect(() => {
        getInfo();
    }, []);
    const onChange = (value) => {
        setAdjustRisk(value);
    };

    return data ? (
        <>
            <ScrollView>
                <LinearGradient
                    colors={['#FFFFFF', '#F5F6F8']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.4}}
                    style={styles.con}>
                    <View style={[styles.name_con, Style.flexRowCenter]}>
                        <View>
                            <Text style={styles.name}>{data?.head?.name}</Text>
                            <Text style={styles.name_desc}>{data?.head?.desc}</Text>
                        </View>
                        {data?.current_risk != adjustRisk ? (
                            <>
                                <Animatable.Image
                                    animation={'fadeIn'}
                                    source={require('../../assets/img/icon/arrowRight.png')}
                                    style={styles.arrow_right_image}
                                />
                                <Animatable.View animation={'fadeInLeft'}>
                                    <Text style={[styles.name, {color: '#2B7AF3'}]}>等级{adjustRisk}</Text>
                                    <Text style={styles.name_desc}>{'调整后风险等级'}</Text>
                                </Animatable.View>
                            </>
                        ) : null}
                    </View>
                    <View style={styles.card}>
                        <Title title="基础数据对比" />
                        <Table
                            data={data?.table_data}
                            risk={adjustRisk}
                            style={{marginTop: px(30)}}
                            current_risk={data?.current_risk}
                        />
                    </View>
                    <View style={styles.card}>
                        <Title title={data?.body?.part3?.title} />
                        <Steps style={styles.steps_con} data={data?.body?.part3?.data?.step} />
                    </View>
                    {data?.body?.part3?.data?.tips ? (
                        <Text style={[styles.steps_desc, {marginTop: px(-4)}]}>{data?.body?.part3?.data?.tips}</Text>
                    ) : null}
                </LinearGradient>
            </ScrollView>
            <Animatable.View animation={'fadeInUp'} style={{borderTopWidth: 0.5, borderTopColor: '#E2E4EA'}}>
                <AdjustSlider
                    value={data?.current_risk}
                    minimumValue={data?.table_data[0]?.value}
                    maximumValue={data?.table_data[data?.table_data?.length - 1]?.value}
                    onChange={onChange}
                />
                <Button style={{marginBottom: isIphoneX() ? px(8) + 34 : px(8), marginHorizontal: px(16)}} />
            </Animatable.View>
        </>
    ) : (
        <LoadingTips />
    );
};

export default RiskAdjustTool;

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(16),
    },
    card: {
        paddingHorizontal: px(16),
        borderRadius: px(6),
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: px(16),
    },
    name_con: {
        marginVertical: px(30),
    },
    name: {
        fontSize: px(28),
        lineHeight: px(32),
        color: Colors.lightBlackColor,
        textAlign: 'center',
        fontWeight: '700',
    },
    arrow_right_image: {
        width: px(63),
        height: px(8),
        marginHorizontal: px(20),
    },
    name_desc: {
        color: Colors.lightBlackColor,
        fontSize: px(12),
        marginTop: px(8),
        textAlign: 'center',
    },
    title_con: {
        height: px(55),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    title: {
        fontSize: px(16),
        fontWeight: '700',
        color: '#121D3A',
    },
    title_tag: {
        width: px(3),
        height: px(16),
        backgroundColor: '#2B7AF3',
        marginRight: px(4),
    },
    steps_con: {marginVertical: px(16)},
    steps_title: {
        color: Colors.defaultColor,
        fontWeight: '700',
        fontSize: px(13),
        lineHeight: px(18),
        marginBottom: px(4),
    },
    steps_desc: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(19),
    },
    line: {
        width: px(1),
        backgroundColor: '#E2E4EA',
        marginLeft: px(3),
        position: 'absolute',
        top: px(12),
    },
    circle: {
        width: px(6),
        height: px(6),
        borderRadius: px(3),
        backgroundColor: Colors.defaultColor,
        marginRight: px(12),
        position: 'relative',
        zIndex: 10,
        marginTop: px(5),
    },
    numMedium: {
        flex: 1,
        textAlign: 'center',
        fontSize: px(14),
        fontFamily: Font.numMedium,
    },
    floatColumn: {
        marginTop: px(-4),
        width: px(96),
        borderRadius: px(4),
        shadowColor: '#0051CC',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 20,
        shadowOpacity: 0.2,
    },
    column: {
        flex: 1,
        borderWidth: px(0.5),
        borderRightWidth: 0,
        borderColor: '#F7F8FA',
        borderBottomLeftRadius: px(6),
        borderTopLeftRadius: px(6),
    },
    table_card: {
        marginTop: px(20),
        backgroundColor: '#F5F6F8',
        padding: px(16),
        borderRadius: px(6),
    },
});
