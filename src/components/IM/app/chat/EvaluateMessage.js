import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '../../../../utils/appUtil';
import {useJump} from '../../../hooks';

const defaultTime = 3000;
const EvaluateMessage = ({message, rowId, wsSend, reconnect}) => {
    const jump = useJump();
    const {header, body, footer} = message?.content?.result || message?.content?.data || {};
    const [feedbackState, setFeedback] = useState(null);
    const [opinions, setOpinions] = useState([]);
    const [footerBtnState, setFooterBtnActive] = useState(null);
    const [opinionsTimeEnd, setOpinionsTimeEnd] = useState(false);

    const opinionsTime = useRef(message?.body?.select_submit_time || defaultTime);
    const opinionsTimer = useRef(null);

    const handlerFeedback = (obj) => {
        setFeedback(obj);
        wsSend('BPR', obj);
    };
    const handlerOpinions = (obj) => {
        if (opinionsTimer.current) {
            opinionsTime.current = message?.body?.select_submit_time || defaultTime;
            clearInterval(opinionsTimer.current);
        }
        setOpinions((val) => {
            let newVal = [...val];
            if (!newVal.includes(obj)) newVal.push(obj);
            return newVal;
        });
        opinionsTimer.current = setInterval(() => {
            opinionsTime.current -= 1000;
            if (opinionsTime.current <= 0) {
                setOpinionsTimeEnd(true);
                clearInterval(opinionsTimer.current);
                setOpinions((arr) => {
                    wsSend(
                        'BWR',
                        arr.map((item) => item.value)
                    );
                    return arr;
                });
            }
        }, 1000);
    };

    const disabled = useMemo(() => {
        switch (body.type) {
            case 'icon':
                return footerBtnState || feedbackState;
            case 'select':
                return footerBtnState || opinionsTimeEnd;
        }
    }, [body.type, feedbackState, footerBtnState, opinionsTimeEnd]);

    useEffect(() => {
        () => {
            if (opinionsTimer.current) clearInterval(opinionsTimer.current);
        };
    }, []);

    const handlerFooterBtn = (obj) => {
        setFooterBtnActive(obj);
        if (obj.type === 'button_jump') {
            jump(obj.jump.url);
        } else if (obj.type === 'button_continue') {
            reconnect(true);
        }
    };

    return (
        <View style={{flexDirection: 'row', marginLeft: px(6)}}>
            <View style={[styles.triangle, styles.left_triangle]} />
            <View
                style={{
                    backgroundColor: '#fff',
                    width: px(240),
                    borderRadius: px(4),
                }}>
                <View style={{paddingHorizontal: px(12)}}>
                    <View style={styles.evaluateHeader}>
                        <Text style={styles.evaluateHeadText}>{header?.text || header?.value}</Text>
                    </View>
                    <View style={styles.evaluateMiddle}>
                        {body?.type === 'icon'
                            ? body?.items?.map((item, idx) => (
                                  <TouchableOpacity
                                      activeOpacity={1}
                                      key={idx}
                                      disabled={disabled}
                                      onPress={() => handlerFeedback(item)}
                                      style={[
                                          styles.evaluateMiddleItem,
                                          {borderRadius: px(8)},
                                          {
                                              marginLeft: px(idx % 2 === 0 ? 0 : 11),
                                              marginTop: px(idx > 1 ? 8 : 0),
                                          },
                                          {
                                              backgroundColor:
                                                  feedbackState === item ? 'rgba(0, 81, 204, 0.08)' : '#fff',
                                              borderColor: feedbackState === item ? '#0051CC' : '#ddd',
                                          },
                                      ]}>
                                      <View style={styles.evaluateMiddleItemEmoji}>
                                          <FastImage
                                              style={{width: px(34), height: px(34)}}
                                              source={{
                                                  uri: item.icon,
                                              }}
                                          />
                                          <Text
                                              style={[
                                                  styles.evaluateMiddleItemEmojiText,
                                                  {color: feedbackState === item ? '#0051CC' : '#545968'},
                                              ]}>
                                              {item.text}
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                              ))
                            : null}
                        {body?.type === 'select'
                            ? body?.items?.map((item, idx) => (
                                  <TouchableOpacity
                                      activeOpacity={1}
                                      disabled={disabled}
                                      key={idx}
                                      onPress={() => handlerOpinions(item)}
                                      style={[
                                          styles.evaluateMiddleItem,
                                          {borderRadius: px(17)},
                                          {
                                              marginLeft: px(idx % 2 === 0 ? 0 : 11),
                                              marginTop: px(idx > 1 ? 8 : 0),
                                          },
                                          {
                                              backgroundColor: opinions.includes(item)
                                                  ? 'rgba(0, 81, 204, 0.08)'
                                                  : '#fff',
                                              borderColor: opinions.includes(item) ? '#0051CC' : '#ddd',
                                          },
                                      ]}>
                                      <Text
                                          style={[
                                              styles.evaluateMiddleItemEvaluateText,
                                              {color: opinions.includes(item) ? '#0051CC' : '#545968'},
                                          ]}>
                                          {item.text}
                                      </Text>
                                  </TouchableOpacity>
                              ))
                            : null}
                    </View>
                    {footer && (
                        <View style={styles.evaluateFooter}>
                            <TouchableOpacity
                                activeOpacity={1}
                                disabled={opinions[0] || feedbackState || footerBtnState}
                                onPress={() => handlerFooterBtn(footer)}
                                style={[
                                    styles.evaluateFooterBtn,
                                    {
                                        backgroundColor: footerBtnState ? 'rgba(0, 81, 204, 0.08)' : '#fff',
                                        borderColor: footerBtnState ? '#0051CC' : '#ddd',
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.evaluateFooterBtnText,
                                        {color: footerBtnState ? '#0051CC' : '#545968'},
                                    ]}>
                                    {footer.text || footer?.jump?.value}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
export default EvaluateMessage;

const styles = StyleSheet.create({
    evaluateHeader: {
        paddingVertical: px(12),
        borderBottomWidth: 1,
        borderBottomColor: '#e9eaef',
    },
    evaluateHeadText: {
        fontSize: px(14),
        color: '#1f2432',
        lineHeight: px(20),
    },
    evaluateMiddle: {
        paddingVertical: px(12),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    evaluateMiddleItem: {
        width: px(102),
        paddingVertical: px(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    evaluateMiddleItemEmoji: {},
    evaluateMiddleItemEmojiText: {
        marginTop: px(4),
        fontSize: px(12),
        lineHeight: px(17),
    },
    triangle: {
        width: 0,
        height: 0,
        zIndex: 999,
        borderWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderColor: '#fff',
        marginTop: 16,
        marginRight: -2,
    },
    left_triangle: {
        borderLeftWidth: 0,
        marginTop: 8,
        borderRightWidth: Platform.OS === 'android' ? 6 : 10,
    },
    evaluateMiddleItemEvaluateText: {
        color: '#0051cc',
        lineHeight: px(17),
        fontSize: px(12),
    },
    evaluateFooter: {
        paddingVertical: px(11),
        borderTopWidth: 1,
        borderTopColor: '#e9eaef',
    },
    evaluateFooterBtn: {
        borderRadius: px(17),
        borderWidth: 1,
    },
    evaluateFooterBtnText: {
        lineHeight: px(17),
        fontSize: px(12),
        textAlign: 'center',
        paddingVertical: px(8),
    },
});
