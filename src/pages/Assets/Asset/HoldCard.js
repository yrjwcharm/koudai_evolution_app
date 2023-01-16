/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Image from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {BottomModal} from '~/components/Modal';
import {postAssetClass} from './service';
import {fromJS} from 'immutable';
import TagInfo from '../components/TagInfo';
import RenderAlert from '../components/RenderAlert';
import Icon from 'react-native-vector-icons/Entypo';
import AssetCard from '../components/AssetCard';
import {useSelector} from 'react-redux';
const ClassCard = ({data = {}, showEye, expand}) => {
    const jump = useJump();
    const {name, number, remind_info, tag_info, indicators, icon, url, child, child_header_list} = data;
    return (
        <>
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        marginBottom: child?.length && expand > 0 ? 0 : px(12),
                    },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                    if (tag_info?.log_id) {
                        global.LogTool('guide_click', '卡片标签', tag_info.log_id);
                    }
                    global.LogTool('product_type', data?.log_id);
                    jump(url);
                }}>
                {name && (
                    <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                        {!!icon && (
                            <Image source={{uri: icon}} style={{width: px(16), height: px(16), marginRight: px(3)}} />
                        )}
                        <Text style={{fontSize: px(12), fontWeight: '700'}}>
                            {name}({number})
                        </Text>
                        {!!tag_info && <TagInfo data={tag_info} />}
                        <Icon
                            name="chevron-thin-right"
                            color={Colors.lightBlackColor}
                            size={px(10)}
                            style={{position: 'absolute', right: px(-4)}}
                        />
                    </View>
                )}
                <View style={[Style.flexRow]}>
                    {indicators?.map(({text, value, color, type}, index) => (
                        <View
                            key={index}
                            style={{
                                flex: [2, 1.15, 1][index],
                            }}>
                            {type === 1 ? (
                                <View style={Style.flexRow}>
                                    <View style={styles.labelBgWrap}>
                                        <Text style={styles.labelBgText}>{text}</Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={[styles.label_text]}>{text}</Text>
                            )}

                            <Text
                                style={[
                                    styles.amount_text,

                                    {
                                        fontSize: index == 0 ? px(14) : px(12),
                                        color: showEye == 'true' && color ? color : Colors.lightBlackColor,
                                    },
                                ]}>
                                {showEye == 'true' ? value : '****'}
                            </Text>
                        </View>
                    ))}
                </View>
                {!!remind_info && <RenderAlert alert={remind_info} />}
            </TouchableOpacity>
            {child?.length > 0 && expand && (
                <>
                    {/* <View style={[styles.circle, {left: px(12)}]} /> */}
                    {/* <View style={[styles.circle, {right: px(12)}]} /> */}
                    <View style={[styles.portCard]}>
                        <View
                            style={{
                                borderTopWidth: 0.5,
                                borderTopColor: Colors.lineColor,
                                ...Style.flexRow,
                                paddingTop: px(12),
                            }}>
                            {child_header_list?.map((head, index) => (
                                <View
                                    activeOpacity={0.8}
                                    key={index}
                                    style={{
                                        flex: index == 0 ? 1.4 : 1,
                                        ...Style.flexRow,
                                        justifyContent: index == 0 ? 'flex-start' : 'flex-end',
                                    }}>
                                    <Text style={{color: Colors.lightGrayColor, fontSize: px(11)}}>{head.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {child?.map((item, index, arr) => (
                        <AssetCard
                            data={item}
                            key={index}
                            showEye={showEye}
                            type={data?.log_id}
                            style={{
                                marginBottom: index == arr.length - 1 && arr.length >= number ? px(12) : 0,
                                borderRadius: 0,
                                borderBottomLeftRadius: index == arr.length - 1 && child.length >= number ? px(6) : 0,
                                borderBottomRightRadius: index == arr.length - 1 && child.length >= number ? px(6) : 0,
                            }}
                            borderStyle={{
                                borderTopWidth: 0.5,
                                borderTopColor: Colors.lineColor,
                            }}
                        />
                    ))}
                    {child.length < number ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                jump(url);
                            }}
                            style={{...styles.expandAll, ...Style.flexCenter}}>
                            <Text style={{fontSize: px(11), color: Colors.btnColor}}>查看全部</Text>
                        </TouchableOpacity>
                    ) : null}
                </>
            )}
        </>
    );
};
const HoldCard = ({data, reload, showEye}) => {
    const {class_list, pop_info} = data;
    const [expand, setExpand] = useState(true);
    return (
        <>
            <ListTitle
                allData={class_list}
                pop_info={pop_info}
                reload={reload}
                expand={expand}
                onExpand={() => {
                    setExpand((prev) => !prev);
                }}
            />
            {class_list?.map((account, key) => {
                return <ClassCard expand={expand} data={account} showEye={showEye} key={key} />;
            })}
        </>
    );
};
const ListTitle = ({title = '全部资产', pop_info, reload, allData, expand, onExpand}) => {
    const bottomModal = useRef();
    const [list, setList] = useState(fromJS([]));
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const jump = useJump();
    useEffect(() => {
        setList(fromJS(pop_info?.list || []));
    }, [pop_info]);
    const modal = () => {
        global.LogTool('total_assets_card');
        bottomModal.current.show();
    };
    const onChange = (index) => {
        let tmp = list.setIn([index, 'select'], list.getIn([index, 'select']) == 0 ? 1 : 0);
        setList(tmp);
    };
    const onClose = () => {
        if (!userInfo.is_login) {
            jump(pop_info?.close_url);
            return;
        }
        let params = list
            .toJS()
            ?.filter((item) => item.select == 1)
            .map((_i) => _i.type)
            .join(',');
        postAssetClass({type_list: params}).then((res) => {
            if (res.code === '000000') reload();
        });
    };
    return (
        <View style={[Style.flexBetween, {marginBottom: px(10), marginTop: px(8), position: 'relative', zIndex: -10}]}>
            <TouchableOpacity activeOpacity={0.8} onPress={modal} style={Style.flexRow}>
                <View style={styles.title_tag} />
                <Text style={styles.bold_text}>
                    {allData?.length >= pop_info?.list.length ? title : '部分资产'} {''}
                </Text>
                <AntDesign name="caretdown" size={px(10)} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={onExpand} style={[Style.flexRow, {marginRight: px(16)}]}>
                <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>{expand ? '收起' : '展开'}</Text>
                <AntDesign color={Colors.lightBlackColor} name={!expand ? 'down' : 'up'} size={px(10)} />
            </TouchableOpacity>
            <BottomModal ref={bottomModal} title={pop_info?.title} style={{height: px(460)}} onClose={onClose}>
                <>
                    {list.toJS().map(({name, icon, number, desc, select, type}, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            style={[Style.flexBetween, styles.popCard]}
                            onPress={() => onChange(index)}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                    {!!icon && (
                                        <Image
                                            source={{uri: icon}}
                                            style={{width: px(18), height: px(18), marginRight: px(3)}}
                                        />
                                    )}
                                    <Text style={{fontSize: px(14), fontWeight: '700'}}>
                                        {name}({number})
                                    </Text>
                                </View>
                                <Text style={{fontSize: px(12), color: Colors.lightBlackColor, marginLeft: px(21)}}>
                                    {desc}
                                </Text>
                            </View>
                            {select == 1 && <Entypo name="check" color="#0051CC" size={px(14)} />}
                        </TouchableOpacity>
                    ))}
                </>
            </BottomModal>
        </View>
    );
};

export default HoldCard;

const styles = StyleSheet.create({
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    bold_text: {fontSize: px(14), lineHeight: px(20), fontWeight: '700'},
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },

    card: {
        padding: px(16),
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginBottom: px(12),
        marginHorizontal: px(16),
    },

    label_text: {
        fontSize: px(11),
        lineHeight: px(15),
        marginBottom: px(3),
        color: Colors.lightBlackColor,
    },
    labelBgWrap: {
        backgroundColor: '#F1F6FF',
        paddingVertical: px(2),
        paddingHorizontal: px(3),
        borderRadius: px(4),
    },
    labelBgText: {
        fontSize: px(10),
        lineHeight: px(14),
        marginBottom: px(3),
        color: '#0051CC',
    },
    amount_text: {
        fontSize: px(15),
        lineHeight: px(21),
        fontFamily: Font.numFontFamily,
    },

    popCard: {
        marginHorizontal: px(20),
        height: px(62),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    circle: {
        width: px(10),
        height: px(10),
        position: 'absolute',
        backgroundColor: Colors.bgColor,
        borderRadius: px(6),
        top: px(-5),
        zIndex: 10,
    },
    portCard: {
        backgroundColor: '#fff',
        padding: px(12),
        marginHorizontal: px(16),
        paddingTop: 0,
    },
    expandAll: {
        height: px(38),
        backgroundColor: '#fff',
        marginHorizontal: px(16),
        marginBottom: px(12),
        borderTopColor: Colors.lineColor,
        borderTopWidth: 0.5,
        borderBottomLeftRadius: px(6),
        borderBottomRightRadius: px(6),
    },
});
