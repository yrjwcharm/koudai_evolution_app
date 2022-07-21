/*
 * @Date: 2022-07-18 15:50:46
 * @Description:理财有计划卡片
 */
import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import RenderHtml from '~/components/RenderHtml';
import {Colors} from '~/common/commonStyle';
import ProductCards from '~/components/Portfolios/ProductCards';
const ProjectProduct = ({data = {}}) => {
    const {name_pic, fit_desc, items, risk_desc, serious_items, slogan} = data;
    const renderLargeCard = (item) => {
        return <ProductCards data={item} />;
    };
    return (
        <View style={styles.con}>
            <Image
                source={{uri: name_pic}}
                style={{width: px(66), height: px(18), marginBottom: px(4)}}
                resizeMode="center"
            />
            <View style={{marginBottom: px(16)}}>
                {slogan ? (
                    <View style={{marginBottom: px(6)}}>
                        <RenderHtml html={slogan} style={{fontSize: px(13)}} />
                    </View>
                ) : null}
                {fit_desc ? (
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                        {fit_desc?.key}
                        <Text>{fit_desc.value}</Text>
                    </Text>
                ) : null}
                {risk_desc ? (
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                        {risk_desc?.key}
                        <Text>{risk_desc.value}</Text>
                    </Text>
                ) : null}
            </View>
            {items?.length > 0 ? items?.map((item) => renderLargeCard(item)) : null}
            {serious_items?.length > 0 ? serious_items?.map((item) => renderLargeCard(item)) : null}
        </View>
    );
};
export default ProjectProduct;

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        backgroundColor: '#F3F4F4',
        borderRadius: px(6),
        flexDirection: 'column',
    },
});
