/*
 * @Date: 2021-02-05 14:32:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-03 19:34:20
 * @Description: 基金相关图表配置
 */
// 交互图例
import {Dimensions, Platform} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
import {px as text} from '../../../utils/appUtil';
export const baseAreaChart = (
    data,
    colors = [
        '#E1645C',
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    areaColors,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    tag_position = {},
    height = 220,
    max = null,
    showArea = true,
    showDate = false,
    ownColor = false, // 是否使用对象里自带的颜色
    snap = false
) => {
    // 处理颜色分割
    let splitTag = tag_position?.splitTag;
    if (splitTag) {
        let sameTypeArr = data.filter((item) => item.type === splitTag.type);
        let splitTagIndex = sameTypeArr.indexOf(splitTag);
        if (splitTagIndex > 0) {
            let insertObj = {
                ...sameTypeArr[splitTagIndex],
                line: sameTypeArr[splitTagIndex - 1].line,
                area: sameTypeArr[splitTagIndex - 1].area,
            };
            data.push(insertObj);
        }
    }
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
    snap: ${snap},
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
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.buy)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.buy?.position)},
        content: ${JSON.stringify(tag_position?.buy?.name)},
        limitInPlot:true,
        offsetY: -5,
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
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position.splitTag)}){
      chart.guide().tag({
        position: [${JSON.stringify(splitTag?.date)},${JSON.stringify(splitTag?.value)}],
        content: ${JSON.stringify(splitTag?.text)},
        limitInPlot:true,
        offsetY: -9,
        offsetX: 0,
        direct: 'tc',
        background: {
          fill: '#545968',
          padding: [4, 4],
        },
        pointStyle: {
          fill: '#545968',
          r: 5,
        },
        textStyle: {
          fontSize: 11, // 字体大小
        }
      });
    }

    if(${JSON.stringify(showArea)}){
      chart.area({startOnZero: false, connectNulls: ${!!splitTag}})
        .position('date*value')
        .shape('smooth')
        .color(${ownColor} ? 'area' : 'type',${ownColor} ? function(color){
          return color
        } :  ${JSON.stringify(areaColors)})
        .animate({
          appear: {
            animation: 'groupWaveIn',
            duration: 500
          }
        });
    }

  chart.line()
    .position('date*value')
    .shape('smooth')
    .color(${ownColor} ? 'line' : 'type',${ownColor} ? function(color){
      return color
    } :  ${JSON.stringify(colors)})
   
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
};

export const areaChart = (
    data,
    colors = [
        '#E1645C',
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    areaColors,
    width = deviceWidth,
    height = text(220),
    alias = {},
    percent = false,
    tofixed = 2
) => `
(function(){
chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
  padding: [56, 'auto', 'auto'],
  width: ${width},
  height: ${height}
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
    textCfg.fontFamily = 'DINAlternate-Bold';
    return textCfg;
  }
});
chart.axis('value', {
  label: (text) => {
    const cfg = {};
    cfg.text = ${percent ? '(text * 100).toFixed(' + tofixed + ') + "%"' : '(text * 1).toFixed(' + tofixed + ')'};
    cfg.fontFamily = 'DINAlternate-Bold';
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
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    percent = false,
    tofixed = 2,
    appendPadding = 10,
    width = deviceWidth - 10,
    height = 220
) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    appendPadding: ${JSON.stringify(appendPadding)},
    width: ${width},
    height: ${height}
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
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('value', {
    label: (text) => {
      const cfg = {};
      cfg.fontFamily = 'DINAlternate-Bold';
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
    .shape('smooth')
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
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    appendPadding = [15, 25, 15, 15]
) => `
(function(){
  chart = new F2.Chart({
    appendPadding: ${JSON.stringify(appendPadding)},
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    height: ${Platform.select({ios: text(230), android: text(234)})},
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
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('percent', {
    label: function label(text) {
      const cfg = {};
      cfg.text = text / 100 + '%';
      cfg.fontFamily = 'DINAlternate-Bold';
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
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    width = deviceWidth,
    appendPadding = [15, 15, 25],
    size = 10,
    marginRatio = 0,
    showGuide = false,
    showTooltip = true,
    profitMode = false // 收益模式 根据正负显示红色和绿色
) => `
(function(){
chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
  width: ${width},
  height: ${text(220)},
  appendPadding: ${JSON.stringify(appendPadding)}
});
chart.source(${JSON.stringify(data)}, {
  value: {
    tickCount: 5,
    formatter: function formatter(val) {
      return (val * 100).toFixed(2) + '%';
    },
  }
});
chart.axis('date', {
  label: function label(text, index, total) {
    const textCfg = {};
    textCfg.text = text;
    textCfg.fontFamily = 'DINAlternate-Bold';
    return textCfg;
  }
});
chart.axis('value', {
  label: function label(text) {
    const number = parseFloat(text);
    const cfg = {};
    cfg.text = number.toFixed(2) + "%";
    cfg.fontFamily = 'DINAlternate-Bold';
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
if (!${showTooltip}) {
  chart.tooltip(false);
}
chart.interval()
  .position('date*value')
  .color(${JSON.stringify(profitMode)} ? 'type*value' : 'type', ${JSON.stringify(profitMode)} ? (type, value) => {
    if (parseFloat(value) > 0) {
      return ${JSON.stringify(colors[0])};
    } else {
      return ${JSON.stringify(colors[1])}
    }
  } : ${JSON.stringify(colors)})
  .adjust({
    type: 'dodge',
    marginRatio: ${marginRatio}
  })
  .size(${size});
chart.render();
if (${showGuide}) {
  const offset = -5;
  const canvas = chart.get('canvas');
  const group = canvas.addGroup();
  ${JSON.stringify(data)}.forEach(function(obj) {
    const point = chart.getPosition(obj);
    group.addShape('text', {
      attrs: {
        x: point.x + (obj.type === '上证指数' ? 13 : -12),
        y: point.y + (obj.value > 0 ? -5 : 15),
        text: (obj.value * 100).toFixed(2) + '%',
        textAlign: 'center',
        textBaseline: 'bottom',
        fill: '#545968',
        fontSize: 10,
        lineHeight: 11,
        fontFamily: 'DINAlternate-Bold'
      }
    });
  });
}
})();
`;

export const basicPieChart = (
    data,
    colors = [
        '#E1645C',
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    height = text(220)
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
    height: ${height},
    appendPadding: [5, 15, 15, 30]
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
    nameStyle: {
      fontSize: 13,
      lineHeight: 18,
      color: '#545968',
    },
  });
  chart.legend(false);
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
