/*
 * @Date: 2022-10-14 17:18:09
 * @Description:社区主页介绍
 */
import {Text, View} from 'react-native';
import React from 'react';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const Intro = ({data, onLayout}) => {
    return (
        <View style={{paddingHorizontal: px(20), paddingBottom: px(6), paddingTop: px(16)}} onLayout={onLayout}>
            <View style={Style.flexRow}>
                <Text style={{marginRight: px(24)}}>
                    <Text style={{fontSize: px(18), lineHeight: px(20), fontFamily: Font.numMedium}}>
                        {data?.favor_num}
                    </Text>{' '}
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}>{'获赞'}</Text>
                </Text>
                {data?.follow_num != undefined && (
                    <Text style={{marginRight: px(24)}}>
                        <Text style={{fontSize: px(18), lineHeight: px(20), fontFamily: Font.numMedium}}>
                            {data?.follow_num}
                        </Text>{' '}
                        <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}>
                            {'关注'}
                        </Text>
                    </Text>
                )}
                <Text>
                    <Text style={{fontSize: px(18), lineHeight: px(20), fontFamily: Font.numMedium}}>
                        {data?.fans_num}
                    </Text>
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor, lineHeight: px(14)}}> {'粉丝'}</Text>
                </Text>
            </View>
            {!!data?.intro && (
                <Text style={{fontSize: px(12), lineHeight: px(17), color: '#3D3D3D', marginTop: px(16)}}>
                    {data?.intro}
                </Text>
            )}
        </View>
    );
};

export default Intro;
