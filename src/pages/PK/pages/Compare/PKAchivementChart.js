import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {px} from '~/utils/appUtil';
import {throttle} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import {Chart} from '~/components/Chart';
import {Colors, Font} from '~/common/commonStyle';
import {getPKChartDetail} from '../../services';

const PKAchivementChart = ({fund_code_list, originPeriod}) => {
    const [period, setPeriod] = useState(originPeriod);
    const [data, setData] = useState({});
    const [subTabs, setSubTabs] = useState([]);
    const [items, setItems] = useState([]);

    const getData = (p) => {
        setData({});
        getPKChartDetail({
            period: p,
            fund_code_list: fund_code_list?.join?.(),
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result.yield_info);
                setSubTabs(res.result?.yield_info?.sub_tabs || []);
            }
        });
    };

    const changeTab = (p, name) => {
        global.LogTool('PKContrast_Performance', name);
        setPeriod((prev) => {
            if (p !== prev) {
                getData(p);
            }
            return p;
        });
    };

    useFocusEffect(
        useCallback(() => {
            getData(originPeriod);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fund_code_list])
    );

    const onChartChange = ({items: arr}) => {
        setItems(arr);
    };

    const onHide = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>业绩表现</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.legendsWrap}>
                    {data.chart?.slice?.(0, data.label.length).map((item, idx) => {
                        return <Lengend name={item.type} items={items} index={idx} key={idx} />;
                    })}
                </View>
                <View style={{height: px(207)}}>
                    {data.chart?.length > 0 && (
                        <Chart
                            initScript={baseAreaChart(data.chart, true, 2, null, [10, 10, 10, 15])}
                            onChange={onChartChange}
                            // data={chart}
                            onHide={onHide}
                            style={{width: '100%'}}
                        />
                    )}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        paddingHorizontal: px(20),
                        paddingVertical: px(10),
                    }}>
                    {subTabs?.map((_item, _index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[
                                    styles.btn_sty,
                                    {
                                        backgroundColor: period == _item.val ? '#F1F6FF' : '#fff',
                                        borderWidth: period == _item.val ? 0 : 0.5,
                                    },
                                ]}
                                key={_index}
                                onPress={() => changeTab(_item.val, _item.name)}>
                                <Text
                                    style={{
                                        color: period == _item.val ? '#0051CC' : '#555B6C',
                                        fontSize: px(12),
                                    }}>
                                    {_item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default PKAchivementChart;

const colors = ['#E74949', '#0051CC', '#DEA92E', '#6AAD5B', '#9955D4', '#545968'];
const areaColors = [
    'rgba(250, 54, 65, 0.15)',
    'rgba(0, 81, 204, 0.1)',
    'rgba(228, 192, 132, 0.25)',
    'rgba(184, 210, 126, 0.25)',
    'rgba(153, 85, 212, 0.15)',
    'rgba(84, 89, 104, 0.15)',
];

const Lengend = ({name, items, index}) => {
    let value = items?.find?.((itm) => itm.name === name)?.value;
    return (
        <View style={[styles.lengendItemWrap, index % 2 === 0 ? {paddingRight: px(8)} : {paddingLeft: px(8)}]}>
            <View style={[styles.circle_black, {backgroundColor: colors[index], borderColor: areaColors[index]}]} />
            <Text style={styles.langendWrapRightName} numberOfLines={1}>
                {name}
            </Text>
            <Text
                style={[styles.langendWrapRightRate, {color: value?.slice?.(0, -1) > 0 ? '#E74949' : '#4BA471'}]}
                numberOfLines={1}>
                {value || '0.00%'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: px(12),
        backgroundColor: '#fff',
    },
    title: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
    titleText: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#121D3A',
    },
    content: {},
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: px(12),
        paddingVertical: px(5),
        borderRadius: px(15),
    },
    legendsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px(16),
        marginHorizontal: px(16),
    },
    lengendItemWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
    },
    circle_black: {
        width: px(5),
        height: px(5),
        borderRadius: px(5),
        borderWidth: px(3),
    },
    langendWrapRightRate: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        marginLeft: px(4),
        flex: 1,
        textAlign: 'right',
    },
    langendWrapRightName: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
        width: px(98),
        marginLeft: px(4),
    },
});

const deviceWidth = Dimensions.get('window').width;
const baseAreaChart = (
    data,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    height = px(207),
    showDate = true,
    max = null // 是否使用对象里自带的颜色
) => {
    return `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    width: ${width},
    height:${height},
    appendPadding: ${JSON.stringify(appendPadding)},
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 3,
    range: [0, 1]
  });
  chart.scale('value', {
    tickCount: 5,
    // range: [ 0, 1 ],
    max: ${JSON.stringify(max)},
    formatter: (value) => {
      return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
    }
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1 ) {
        textCfg.textAlign = 'right';
      }
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('value', {
    label: function label(text) {
      const cfg = {};
      cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
      cfg.fontFamily = 'DINAlternate-Bold';
      return cfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    crosshairsStyle: ${JSON.stringify(showDate)} ? {
      stroke: ${JSON.stringify(colors[0])},
      lineWidth: 0.5,
      lineDash: [2],
    } : {},
    crosshairsType: 'y',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    showXTip: ${JSON.stringify(showDate)},
    // showYTip: true,
    snap: false,
    tooltipMarkerStyle: {
      radius: 1
    },
    // triggerOn: ['touchstart', 'touchmove'],
    // triggerOff: 'touchend',
    // xTipBackground: {
    //   fill: '#E74949',
    // },
    // yTipBackground: {
    //   fill: '#E74949',
    // },
  });
 
  chart.line()
    .position('date*value')
    .shape('smooth')
    .color('type',${JSON.stringify(colors)})
   
    .animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 500
      }
    })
    .style('type', {
      lineWidth: 1,
      lineDash(val) {
        if (val === '底线') return [4, 4, 4];
        else return [];
      }
    });
  chart.render();
})();
`;
};
