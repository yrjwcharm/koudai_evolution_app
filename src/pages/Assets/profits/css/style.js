import {px} from '../../../../utils/appUtil';
import {Font} from '../../../../common/commonStyle';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    monthFlex: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    month: {
        marginBottom: px(4),
        width: px(77),
        height: px(46),
        backgroundColor: '#f5f6f8',
        borderRadius: px(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        fontSize: px(12),
        color: '#121D3A',
    },
    monthProfit: {
        marginTop: px(2),
        fontSize: px(11),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: '#9AA0B1',
    },
});
