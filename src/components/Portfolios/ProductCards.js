/*
 * @Date: 2022-06-13 14:42:28
 * @Description: v7产品卡片
 */
import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import quot from '~/assets/img/icon/quot.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Chart, chartOptions} from '~/components/Chart';
import {useJump} from '../hooks';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {addProduct} from '~/redux/actions/pk/pkProducts';
import {px} from '~/utils/appUtil';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {debounce} from 'lodash';
import RenderHtml from '~/components/RenderHtml';

const onPressBtn = debounce(
    ({action, dispatch, item_id, item_type = 1}) => {
        if (action === 'do_pk') {
            dispatch(addProduct(item_id));
        } else if (action === 'attention' || action === 'cancel_attention') {
            (action === 'attention' ? followAdd : followCancel)({
                item_id,
                item_type,
            }).then((res) => {
                if (res.code === '000000') {
                    res.message && Toast.show(res.message);
                    DeviceEventEmitter.emit('attentionRefresh');
                }
            });
        }
    },
    500,
    {leading: true, trailing: false}
);

/** @name 基金经理卡片 */
const ManagerCard = () => (
    <View>
        <View style={styles.rowStart}>
            <Image
                source={{
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/05/im_happy_icon.png',
                }}
                style={styles.managerPic}
            />
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{'张鸣 | 大满贯科技股猎手'}</Text>
                </View>
                <View style={[Style.flexRow, {marginTop: px(4)}]}>
                    <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{'3次明星基金奖'}</Text>
                    </View>
                    <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{'近3年回报超300%'}</Text>
                    </View>
                </View>
                <Text style={styles.managerDesc}>{`· 管理规模超100亿\n· 科技领域深耕经验，擅长挖局低估股`}</Text>
            </View>
        </View>
        <View style={[Style.flexBetween, styles.fundBox, {marginTop: px(8)}]}>
            <View>
                <Text style={styles.subTitle}>{'交银品质增长一年混合A'}</Text>
                <View style={[styles.rowEnd, {marginTop: px(4)}]}>
                    <Text style={[styles.profit, {marginRight: px(8)}]}>{'+18.67%'}</Text>
                    <Text style={[styles.label, {marginBottom: Platform.select({android: px(2), ios: 0})}]}>
                        {'近一年收益率'}
                    </Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                <Text style={styles.btnText}>{'PK'}</Text>
            </TouchableOpacity>
        </View>
        <View style={[Style.flexBetween, styles.fundBox]}>
            <View>
                <Text style={styles.subTitle}>{'交银品质增长一年混合A'}</Text>
                <View style={[styles.rowEnd, {marginTop: px(4)}]}>
                    <Text style={[styles.profit, {marginRight: px(8)}]}>{'+18.67%'}</Text>
                    <Text style={[styles.label, {marginBottom: Platform.select({android: px(2), ios: 0})}]}>
                        {'近一年收益率'}
                    </Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                <Text style={styles.btnText}>{'PK'}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

/** @name 私募卡片 */
const PrivateCard = ({data: {data}}) => {
    const jump = useJump();
    return (
        <LinearGradient
            colors={['#FFF7EC', '#FFFFFF']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[Style.flexRow, styles.privateCardBox]}>
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{data.name}</Text>
                </View>
                {data.tags && (
                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                        {data.tags.map((item, idx) => (
                            <View key={idx} style={[styles.tagBox, {borderColor: '#AD9064'}]}>
                                <Text style={[styles.tagText, {color: '#AD9064'}]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={[Style.flexRow, {marginTop: px(12)}]}>
                    {data.yield_info ? (
                        <View style={{flex: 1}}>
                            <HTML style={styles.profit} html={data.yield_info?.value} />
                            <Text style={[styles.label, {marginTop: px(2)}]}>{data.yield_info?.text}</Text>
                        </View>
                    ) : null}
                    {data.nav_info ? (
                        <View style={{flex: 1}}>
                            <HTML style={{...styles.profit, fontSize: px(18)}} html={data.nav_info?.value} />
                            <Text style={[styles.label, {marginTop: px(2)}]}>{data.nav_info?.text}</Text>
                        </View>
                    ) : null}
                </View>
                {data.tip ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexRow, {marginTop: px(12)}]}
                        onPress={() => {
                            jump(data.url);
                        }}>
                        <Text style={styles.jumpText}>{data.tip}</Text>
                        <FontAwesome color={'#AD9064'} name={'angle-right'} size={16} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <FontAwesome color={Colors.descColor} name={'angle-right'} size={16} />
        </LinearGradient>
    );
};

/** @name 榜单卡片 */
const RankCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {button, code, icon, item_type, labels, name, rank, rank_info, tags = [], yield_info} = data;
    return (
        <View style={Style.flexRow}>
            {icon ? (
                <ImageBackground
                    source={{
                        uri: icon,
                    }}
                    style={[Style.flexCenter, styles.rankIcon]}>
                    {rank > 3 && <Text style={styles.rankText}>{rank}</Text>}
                </ImageBackground>
            ) : null}
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{name}</Text>
                    {labels?.length > 0 ? (
                        <View style={{marginLeft: px(8)}}>
                            {labels.map((label, i) => (
                                <HTML html={i === 0 ? label : `| ${label}`} key={label + i} style={styles.desc} />
                            ))}
                        </View>
                    ) : null}
                </View>
                {tags?.length > 0 && (
                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                        {tags.map((tag, i) => (
                            <View key={tag + i} style={styles.tagBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    {yield_info ? (
                        <View>
                            <HTML html={yield_info.value} style={styles.profit} />
                            <Text style={[styles.label, {marginTop: px(2)}]}>{yield_info.text}</Text>
                        </View>
                    ) : null}
                    {rank_info ? (
                        <View>
                            <HTML html={rank_info.value} style={{...styles.profit, color: Colors.defaultColor}} />
                            <Text style={[styles.label, {marginTop: px(2)}]}>{rank_info.text}</Text>
                        </View>
                    ) : null}
                    {button?.text ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={button.avail === 0}
                            onPress={() => onPressBtn({action: button.action, item_id: code, item_type, dispatch})}
                            style={[
                                styles.btnBox,
                                button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                            ]}>
                            <Text style={[styles.btnText, button.avail === 0 ? {color: '#fff'} : {}]}>
                                {isPking ? 'PK中' : button?.text}
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

/** @name 推荐卡片 */
const RecommendCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {
        button,
        chart = [],
        code,
        item_type,
        label: leftLabel = [],
        labels,
        name,
        plan_id,
        reason,
        tags = [],
        yield_info,
        icon_url,
    } = data;
    const btnText = isPking ? 'PK中' : button?.text;
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            chart?.length > 0 && setShowChart(true);
        }, 500);
    }, [chart]);

    return (
        <View>
            <View style={Style.flexRow}>
                <View style={styles.leftPart}>
                    {showChart ? (
                        <Chart
                            data={chart}
                            initScript={chartOptions.smChart(chart)}
                            updateScript={chartOptions.smChart}
                        />
                    ) : null}
                    {leftLabel?.length > 0 && (
                        <>
                            {leftLabel[0] ? (
                                <View style={[Style.flexCenter, styles.leftLabel1]}>
                                    <Text style={styles.leftLabel1Text}>{leftLabel[0]}</Text>
                                </View>
                            ) : null}
                            {leftLabel[1] ? (
                                <View style={[Style.flexCenter, styles.leftLabel2]}>
                                    <Text style={styles.leftLabel2Text}>{leftLabel[1]}</Text>
                                </View>
                            ) : null}
                            {leftLabel[2] ? (
                                <View style={[Style.flexCenter, styles.leftLabel3]}>
                                    <Text style={styles.leftLabel3Text}>{leftLabel[2]}</Text>
                                </View>
                            ) : null}
                        </>
                    )}
                    {!!icon_url && <Image source={{uri: icon_url}} style={{width: px(64), height: px(64)}} />}
                </View>
                <View style={{flex: 1}}>
                    <View style={Style.flexRow}>
                        <Text style={styles.title}>{name}</Text>
                        {labels?.length > 0 ? (
                            <View style={{marginLeft: px(8), flex: 1}}>
                                {labels.map((label, i) => (
                                    <HTML
                                        html={i === 0 ? label : `| ${label}`}
                                        key={label + i}
                                        numberOfLines={1}
                                        style={styles.desc}
                                    />
                                ))}
                            </View>
                        ) : null}
                    </View>
                    {tags?.length > 0 && (
                        <View style={[Style.flexRow, {marginTop: px(4)}]}>
                            {tags.map((tag, i) => (
                                <View key={tag + i} style={styles.tagBox}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                        {yield_info ? (
                            <View style={tags?.length > 0 ? styles.rowEnd : {}}>
                                <HTML html={yield_info.value} style={styles.profit} />
                                <Text
                                    style={[
                                        styles.label,
                                        tags?.length > 0
                                            ? {
                                                  marginBottom: Platform.select({android: px(2), ios: 0}),
                                                  marginLeft: px(8),
                                              }
                                            : {marginTop: px(2)},
                                    ]}>
                                    {yield_info?.text}
                                </Text>
                            </View>
                        ) : null}
                        {button?.text ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={button.avail === 0}
                                onPress={() => {
                                    button?.LogTool?.(['PK', '关注'].includes(btnText));
                                    onPressBtn({action: button.action, item_id: code, item_type, dispatch, plan_id});
                                }}
                                style={[
                                    styles.btnBox,
                                    button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                                ]}>
                                <Text style={[styles.btnText, button.avail === 0 ? {color: '#fff'} : {}]}>
                                    {btnText}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
            {reason ? (
                <View style={styles.recommendBox}>
                    <Image source={quot} style={styles.quot} />
                    <HTML
                        html={`<span style="color: #FF7D41;font-weight: 500;">推荐</span>｜${reason}`}
                        style={styles.recommendText}
                    />
                </View>
            ) : null}
        </View>
    );
};
const ProjectLgCard = ({data, style, tabLabel}) => {
    const jump = useJump();
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            data?.chart_data?.portfolio_lines?.length > 0 && setShowChart(true);
        }, 500);
    }, [data]);

    return (
        <View
            key={data?.title + data?.project_id}
            style={[styles.ProjectLgCard, !data?.list && {marginBottom: px(12), paddingBottom: px(16)}, style]}>
            <TouchableOpacity
                onPress={() => {
                    jump(data?.url);
                    global.LogTool({
                        event: 'rec_click',
                        plateid: data?.plateid,
                        ctrl: tabLabel,
                        oid: data?.project_id,
                    });
                }}
                activeOpacity={0.8}>
                {data?.signal_info ? (
                    <Image
                        source={{
                            uri: data?.signal_info,
                        }}
                        style={[styles.signal_image, {top: 0}]}
                    />
                ) : null}
                <View style={[Style.flexRow, {marginBottom: px(14)}]}>
                    {!!data?.title_left_icon && (
                        <Image
                            source={{uri: data?.title_left_icon}}
                            style={{width: px(18), height: px(18), marginRight: px(6)}}
                        />
                    )}
                    <Text style={{fontSize: px(16), fontWeight: '700'}}>{data?.title}</Text>
                    {!!data?.title_right_icon && (
                        <Image
                            source={{uri: data?.title_right_icon}}
                            style={{height: px(16), width: px(66), marginLeft: px(8)}}
                        />
                    )}
                </View>
                <View style={[Style.flexRow, {flex: 1}]}>
                    <View style={styles.card_left_con}>
                        <View style={{height: px(59), marginBottom: px(8)}}>
                            {showChart ? (
                                <Chart initScript={chartOptions.smChart(data?.chart_data?.portfolio_lines)} />
                            ) : null}
                        </View>
                        <View>
                            <RenderHtml
                                style={{fontSize: px(15), fontFamily: Font.numFontFamily}}
                                html={data?.yield_info?.yield}
                            />
                            <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginTop: px(4)}}>
                                {data?.yield_info?.yield_desc}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.card_right_con}>
                        <View>
                            {data?.sub_title ? (
                                <Text style={{fontSize: px(13), fontWeight: '700', marginBottom: px(8)}}>
                                    {data?.sub_title}
                                </Text>
                            ) : null}
                            <View style={{...Style.flexRow, flexWrap: 'wrap'}}>
                                {data?.signal_list?.map((signal, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            ...Style.flexRow,
                                            ...styles.signal_tag,
                                        }}>
                                        <Image
                                            source={{uri: signal.icon}}
                                            style={{width: px(16), height: px(16), marginRight: px(3)}}
                                        />
                                        <Text style={{fontSize: px(11)}}>{signal?.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        {data?.advantage ? (
                            <View style={styles.advantage}>
                                <RenderHtml
                                    style={{fontSize: px(11), lineHeight: px(15), color: Colors.lightBlackColor}}
                                    html={data?.advantage}
                                />
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
            {/* 小卡片 */}
            {data?.list
                ? data?.list?.map((_list, _index) => (
                      <TouchableOpacity
                          key={_index}
                          style={{paddingTop: px(_index == 0 ? 12 : 0)}}
                          activeOpacity={0.9}
                          onPress={() => {
                              jump(_list?.url);
                              global.LogTool({
                                  event: 'rec_click',
                                  plateid: _list?.plateid,
                                  ctrl: tabLabel,
                                  oid: _list?.project_id,
                              });
                          }}>
                          <View style={[styles.line_circle]}>
                              <View
                                  style={{
                                      ...styles.leftCircle,
                                      left: -px(15),
                                  }}
                              />
                              <View style={{...styles.line}} />
                              <View style={{...styles.leftCircle, right: -px(15)}} />
                          </View>
                          <View key={_index} style={{paddingVertical: px(12)}}>
                              {!!_list?.signal_info && (
                                  <Image source={{uri: _list?.signal_info}} style={styles.signal_image} />
                              )}
                              <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                                  {_list?.title_left_icon && (
                                      <Image
                                          source={{uri: _list?.title_left_icon}}
                                          style={{width: px(16), height: px(16), marginRight: px(6)}}
                                      />
                                  )}
                                  <Text style={{fontSize: px(13), fontWeight: '700'}}>{_list.title}</Text>
                              </View>
                              <RenderHtml
                                  html={_list?.yield_info?.yield}
                                  style={{fontSize: px(17), fontFamily: Font.numFontFamily}}
                              />

                              <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginTop: px(4)}}>
                                  {_list?.yield_info?.yield_desc}
                              </Text>
                          </View>
                      </TouchableOpacity>
                  ))
                : null}
        </View>
    );
};
// 计划资产页小卡片
const ProjectSmCard = ({data = {}}) => {
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            data?.chart_data?.portfolio_lines?.length > 0 && setShowChart(true);
        }, 500);
    }, [data]);

    return (
        <View style={[Style.flexRow, styles.ProjectSmCard]}>
            <View style={{width: px(73), height: px(66)}}>
                {showChart ? <Chart initScript={chartOptions.smChart(data?.chart_data?.portfolio_lines)} /> : null}
            </View>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: px(16), fontWeight: '700'}}>{data?.title}</Text>
                    <View style={{...Style.flexRow, flexWrap: 'wrap'}}>
                        {data?.signal_list?.map((signal, index) => (
                            <View
                                key={index}
                                style={{
                                    ...Style.flexRow,
                                    ...styles.signal_tag,
                                }}>
                                <Image
                                    source={{uri: signal.icon}}
                                    style={{width: px(16), height: px(16), marginRight: px(3)}}
                                />
                                <Text style={{fontSize: px(11)}}>{signal?.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                    <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginRight: px(8)}}>
                        {data?.yield_info?.yield_desc}
                    </Text>
                    <RenderHtml
                        style={{fontSize: px(20), fontFamily: Font.numFontFamily, marginBottom: px(4)}}
                        html={data?.yield_info?.yield}
                    />
                </View>
            </View>
        </View>
    );
};
/** @name 默认卡片 */
const DefaultCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {button, code, item_type, labels, name, rank_info, tags = [], yield_info} = data;
    const btnText = isPking ? 'PK中' : button?.text;
    return (
        <View>
            <View style={Style.flexRow}>
                <Text style={styles.title}>{name}</Text>
                {labels?.length > 0 ? (
                    <View style={{marginLeft: px(8)}}>
                        {labels.map((label, i) => (
                            <HTML html={i === 0 ? label : `| ${label}`} key={label + i} style={styles.desc} />
                        ))}
                    </View>
                ) : null}
            </View>
            {tags?.length > 0 && (
                <View style={[Style.flexRow, {marginTop: px(4)}]}>
                    {tags.map((tag, i) => (
                        <View key={tag + i} style={styles.tagBox}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
            <View style={[Style.flexBetween, {marginTop: px(12), alignItems: 'flex-end'}]}>
                {yield_info ? (
                    <View style={rank_info ? {} : styles.rowEnd}>
                        <HTML html={yield_info.value} style={styles.profit} />
                        <Text
                            style={[
                                styles.label,
                                rank_info
                                    ? {marginTop: px(2)}
                                    : {marginBottom: Platform.select({android: px(2), ios: 0}), marginLeft: px(8)},
                            ]}>
                            {yield_info?.text}
                        </Text>
                    </View>
                ) : null}
                {rank_info ? (
                    <View>
                        <HTML html={rank_info.value} style={{...styles.profit, color: Colors.defaultColor}} />
                        <Text style={[styles.label, {marginTop: px(2)}]}>{rank_info?.text}</Text>
                    </View>
                ) : null}
                {button?.text ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={button.avail === 0}
                        onPress={() => {
                            button?.LogTool?.(['PK', '关注'].includes(btnText));
                            onPressBtn({action: button.action, item_id: code, item_type, dispatch});
                        }}
                        style={[
                            styles.btnBox,
                            button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                        ]}>
                        <Text style={[styles.btnText, button.avail === 0 ? {color: '#fff'} : {}]}>{btnText}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default ({data = {}, style = {}, tabLabel = ''}) => {
    const jump = useJump();
    const outerStyle = Object.prototype.toString.call(style) === '[object Array]' ? style : [style];
    const {code, type, url, LogTool} = data;
    const [isPking, setIsPking] = useState(false);
    const pkProducts = useSelector((store) => store.pkProducts[global.pkEntry]);

    useEffect(() => {
        if (pkProducts.includes(code)) {
            setIsPking(true);
        } else {
            setIsPking(false);
        }
    }, [code, pkProducts]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                LogTool?.();
                setTimeout(() => {
                    jump(url);
                }, 10);
            }}
            style={[type != 'project_lg_card' && type != 'project_sm_card' && styles.cardContainer, ...outerStyle]}>
            {(() => {
                switch (type) {
                    // 基金经理卡片
                    case 'manager_card':
                        return <ManagerCard />;
                    // 私募卡片
                    case 'private_card':
                        return <PrivateCard data={data} />;
                    // 榜单卡片
                    case 'rank_card':
                        return <RankCard data={data} isPking={isPking} />;
                    // 推荐卡片
                    case 'recommend_card':
                        return <RecommendCard data={data} isPking={isPking} />;
                    //计划小卡片
                    case 'project_sm_card':
                        return <ProjectSmCard data={data} />;
                    case 'project_lg_card':
                        return <ProjectLgCard data={data} tabLabel={tabLabel} />;
                    // 默认卡片
                    default:
                        return <DefaultCard data={data} isPking={isPking} />;
                }
            })()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    privateCardBox: {
        margin: -Space.padding,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
    },
    rankIcon: {
        marginRight: px(8),
        width: px(24),
        height: px(24),
    },
    rankText: {
        marginTop: px(2),
        // marginRight: Platform.select({android: px(2), ios: px(1)}),
        fontSize: px(12),
        lineHeight: px(13),
        color: Colors.placeholderColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    leftPart: {
        marginRight: px(10),
        width: px(74),
        height: px(74),
    },
    leftLabel1: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(49),
        height: px(49),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(49),
    },
    leftLabel1Text: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.red,
    },
    leftLabel2: {
        position: 'absolute',
        top: px(22),
        left: px(35),
        width: px(38),
        height: px(38),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(38),
    },
    leftLabel2Text: {
        fontSize: px(8),
        lineHeight: px(13),
        color: Colors.red,
    },
    leftLabel3: {
        position: 'absolute',
        top: px(39),
        left: px(11),
        width: px(34),
        height: px(34),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(34),
    },
    leftLabel3Text: {
        fontSize: px(7),
        lineHeight: px(12),
        color: Colors.red,
    },
    managerPic: {
        marginRight: px(12),
        borderRadius: Space.borderRadius,
        width: px(74),
        height: px(74),
    },
    managerDesc: {
        marginTop: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    title: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        marginLeft: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    tagBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    tagText: {
        fontSize: px(9),
        lineHeight: px(13),
        color: Colors.descColor,
    },
    rowStart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    baseText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    profit: {
        fontSize: Font.textH1,
        lineHeight: px(19),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    label: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightGrayColor,
    },
    fundBox: {
        marginTop: px(12),
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    btnBox: {
        paddingVertical: px(4),
        paddingHorizontal: Space.padding,
        borderRadius: px(100),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.brandColor,
    },
    recommendBox: {
        marginTop: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        backgroundColor: '#FFF5E5',
        position: 'relative',
    },
    quot: {
        width: px(19),
        height: px(15),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    recommendText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    jumpText: {
        marginRight: px(6),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#AD9064',
    },
    ProjectLgCard: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(12),
        paddingVertical: px(16),
    },
    card_left_con: {
        width: px(100),
        // paddingRight: px(6),
        height: '100%',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    card_right_con: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: px(14),
        borderLeftWidth: 0.5,
        borderLeftColor: Colors.lineColor,
        height: '100%',
    },
    advantage: {
        backgroundColor: '#FFF5E5',
        borderRadius: px(4),
        paddingHorizontal: px(8),
        paddingVertical: px(6),
        marginTop: px(8),
    },
    signal_image: {
        position: 'absolute',
        right: px(-12),
        height: px(24),
        width: px(34),
        top: px(14),
    },
    signal_tag: {
        marginRight: px(8),
        backgroundColor: '#F5F6F8',
        borderRadius: px(278),
        paddingRight: px(6),
        paddingVertical: px(3),
        paddingLeft: px(3),
        marginBottom: px(6),
    },
    leftCircle: {
        width: px(10),
        height: px(10),
        backgroundColor: Colors.bgColor,
        borderRadius: px(10),
        position: 'absolute',
    },
    line_circle: {
        ...Style.flexBetween,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    line: {
        backgroundColor: '#E9EAEF',
        height: 0.5,
        flex: 1,
    },
    ProjectSmCard: {
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
        height: px(102),
        marginTop: px(12),
    },
});
