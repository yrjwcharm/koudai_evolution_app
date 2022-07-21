/*
 * @Date: 2022-07-14 17:03:11
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Style} from '~/common/commonStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
const RenderSignal = ({list, more, desc, style}) => {
    const jump = useJump();
    return (
        <View style={style}>
            <View style={Style.flexRow}>
                {list?.map((item, index) => (
                    <LinearGradient
                        style={styles.con}
                        key={index}
                        colors={['#E0F9DC', '#EEF7ED']}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}>
                        <View>
                            <Text style={{color: Colors.defaultColor, fontSize: px(12), marginBottom: px(4)}}>
                                {item.text}
                            </Text>
                            <Text
                                style={{color: Colors.defaultColor, fontSize: px(15), fontFamily: Font.numFontFamily}}>
                                1332.44
                            </Text>
                        </View>
                        <RenderTag />
                    </LinearGradient>
                ))}
                <TouchableOpacity style={styles.more} onPress={() => jump(more?.url)}>
                    <Text style={{color: Colors.lightBlackColor}}>{more?.text}</Text>
                    <Icon name={'rightcircleo'} color={Colors.lightBlackColor} />
                </TouchableOpacity>
            </View>
            <Text style={{color: '#BDC2CC', fontSize: px(11), marginTop: px(8)}}>{desc}</Text>
        </View>
    );
};
//买卖信号
const RenderTag = ({tag}) => {
    // const bgColor = getTagColor(tag.tag_style);
    return (
        <View style={[styles.card_tag, Style.flexRowCenter]}>
            <Text style={{color: '#fff', fontSize: px(12), marginRight: px(4)}}>{'买'}</Text>
            <View style={[Style.flexRow, {alignItems: 'flex-end'}]}>
                {new Array(3).fill(0).map((_, index, arr) => (
                    <View
                        key={index}
                        style={{
                            width: px(2),
                            backgroundColor: '#fff',
                            opacity: index == arr.length - 1 ? 0.4 : 1,
                            marginRight: index == arr.length - 1 ? 0 : px(2),
                            height: px(4) + index * 3,
                        }}
                    />
                ))}
            </View>
        </View>
    );
};
export default RenderSignal;

const styles = StyleSheet.create({
    con: {
        width: px(100),
        height: px(54),
        borderRadius: px(5),
        marginRight: px(8),
        ...Style.flexBetween,
        paddingLeft: px(8),
    },
    card_tag: {
        width: px(34),
        height: px(24),
        borderBottomLeftRadius: px(30),
        borderTopLeftRadius: px(30),
        backgroundColor: '#239B56',
        // position: 'absolute',
        // right: 0,
        // top: px(20),
    },
    more: {
        alignItems: 'center',
        width: px(24),
        height: px(54),
        borderRadius: px(4),
        backgroundColor: '#F3F4F4',
        justifyContent: 'center',
    },
});