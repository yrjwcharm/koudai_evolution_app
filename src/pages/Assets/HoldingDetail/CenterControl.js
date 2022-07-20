import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import arrowUp from '~/assets/personal/arrowUp.png';
import leftQuota1 from '~/assets/personal/leftQuota1.png';
import upgrade from '~/assets/personal/upgrade.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {BottomModal} from '~/components/Modal';
import HTML from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';

const CenterControl = forwardRef(({data = {}, refresh = (a) => a}, ref) => {
    const jump = useJump();
    const {
        button,
        button_list,
        close_pop,
        close_text,
        content,
        desc: adjustDesc,
        date: adjustDate,
        ratio_info,
        signal_icon,
        signal_items,
        signal_mode,
        tip: adjustTip,
        title,
        type,
    } = data;
    const {options = [], title: modalTitle} = close_pop || {};
    const {increase, ratio_dst, ratio_src, text} = ratio_info || {};
    const increaseBox = useRef();
    const bottomModal = useRef();
    const [selected, setSelected] = useState();
    const borderSty = {
        adjust: {
            borderWidth: Space.borderWidth,
            borderTopWidth: px(2),
            borderColor: Colors.brandColor,
        },
        default: {
            borderColor: '#fff',
            borderTopColor: '#9AA0B1',
        },
        signal: {
            borderWidth: Space.borderWidth,
            borderTopWidth: px(2),
            borderColor: signal_mode === 'buy' ? Colors.green : Colors.red,
        },
        upgrade: {borderColor: '#FF7D41'},
    };
    const descBoxSty = (_type) => {
        switch (_type) {
            case 'adjust':
            case 'signal':
                return {
                    marginTop: px(8),
                    padding: px(12),
                    borderRadius: Space.borderRadius,
                    backgroundColor: '#fff',
                };
            case 'default':
                return {marginTop: px(12)};
            case 'upgrade':
                return {marginTop: px(14)};
            default:
                return {};
        }
    };

    /** @name 中控内部按钮 */
    const consoleBtn = ({style, button: btn}) => {
        return btn?.text ? (
            <TouchableOpacity
                activeOpacity={0.8}
                key={btn.text}
                onPress={() => jump(btn.url)}
                style={[Style.flexCenter, styles.consoleBtn, style]}>
                <Text style={[styles.btnText, {color: btn.avail === 0 ? '#BDC2CC' : '#fff'}]}>{btn.text}</Text>
            </TouchableOpacity>
        ) : null;
    };

    /** @name 中控内容父组件 */
    const ContentBox = ({children}) => {
        switch (type) {
            case 'adjust':
                return <View style={styles.adjustBox}>{children}</View>;
            case 'default':
                return <View style={styles.consoleContentBox}>{children}</View>;
            case 'signal':
                return (
                    <View style={[styles.adjustBox, {backgroundColor: signal_mode === 'buy' ? '#EDF7EC' : '#FFF2F2'}]}>
                        {children}
                    </View>
                );
            case 'upgrade':
                return (
                    <LinearGradient
                        colors={['#FFF6E6', '#fff']}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 0.14}}
                        style={styles.consoleContentBox}>
                        {children}
                    </LinearGradient>
                );
            default:
                return null;
        }
    };

    /** @name 渲染信号队列 */
    const renderSignalItems = ({signal_items: items = [], signal_mode: mode, type: _type}) => {
        return items.map((item, index) => {
            const {
                button_list: signalBtnList,
                content: signalContent,
                date: signalDate,
                desc: signalDesc,
                icon,
                name,
                sub_title,
                tip: signalTip,
            } = item;
            return (
                <View key={name + index} style={[descBoxSty(_type), index > 0 ? {marginTop: px(12)} : {}]}>
                    <View style={Style.flexRow}>
                        <View
                            style={[
                                Style.flexRow,
                                styles.signalNameBox,
                                {backgroundColor: mode === 'buy' ? '#EDF7EC' : '#FFF2F2'},
                            ]}>
                            <Image source={{uri: icon}} style={styles.signalIcon} />
                            <Text style={[styles.smallText, {color: mode === 'buy' ? Colors.green : Colors.red}]}>
                                {name}
                            </Text>
                        </View>
                        <Text style={[styles.title, {color: mode === 'buy' ? Colors.green : Colors.red}]}>
                            {sub_title}
                        </Text>
                    </View>
                    <View style={{marginTop: px(8)}}>
                        <HTML html={signalContent} numberOfLines={3} style={styles.desc} />
                    </View>
                    <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                        {signalDate ? (
                            <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>{adjustDate}</Text>
                        ) : null}
                        {signalDesc ? <HTML html={signalDesc} style={{...styles.desc, color: Colors.red}} /> : null}
                        {signalTip ? (
                            <View style={styles.signalTipBox}>
                                <HTML html={signalTip} style={{...styles.desc, color: '#FF7D41'}} />
                            </View>
                        ) : null}
                        <View style={Style.flexRow}>
                            {signalBtnList?.map((btn, i, arr) => {
                                return consoleBtn({
                                    button: btn,
                                    style:
                                        i === arr.length - 1
                                            ? {backgroundColor: mode === 'buy' ? Colors.green : Colors.red}
                                            : styles.defaultConsoleBtn,
                                });
                            })}
                        </View>
                    </View>
                </View>
            );
        });
    };

    /** @name 选择不感兴趣理由 */
    const onChooseReason = (id) => {
        setSelected(id);
        bottomModal.current?.hide();
        refresh();
    };

    useImperativeHandle(ref, () => ({
        renderSignalItems,
    }));

    return (
        <View style={[styles.centerControlBox, borderSty[type]]}>
            {close_text ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setSelected();
                        bottomModal.current?.show();
                    }}
                    style={[Style.flexRow, styles.closeBtn]}>
                    <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>{close_text}</Text>
                    <AntDesign color={Colors.lightGrayColor} name="close" size={px(14)} />
                </TouchableOpacity>
            ) : null}
            <ContentBox>
                {signal_icon ? <Image source={{uri: signal_icon}} style={styles.signalModeIcon} /> : null}
                <View style={Style.flexCenter}>
                    <HTML html={title} style={styles.title} />
                </View>
                {type === 'signal' ? (
                    renderSignalItems({signal_items, signal_mode, type})
                ) : (
                    <View style={descBoxSty(type)}>
                        {type === 'upgrade' ? <Image source={leftQuota1} style={styles.leftQuota} /> : null}
                        <HTML html={content} numberOfLines={3} style={styles.desc} />
                        <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                            {adjustDesc ? (
                                <HTML html={adjustDesc} style={styles.desc} />
                            ) : (
                                <>
                                    <Text style={[styles.smallText, {color: Colors.lightGrayColor}]}>{adjustDate}</Text>
                                    {consoleBtn({button})}
                                </>
                            )}
                        </View>
                        {adjustTip ? (
                            <>
                                <View style={styles.divider} />
                                <View
                                    style={[
                                        Style.flexBetween,
                                        {borderRadius: Space.borderRadius, backgroundColor: '#F1F6FF'},
                                    ]}>
                                    <View style={{marginLeft: px(12), flex: 1}}>
                                        <Text numberOfLines={1} style={[styles.desc, {color: Colors.descColor}]}>
                                            {adjustTip}
                                        </Text>
                                    </View>
                                    {consoleBtn({button})}
                                </View>
                            </>
                        ) : null}
                    </View>
                )}
                {ratio_info ? (
                    <View style={[Style.flexRowCenter, {marginTop: px(20)}]}>
                        <Text style={styles.bigNumText}>{ratio_src}</Text>
                        <View style={{paddingHorizontal: px(32)}}>
                            <Image source={upgrade} style={styles.upgrade} />
                            <Text style={[styles.desc, {color: Colors.descColor}]}>{text}</Text>
                        </View>
                        <View>
                            <HTML html={ratio_dst} style={styles.bigNumText} />
                            <View
                                onLayout={({
                                    nativeEvent: {
                                        layout: {width},
                                    },
                                }) => {
                                    increaseBox.current?.setNativeProps({style: {right: px(6) - width}});
                                }}
                                ref={increaseBox}
                                style={styles.increaseBox}>
                                <Image source={arrowUp} style={styles.arrowUp} />
                                <Text style={styles.increaseText}>{increase}</Text>
                            </View>
                        </View>
                    </View>
                ) : null}
                {button_list?.length > 0 && (
                    <View style={[Style.flexRow, {marginTop: px(20)}]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={button_list[0].avail === 0}
                            onPress={() => jump(button_list[0].url)}
                            style={[
                                Style.flexCenter,
                                styles.normalBtn,
                                button_list[0].avail === 0 ? {borderColor: '#E9EAEF'} : {},
                            ]}>
                            <Text
                                style={[
                                    styles.btnText,
                                    {
                                        fontWeight: '400',
                                        color: button_list[0].avail === 0 ? '#BDC2CC' : Colors.descColor,
                                    },
                                ]}>
                                {button_list[0].text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={button_list[1].avail === 0}
                            onPress={() => jump(button_list[1].url)}
                            style={[
                                Style.flexCenter,
                                styles.primaryBtn,
                                button_list[1].avail === 0 ? {backgroundColor: '#E9EAEF'} : {},
                            ]}>
                            <Text style={[styles.btnText, {color: button_list[1].avail === 0 ? '#BDC2CC' : '#fff'}]}>
                                {button_list[1].text}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {type === 'default' && button?.text ? (
                    <View style={[Style.flexCenter, {marginTop: px(12)}]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={button.avail === 0}
                            onPress={() => jump(button.url)}
                            style={[
                                Style.flexCenter,
                                styles.primaryBtn,
                                {backgroundColor: button.avail === 0 ? '#E9EAEF' : Colors.brandColor},
                            ]}>
                            <Text style={[styles.btnText, {color: button.avail === 0 ? '#BDC2CC' : '#fff'}]}>
                                {button.text}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </ContentBox>
            {options?.length > 0 ? (
                <BottomModal ref={bottomModal} title={modalTitle}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        {options.map((option, i) => {
                            const {desc: reason, id} = option;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={selected !== undefined}
                                    key={id}
                                    onPress={() => onChooseReason(id)}
                                    style={[
                                        Style.flexRow,
                                        styles.optionBox,
                                        {
                                            marginTop: i === 0 ? Space.marginVertical : px(12),
                                            borderColor:
                                                selected !== undefined && selected !== id
                                                    ? '#E2E4EA'
                                                    : Colors.brandColor,
                                        },
                                    ]}>
                                    <Text style={[styles.desc, selected === id ? {color: Colors.brandColor} : {}]}>
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </BottomModal>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    bigNumText: {
        fontSize: px(24),
        lineHeight: px(29),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitText: {
        marginLeft: px(8),
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    centerControlBox: {
        marginTop: px(20),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        borderWidth: px(1),
        borderTopWidth: px(2),
        overflow: 'hidden',
    },
    consoleContentBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    adjustBox: {
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#F1F6FF',
    },
    closeBtn: {
        position: 'absolute',
        top: px(8),
        right: px(8),
        zIndex: 1,
    },
    upgrade: {
        marginBottom: px(4),
        width: px(36),
        height: px(18),
    },
    increaseBox: {
        paddingHorizontal: px(4),
        borderRadius: px(2),
        backgroundColor: Colors.red,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: px(-8),
    },
    arrowUp: {
        marginRight: px(2),
        width: px(9),
        height: px(7),
    },
    increaseText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    optionBox: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    divider: {
        marginVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
    },
    leftQuota: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        top: px(-10),
        left: 0,
    },
    normalBtn: {
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.descColor,
        flex: 1,
        height: px(38),
    },
    primaryBtn: {
        marginLeft: px(12),
        borderRadius: Space.borderRadius,
        flex: 1,
        height: px(38),
        backgroundColor: '#FF7D41',
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
        fontWeight: Font.weightMedium,
    },
    consoleBtn: {
        paddingHorizontal: px(14),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.brandColor,
        minWidth: px(80),
        height: px(30),
    },
    signalModeIcon: {
        position: 'absolute',
        top: px(10),
        right: 0,
        width: px(34),
        height: px(24),
    },
    signalNameBox: {
        marginRight: px(8),
        paddingVertical: px(1),
        paddingRight: px(6),
        paddingLeft: px(1),
        borderRadius: px(20),
    },
    signalIcon: {
        marginRight: px(4),
        width: px(18),
        height: px(18),
    },
    signalTipBox: {
        paddingVertical: px(4),
        paddingHorizontal: px(8),
        borderRadius: Space.borderRadius,
        backgroundColor: '#FFF5E5',
    },
    defaultConsoleBtn: {
        marginRight: px(8),
        borderWidth: Space.borderWidth,
        borderColor: Colors.descColor,
        backgroundColor: '#fff',
    },
});

export default CenterControl;
