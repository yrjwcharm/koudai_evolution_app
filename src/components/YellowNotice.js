/*
 * @Date: 2022-07-19 10:54:46
 * @Description:新版小黄条
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useJump} from '~/components/hooks';
import {Colors, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import AntdD from 'react-native-vector-icons/AntDesign';
import http from '~/services';
const YellowNotice = ({data}) => {
    const jump = useJump();
    const [show, setShow] = useState(true);
    useEffect(() => {
        data && setShow(true);
    }, [data]);
    const handelClose = (id) => {
        http.post('/asset/notice/close/20220915', {id});
        setShow(false);
    };
    return show
        ? data?.map((system, index, arr) => (
              <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  style={[styles.systemMsgContainer, arr.length > 1 && {marginBottom: px(12)}]}
                  onPress={() => {
                      global.LogTool('guide_click', '顶部小黄条', system?.log_id);
                      jump(system?.url);
                  }}>
                  <View
                      style={[
                          Style.flexBetween,
                          {
                              paddingVertical: px(8),
                          },
                      ]}>
                      <Text style={styles.systemMsgText} numberOfLines={arr.length > 1 ? 2 : 100}>
                          {system?.desc}
                      </Text>
                      {system?.can_close && (
                          <TouchableOpacity
                              style={{alignSelf: 'flex-start', right: -px(8)}}
                              onPress={() => handelClose(system.id)}>
                              <AntdD name="close" size={px(16)} color={Colors.yellow} />
                          </TouchableOpacity>
                      )}
                  </View>
              </TouchableOpacity>
          ))
        : null;
};

export default YellowNotice;

const styles = StyleSheet.create({
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.marginAlign,
        marginHorizontal: px(16),
    },
    systemMsgText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.yellow,
        textAlign: 'justify',
        flex: 1,
    },
});
