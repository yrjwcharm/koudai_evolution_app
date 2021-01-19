/*
 * @Author: dx
 * @Date: 2021-01-18 15:52:27
 * @LastEditTime: 2021-01-18 17:30:03
 * @LastEditors: Please set LastEditors
 * @Description: 详情页底部固定按钮
 * @FilePath: /koudai_evolution_app/src/pages/Detail/components/FixedBtn.js
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px as text } from '../../../utils/appUtil';
import { Colors, Font, Space, Style } from '../../../common/commonStyle';
import { Button } from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { BottomModal } from '../../../components/Modal';

const FixedBtn = props => {
  const { btns, style } = props;
  const navigation = useNavigation();
  const bottomModal = useRef(null);
  const renderContactContent = () => {
    return (
      <View style={[ styles.contactContainer ]}>
        {
          btns[0].subs && btns[0].subs.map((sub, index) => {
            return (
              <View key={index} style={[ styles.methodItem, Style.flexRow, index === btns[0].subs.length - 1 ? { marginBottom: 0 } : {} ]}>
                <View style={[ Style.flexRow ]}>
                  <View style={[ styles.iconBox, Style.flexCenter ]}><Image source={{ uri: sub.icon }} style={[ styles.icon ]} /></View>
                  <View>
                    <Text style={[ styles.methodTitle ]}>{sub.title}</Text>
                    <Text style={[ styles.methodDesc ]}>{sub.desc}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[ styles.methodBtn, Style.flexCenter ]}><Text style={[ styles.methodBtnText ]}>{sub.btn.title}</Text></TouchableOpacity>
              </View>
            );
          })
        }
      </View>
    );
  };
  return (
    <View style={[ styles.container, Style.flexRow, style ]}>
      <TouchableOpacity style={[ styles.contactBtn, Style.flexCenter ]} onPress={() => bottomModal.current.show()}>
        <Image source={{ uri: btns[0].icon }} style={[ styles.contactIcon ]} />
        <Text style={[ styles.contactText ]}>{btns[0].title}</Text>
      </TouchableOpacity>
      <Button title={btns[1].title} style={[ styles.btn ]} textStyle={[ styles.btnText ]} />
      <BottomModal title={'选择咨询方式'} ref={bottomModal} children={renderContactContent()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: text(60),
    backgroundColor: '#fff',
    paddingVertical: text(8),
    paddingHorizontal: text(20),
  },
  contactBtn: {
    marginRight: text(20),
  },
  contactIcon: {
    width: text(24),
    height: text(24),
    marginBottom: text(4),
  },
  contactText: {
    fontSize: text(13),
    lineHeight: text(18),
    color: Colors.brandColor,
  },
  btn: {
    flex: 1,
  },
  btnText: {
    fontSize: text(14),
    lineHeight: text(20),
  },
  contactContainer: {
    paddingTop: text(28),
    paddingHorizontal: text(20),
  },
  methodItem: {
    marginBottom: text(34),
    justifyContent: 'space-between',
  },
  iconBox: {
    width: text(50),
    height: text(50),
    borderRadius: text(25),
    backgroundColor: '#DFEAFC',
    marginRight: text(12),
  },
  icon: {
    width: text(24),
    height: text(24),
  },
  methodTitle: {
    fontSize: Font.textH1,
    lineHeight: text(22),
    color: Colors.defaultColor,
    fontWeight: '600',
    marginBottom: text(6),
  },
  methodDesc: {
    fontSize: text(13),
    lineHeight: text(18),
    color: Colors.lightGrayColor,
  },
  methodBtn: {
    borderRadius: text(6),
    borderWidth: Space.borderWidth,
    borderColor: Colors.descColor,
    borderStyle: 'solid',
    paddingVertical: text(8),
    paddingHorizontal: text(12),
  },
  methodBtnText: {
    fontSize: Font.textH3,
    lineHeight: text(16),
    color: Colors.descColor,
  },
});

FixedBtn.propTypes = {
  btns: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export default FixedBtn;