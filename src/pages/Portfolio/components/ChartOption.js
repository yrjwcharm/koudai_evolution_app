/*
 * @Date: 2021-02-05 14:32:45
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-16 10:24:11
 * @Description: 基金相关图表配置
 */
// 交互图例
import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
export const baseAreaChart = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ],
    areaColors,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    tag_position = {},
    height = 220
) => `
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
    range: [ 0, 1 ],
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
      return textCfg;
    }
  });
  chart.axis('value', {
    label: function label(text) {
      const cfg = {};
      cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(1) + "%" : parseFloat(text) + "%";
      return cfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    // crosshairsStyle: {
    //   stroke: '#E74949',
    //   lineWidth: 0.5,
    //   lineDash: [2],
    // },
    crosshairsType: 'y',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    // showXTip: true,
    // showYTip: true,
    // snap: true,
    tooltipMarkerStyle: {
      radius: 1
    },
    // triggerOn: ['touchstart', 'touchmove'],
    // triggerOff: 'touchend',
    xTipBackground: {
      fill: '#E74949',
    },
    yTipBackground: {
      fill: '#E74949',
    },
  });
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.buy)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.buy?.position)},
        content: ${JSON.stringify(tag_position?.buy?.name)},
        limitInPlot:true,
        background: {
          fill: '#E74949',
          padding: 2,
        },
        pointStyle: {
          fill: '#E74949'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.redeem)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.redeem?.position)},
        content: ${JSON.stringify(tag_position?.redeem?.name)},
        limitInPlot:true,
        background: {
          fill: '#4BA471',
          padding: 2,
        },
        pointStyle: {
          fill: '#4BA471'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.adjust)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.adjust?.position)},
        content: ${JSON.stringify(tag_position?.adjust?.name)},
        limitInPlot:true,
        background: {
          fill: '#0051CC',
          padding: 2,
        },
        pointStyle: {
          fill: '#0051CC'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
  chart.area({startOnZero: false})
    .position('date*value')
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
    .color('type', ${JSON.stringify(colors)})
   
    .animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 500
      }
    })
    .style({
      lineWidth: 1
    });
    chart.point().position('date*value').size('tag', function(val) {
      return val ? 3 : 0;
    }).style('tag', {
      fill: function fill(val) {
        if (val === 2) {
          return '#4BA471';
        } else if (val === 1) {
          return '#E74949';
        }else if (val === 3) {
            return '#0051CC';
         }
      },
      stroke: '#fff',
      lineWidth: 1
    });
  chart.render();
})();
`;

export const areaChart = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ],
    areaColors,
    alias = {},
    percent = false,
    tofixed = 2
) => `
(function(){
chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
  padding: [56, 'auto', 'auto']
});
chart.source(${JSON.stringify(data)});
chart.scale({
  date: {
    type: 'timeCat',
    tickCount: 3,
    range: [0, 1]
  },
  value: {
    alias: '${alias.value || ''}',
    tickCount: 5,
    range: [ 0, 1 ],
    formatter: (value) => {
      return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value'};
    }
  }
});
chart.axis('date', {
  label: function label(text, index, total) {
    const textCfg = {};
    if (index === 0) {
      textCfg.textAlign = 'left';
    } else if (index === total - 1) {
      textCfg.textAlign = 'right';
    }
    return textCfg;
  }
});
chart.axis('value', {
  label: (text) => {
    const cfg = {};
    cfg.text = ${percent ? '(text * 100).toFixed(' + tofixed + ') + "%"' : '(text * 1).toFixed(' + tofixed + ')'};
    return cfg;
  }
});
chart.legend(false);
chart.tooltip({
  background: {
    padding: [10]
  }, // tooltip 内容框的背景样式
  crosshairsStyle: {
    stroke: '#E74949',
    lineWidth: 0.5,
    lineDash: [2],
  },
  showCrosshairs: true,
  showItemMarker: false, // 是否展示每条记录项前面的 marker
  showTitle: true, // 展示  tooltip 的标题
  tooltipMarkerStyle: {
    fill: ${JSON.stringify(colors[0])}, // 设置 tooltipMarker 的样式
    lineWidth: 0.5,
    radius: 2
  },
  layout: 'vertical'
});
chart.area({startOnZero: false})
  .position('date*value')
  .color(${JSON.stringify(areaColors)})
  .shape('smooth')
  .animate({
    appear: {
      animation: 'groupWaveIn',
      duration: 500
    }
  });
chart.line()
  .position('date*value')
  .color(${JSON.stringify(colors)})
  .shape('smooth')
  .animate({
    appear: {
      animation: 'groupWaveIn',
      duration: 500
    }
  })
  .style({
    lineWidth: 1.5,
  });
chart.render();
})();
`;

// 交互图例
export const baseLineChart = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ],
    percent = false,
    tofixed = 2
) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 3,
    range: [0, 1]
  });
  chart.scale('value', {
    tickCount: 5,
    range: [ 0, 1 ],
    formatter: (value) => {
      return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
    }
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    // crosshairsStyle: {
    //   stroke: '#E74949',
    //   lineWidth: 0.5,
    //   lineDash: [2],
    // },
    crosshairsType: 'y',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    // showXTip: true,
    // showYTip: true,
    // snap: true,
    tooltipMarkerStyle: {
      // fill: '#E74949',
      // stroke: '#E74949',
      radius: 1
    },
    // triggerOn: ['touchstart', 'touchmove'],
    // triggerOff: 'touchend',
    xTipBackground: {
      fill: '#E74949',
    },
    yTipBackground: {
      fill: '#E74949',
    },
  });
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify(colors)})
    .animate({
      appear: {
          animation: 'groupWaveIn',
          duration: 1000
      }
    });
  chart.render();
})();
`;

export const percentStackColumn = (
    data,
    type = 'stack',
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ],
    appendPadding = [15, 25, 15, 15]
) => `
(function(){
  chart = new F2.Chart({
    appendPadding: ${JSON.stringify(appendPadding)},
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    height: 240,
    width: ${deviceWidth}
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 2,
    // sortable: false,
    range: [0, 1]
  });
  chart.scale('percent', {
    min: 0,
    tickCount: 3,
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.axis('percent', {
    label: function label(text) {
      const cfg = {};
      cfg.text = text / 100 + '%';
      return cfg;
    }
  });
  chart.legend('type', {
    position: 'bottom',
    align: 'center',
    itemMarginBottom: 6,
    // itemWidth: 80,
    marker: {
      symbol: 'circle', // marker 的形状
      radius: 5 // 半径大小
    },
    offsetX: -12,
    titleStyle: {
      fontSize: 13,
      color: '#4E556C',
    },
  });
  chart.tooltip(false);
  chart.interval()
    .position('date*percent')
    .color('type', ${JSON.stringify(colors)})
    .adjust('${type}')
    .size(10);
  chart.render();
})();
`;

export const dodgeColumn = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ]
) => `
(function(){
chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
});
chart.source(${JSON.stringify(data)}, {
  value: {
    tickCount: 5,
    formatter: function formatter(val) {
      return (val * 100).toFixed(2) + '%';
    },
  }
});
chart.axis('value', {
  label: function label(text) {
    const number = parseFloat(text);
    const cfg = {};
    cfg.text = number.toFixed(0) + "%";
    return cfg;
  }
});
chart.legend(false);
chart.tooltip({
  custom: true,
  onChange: function(obj) {
    window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
  },
  onHide: function(obj) {
    window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
  },
});
chart.interval()
  .position('date*value')
  .color('type', ${JSON.stringify(colors)})
  .adjust('dodge')
  .size(10);
chart.render();
})();
`;

export const basicPieChart = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ]
) => `
(function(){
  const map = {};
  ${JSON.stringify(data)}.forEach((item) => {
    map[item.name] = item.percent.toFixed(2) + '%';
  });
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    width:${deviceWidth - 50},
    height: 300,
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('percent', {
    formatter: function formatter(val) {
      return val + '%';
    }
  });
  chart.legend({
    position: 'bottom',
    align: 'center',
    itemMarginBottom: 6,
    itemFormatter: function itemFormatter(val) {
      return val + '  ' + map[val];
    },
    marker: {
      symbol: 'circle', // marker 的形状
      radius: 5 // 半径大小
    },
    titleStyle: {
      fontSize: 13,
      color: '#4E556C',
    },
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.7,
    radius: 0.85
  });
  chart.axis(false);
  chart.tooltip(false);
  chart.interval()
    .position('a*percent')
    .color('name', ${JSON.stringify(colors)})
    .adjust('stack');
  chart.render();
})();
`;
