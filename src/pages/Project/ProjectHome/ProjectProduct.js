/*
 * @Date: 2022-07-18 15:50:46
 * @Description:理财有计划卡片
 */
import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import RenderHtml from '~/components/RenderHtml';
import {Colors, Style} from '~/common/commonStyle';
import ProductCards from '~/components/Portfolios/ProductCards';
const ProjectProduct = ({data = {}}) => {
    const {name_pic, fit_desc, items, risk_desc, serious_items, slogan} = data;

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
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor, marginBottom: px(4)}}>
                        {fit_desc?.key}
                        <Text style={{color: Colors.lightBlackColor}}>{fit_desc.value}</Text>
                    </Text>
                ) : null}
                {risk_desc ? (
                    <View style={{...Style.flexRow}}>
                        <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>{risk_desc?.key}</Text>
                        <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>{risk_desc.value}</Text>
                        {risk_desc?.bar && (
                            <Image
                                source={{uri: risk_desc?.bar}}
                                style={{height: px(12), width: px(120), marginLeft: px(8), top: px(2)}}
                            />
                        )}
                    </View>
                ) : null}
            </View>
            {items?.length > 0
                ? items?.map((item, index) => <ProductCards data={item} key={item.title + index} />)
                : null}
            {serious_items?.length > 0
                ? serious_items?.map((item, index) => <ProductCards data={item} key={item.title + index} />)
                : null}
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
