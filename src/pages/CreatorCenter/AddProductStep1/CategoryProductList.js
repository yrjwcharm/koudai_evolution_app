/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 19:00:56
 */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Font, Style} from '~/common/commonStyle';
import {ProductList} from '~/components/Product';
import {px} from '~/utils/appUtil';

const CategoryProductList = ({data}) => {
    const [active, setActive] = useState(0);
    return (
        data?.groups?.length > 0 && (
            <View>
                <View style={[Style.flexRow]}>
                    {data?.groups.map?.((group, index) => {
                        const {name} = group;
                        const isCurrent = active === index;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isCurrent}
                                key={name + index}
                                onPress={() => setActive(index)}
                                style={[
                                    styles.groupTab,
                                    {
                                        marginLeft: index === 0 ? 0 : px(8),
                                        backgroundColor: isCurrent ? '#DEE8FF' : Colors.bgColor,
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.desc,
                                        {
                                            color: isCurrent ? Colors.brandColor : Colors.defaultColor,
                                            fontWeight: isCurrent ? Font.weightMedium : '400',
                                        },
                                    ]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {data?.groups?.[active]?.items?.length > 0 && (
                    <View
                        style={{
                            paddingTop: px(12),
                        }}>
                        <ProductList data={data.groups[active].items} type={data.style_type} />
                    </View>
                )}
            </View>
        )
    );
};

export default CategoryProductList;

const styles = StyleSheet.create({
    container: {},
    groupTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    desc: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
});
