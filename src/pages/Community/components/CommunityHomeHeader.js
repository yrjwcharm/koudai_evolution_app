/*
 * @Date: 2022-10-14 15:10:12
 * @Description:
 */
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Style} from '~/common/commonStyle';

const CommunityHomeHeader = ({data, style}) => {
    return (
        <ImageBackground
            source={{
                uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/08/yanglao2@3x.jpg',
            }}
            style={{
                height: px(220),
                paddingHorizontal: px(20),
                ...style,
            }}>
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    <Image
                        source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png'}}
                        style={styles.headerAvatar}
                    />
                    <View>
                        <Text style={styles.vName}>马老师</Text>
                        <View style={Style.flexRow}>
                            <Image
                                source={{
                                    uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png',
                                }}
                                style={{width: px(16), height: px(16), borderRadius: px(8), marginRight: px(2)}}
                            />
                            <Text style={{fontSize: px(12), lineHeight: px(17), color: '#fff'}}>马老师</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.attentionBtn}>
                    <Text style={{fontSize: px(12)}}>已关注</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

export default CommunityHomeHeader;

const styles = StyleSheet.create({});
