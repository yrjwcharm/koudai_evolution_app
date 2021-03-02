/*
 * @Date: 2021-02-05 14:32:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-07 16:45:04
 * @Description: 基金相关图表配置
 */
export const baseAreaChart = (data, colors = null, percent = false, tofixed = 2) => `
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
  chart.area({startOnZero: false})
    .position('date*value')
    .color('type', ${JSON.stringify([colors[0], 'transparent'])})
    .shape('smooth');
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify(colors)})
    .shape('smooth');
  chart.render();
})();
`;

export const baseLineChart = (data, colors = null, percent = false, tofixed = 2) => `
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
