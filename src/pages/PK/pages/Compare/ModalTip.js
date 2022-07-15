import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '~/utils/appUtil';

const ModalTip = ({type, data}) => {
    return (
        <View style={styles.container}>
            {type === 'PKParams' ? (
                data?.pk_explain?.list?.map((item, idx) => (
                    <View key={idx} style={{marginTop: idx > 0 ? px(8) : 0}}>
                        <Text style={styles.title}>{item.title} </Text>
                        <Text style={styles.desc}>{item.content}</Text>
                    </View>
                ))
            ) : type === 'PKPortfolio' ? (
                <View>
                    <Text styles={[styles.desc, {textAlign: 'center'}]}>{data?.asset_explain?.content}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default ModalTip;

const styles = StyleSheet.create({
    container: {
        padding: px(16),
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121d3a',
    },
    desc: {
        fontSize: px(14),
        lineHeight: px(23),
        color: '#121D3a',
    },
});
