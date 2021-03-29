/*
 * @Date: 2021-02-05 14:32:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 14:19:40
 * @Description: 基金相关图表配置
 */
// 交互图例
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
  chart.axis('value', {
    label: function label(text) {
      const cfg = {};
      cfg.text = parseFloat(text) < 1 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
      return cfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    crosshairsStyle: {
      stroke: '#E74949',
      lineWidth: 0.5,
      lineDash: [2],
    },
    crosshairsType: 'xy',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    showXTip: true,
    showYTip: true,
    snap: true,
    tooltipMarkerStyle: {
      fill: '#E74949',
      stroke: '#E74949',
      radius: 2
    },
    triggerOn: ['touchstart', 'touchmove'],
    triggerOff: 'touchend',
    xTipBackground: {
      fill: '#E74949',
    },
    yTipBackground: {
      fill: '#E74949',
    },
  });
  chart.area({startOnZero: false})
    .position('date*value')
    .color('type', ${JSON.stringify(areaColors)})
    .shape('smooth');
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify(colors)})
    .shape('smooth')
    .style({
      lineWidth: 1.5
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
    sortable: false,
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
  .shape('smooth');
chart.line()
  .position('date*value')
  .color(${JSON.stringify(colors)})
  .shape('smooth')
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
    crosshairsStyle: {
      stroke: '#E74949',
      lineWidth: 0.5,
      lineDash: [2],
    },
    crosshairsType: 'xy',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    showXTip: true,
    showYTip: true,
    snap: true,
    tooltipMarkerStyle: {
      fill: '#E74949',
      stroke: '#E74949',
    },
    triggerOn: ['touchstart', 'touchmove'],
    triggerOff: 'touchend',
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
    .shape('smooth');
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
    ]
) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 2,
    sortable: false,
    range: [0, 1]
  });
  chart.scale('percent', {
    min: 0,
    formatter: function formatter(val) {
      return (val * 100).toFixed(0) + '%';
    },
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
  ${JSON.stringify(data)}.forEach(function(obj) {
    map[obj.name] = obj.percent + '%';
  });
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
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
