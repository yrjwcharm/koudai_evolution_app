/*
 * @Date: 2022-07-14 17:03:11
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Style} from '~/common/commonStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
const RenderSignal = ({list, more, desc, style, copilot}) => {
    const jump = useJump();
    return (
        <View style={style}>
            <View style={Style.flexRow} {...copilot}>
                {list?.map((item, index) => (
                    <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => jump(item.url)}>
                        <LinearGradient
                            style={styles.con}
                            colors={item?.background || ['#E0F9DC', '#EEF7ED']}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}>
                            <View>
                                <Text style={{color: Colors.defaultColor, fontSize: px(12), marginBottom: px(2)}}>
                                    {item.text}
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.defaultColor,
                                        fontSize: px(15),
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {item?.index_num}
                                </Text>
                            </View>
                            <Image source={{uri: item?.strength_icon}} style={styles.icon} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.more} onPress={() => jump(more?.url)} activeOpacity={0.8}>
                    <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>{more?.text}</Text>
                    <Icon name={'rightcircleo'} color={Colors.lightBlackColor} size={px(12)} />
                </TouchableOpacity>
            </View>
            <Text style={{color: '#BDC2CC', fontSize: px(11), marginTop: px(8)}}>{desc}</Text>
        </View>
    );
};
export default RenderSignal;

const styles = StyleSheet.create({
    con: {
        width: px(98),
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
    },
    more: {
        flex: 1,
        paddingHorizontal: px(6),
        height: px(54),
        borderRadius: px(4),
        alignContent: 'center',
        backgroundColor: '#F3F4F4',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        right: 0,
        top: px(15),
        width: px(34),
        height: px(24),
    },
});
