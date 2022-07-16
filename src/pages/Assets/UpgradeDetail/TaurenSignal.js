import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';
import {Font} from '~/common/commonStyle';
import {Chart} from '~/components/Chart';
import CompareTable from './CompareTable';

const TaurenSignal = ({onCardHeight}) => {
    const [activeTab, setTabActive] = useState(0);
    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                onCardHeight(1, e.nativeEvent.layout.height);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/probability-signal.png'}}
                    style={{width: px(22), height: px(22), marginRight: px(8)}}
                />
                <Text style={styles.title}>牛人信号</Text>
            </View>
            <View style={styles.ratePanel}>
                <Text style={[styles.rateText, {color: '#121D3A'}]}>2,300.34</Text>
                <View style={styles.panelMiddle}>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png'}}
                        style={styles.panelIcon}
                    />
                    <Text style={styles.pannelDesc}>累计收益</Text>
                </View>
                <Text style={[styles.rateText, {color: '#E74949'}]}>9,560.43</Text>
            </View>
            <View style={{height: px(210)}}>
                {true && (
                    <Chart
                        initScript={baseAreaChart(undefined, true, 2, null, [10, 8, 10, 0])}
                        style={{width: '100%'}}
                    />
                )}
            </View>
            <View style={styles.legendWrap}>
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.rowIcon, {backgroundColor: colors[1]}]} />
                        <Text style={styles.legendRowText}>当前产品名称</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.rowIcon, {backgroundColor: colors[0]}]} />
                        <Text style={styles.legendRowText}>升级后产品名称</Text>
                    </View>
                </View>
            </View>
            <View style={styles.tabsWrap}>
                {[1, 2, 3].map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={idx}
                        style={[styles.tabItem, {backgroundColor: activeTab === idx ? '#DEE8FF' : '#F5F6F8'}]}
                        onPress={() => {
                            setTabActive(idx);
                        }}>
                        <Text style={[styles.tabText, {color: activeTab === idx ? '#0051cc' : '#545968'}]}>
                            持有以来
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.compareTableWrap}>
                <CompareTable />
            </View>
        </View>
    );
};

export default TaurenSignal;

const styles = StyleSheet.create({
    container: {
        padding: px(16),
        backgroundColor: '#fff',
        marginTop: px(12),
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
    ratePanel: {
        paddingTop: px(18),
        paddingBottom: px(8),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelMiddle: {
        marginHorizontal: px(35),
        alignItems: 'center',
    },
    panelIcon: {
        width: px(36),
        height: px(18),
    },
    pannelDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        marginTop: px(3),
        textAlign: 'center',
    },
    rateText: {
        fontSize: px(24),
        lineHeight: px(34),
        fontFamily: Font.numFontFamily,
    },
    legendWrap: {
        paddingHorizontal: px(26),
        marginTop: px(10),
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowIcon: {
        width: px(8),
        height: px(3),
        marginRight: px(4),
    },
    legendRowText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#1e2331',
    },
    tabsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(16),
    },
    tabItem: {
        borderRadius: px(20),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        marginHorizontal: px(6),
    },
    tabText: {
        fontSize: px(12),
        lineHeight: px(17),
    },
    compareTableWrap: {
        marginTop: px(28),
        paddingHorizontal: px(8),
    },
    placeholdText: {
        marginTop: px(20),
        fontSize: px(13),
        lineHeight: px(18),
        color: '#545968',
    },
});

const colors = [
    '#FF7D41',
    '#545968',
    'rgba(225,100,92,0.3)',
    'rgba(102,148,243,0.3)',
    'rgba(248,168,64,0.3)',
    'rgba(204, 143, 221,0.3)',
    'rgba(93, 193, 98,0.3)',
    'rgba(199, 172, 107,0.3)',
    'rgba(98, 196, 199,0.3)',
    'rgba(233, 127, 173,0.3)',
    'rgba(194, 224, 127,0.3)',
    'rgba(177, 180, 197, 0.3)',
    'rgba(231, 139, 97, 0.3)',
    'rgba(134, 131, 201, 0.3)',
    'rgba(235, 221, 105, 0.3)',
];

const areaColors = ['l(90) 0:#FFF9ED 1:#fff', 'transparent'];

const deviceWidth = Dimensions.get('window').width;

const baseAreaChart = (
    data = [
        {
            type: '交银施罗德持续成长',
            value: 0.65,
            date: '2021-07-15',
            line: '',
            area: '',
        },
        {
            type: '交银施罗德持续成长',
            value: 0.5,
            date: '2021-07-16',
            line: '',
            area: '',
        },
        {
            type: '交银施罗德持续成长',
            value: 0.91,
            date: '2021-07-19',
            line: '',
            area: '',
        },
        {
            type: '交银施罗德持续成长',
            value: 0.67,
            date: '2021-07-20',
            line: '',
            area: '',
        },
        {
            type: '交银施罗德持续成长',
            value: 0.85,
            date: '2021-07-21',
            line: '',
            area: '',
        },
        {
            type: '交银施罗德持续成长',
            value: 0.55,
            date: '2021-07-22',
            line: '',
            area: '',
        },
    ],
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    height = px(210),
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
chart.area({startOnZero: false, connectNulls: false})
.position('date*value')
.shape('smooth')
.color('type', ${JSON.stringify(areaColors)})
.animate({
appear: {
  animation: 'groupWaveIn',
  duration: 500
}
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
});
chart.guide().tag({
  position: ['2021-07-16', 0.5],
  content: '你的买点',
  background:{
    fill: '#545968'
  },
  pointStyle:{
    fill: '#545968',
    r: 5, 
  }
});
chart.guide().tag({
  position: ['2021-07-19', 0.91],
  content: '买入信号',
  background:{
    fill: '#048152'
  },
  pointStyle:{
    fill: '#4BA471',
    r: 5, 
  }
});
chart.guide().html({
  position: ['2021-07-22', 0.55],
  html: "<div style='background: rgba(255,125,65,0.15);width:16px;height:16px;border-radius:50%;display:flex;justify-content:center;align-items:center'><div style='background: #FF7D41;width:6px;height:6px;border-radius:50%;'></div></div>",
  alignY: 'bottom',
  offsetY: 5,
});
chart.render();
})();
`;
};
