/*
 * @Date: 2022-10-14 17:18:09
 * @Description:社区主页介绍
 */
import {Text, View} from 'react-native';
import React from 'react';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const Intro = ({data}) => {
    return (
        <View style={{paddingHorizontal: px(20), marginBottom: px(6)}}>
            <View style={[Style.flexAround, {marginBottom: px(16), flexDirection: 'row'}]}>
                <Text>
                    <Text style={{fontSize: px(18), fontFamily: Font.numMedium}}>{data?.favor_num}</Text>{' '}
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}>{'获赞'}</Text>
                </Text>
                {data?.follow_num != undefined && (
                    <Text>
                        <Text style={{fontSize: px(18), fontFamily: Font.numMedium}}>{data?.follow_num}</Text>{' '}
                        <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}>
                            {'关注'}
                        </Text>
                    </Text>
                )}
                <Text>
                    <Text style={{fontSize: px(18), fontFamily: Font.numMedium}}>{data?.fans_num}</Text>
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}> {'粉丝'}</Text>
                </Text>
            </View>
            <Text style={{fontSize: px(12), lineHeight: px(17), color: '#3D3D3D'}}>
                {data?.intro}我们的系统里面怎么获取这个啊 有人知道吗我们的系统里面怎么获取这个啊 有人知道吗
            </Text>
        </View>
    );
};

export default Intro;
