/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2021-01-18 16:27:30
 * @LastEditors: Please set LastEditors
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Image } from 'react-native';
import { px as text } from '../utils/appUtil';
import { Colors, Font, Space } from '../common/commonStyle';
import { useNavigation } from '@react-navigation/native';

const BottomDesc = (props) => {
  const { data, style } = props;
  const navigation = useNavigation();
  return (
    <View style={[ styles.con, style ]}>
      {
        data && data.map((item, index) => {
          return (
            <View style={styles.item} key={index}>
              {
                item.endorce && <Image source={{ uri: item.endorce }} style={[ styles.img ]} />
              }
              {
                item.title && <Text style={styles.text}>{item.title}</Text>
              }
              {
                item.button && <Text style={styles.button} onPress={() => navigation.navigate('CompanyIntro')}>{item.button.title}</Text>
              }
            </View>
          );
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    marginVertical: Space.marginVertical,
  },
  img: {
    width: text(343),
    height: text(30),
    marginBottom: text(12),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.darkGrayColor,
    fontSize: Font.textH3,
    lineHeight: text(20),
  },
  button: {
    color: Colors.brandColor,
    fontSize: Font.textH3,
    marginLeft: text(2),
  },
});

BottomDesc.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export default BottomDesc;