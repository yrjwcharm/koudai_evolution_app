export const lineUpdate = `
F2.Animate.registerAnimation('lineUpdate', function(updateShape, animateCfg) {
    var cacheShape = updateShape.get('cacheShape'); // 该动画 shape 的前一个状态
    var cacheAttrs = cacheShape.attrs; // 上一个 shape 属性
    var geomType = cacheShape.geomType; // 图形类型
    var oldPoints = cacheAttrs.points; // 上一个状态的关键点
    var newPoints = updateShape.attr('points'); // 当前 shape 的关键点
    var oldLength = oldPoints.length;
    var newLength = newPoints.length;
    var deltaLength = geomType === 'area' ? (oldLength - newLength) / 2 : oldLength - newLength;
    if (deltaLength > 0) {
      var firstPoint = newPoints[0];
      var lastPoint = newPoints[newPoints.length - 1];
      for (var i = 0; i < deltaLength; i++) {
        newPoints.splice(0, 0, firstPoint);
      }
      if (geomType === 'area') {
        for (var j = 0; j < deltaLength; j++) {
          newPoints.push(lastPoint);
        }
      }
    } else {
      deltaLength = Math.abs(deltaLength);
      var firstPoint1 = oldPoints[0];
      var lastPoint1 = oldPoints[oldPoints.length - 1];
      for (var k = 0; k < deltaLength; k++) {
        oldPoints.splice(0, 0, firstPoint1);
      }
      if (geomType === 'area') {
        for (var p = 0; p < deltaLength; p++) {
          oldPoints.push(lastPoint1);
        }
      }
      cacheAttrs.points = oldPoints;
    }
    updateShape.attr(cacheAttrs);
    updateShape.animate().to({
      attrs: {
        points: newPoints
      },
      duration: 1000,
      easing: animateCfg.easing
    });
  });
`;

const base = (data) => `
chart =  new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
  });
chart.source(${JSON.stringify(data)}, {
value: {
  tickCount: 5,
  min: 0
},
date: {
  type: 'timeCat',
  range: [0, 1],
  tickCount: 3
}
});
chart.legend({
  nameStyle: {
    fill: '#333333'
  },
  valueStyle: {
    fill: '#e8541e'
  }
});
chart.tooltip({
  showCrosshairs: true, //显示虚线
  custom: true,
  showXTip: true, //显示x轴提示
  showYTip: true,
  snap: true,
  onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify(obj))
  },
  crosshairsType: 'xy',
  crosshairsStyle: {
    lineDash: [2]
  }
  });
chart.axis('date', {
label: function label(text, index, total) {
  var textCfg = {};
  if (index === 0) {
    textCfg.textAlign = 'left';
  } else if (index === total - 1) {
    textCfg.textAlign = 'right';
  }
  return textCfg;
}
});
`;

export const baseChart = (data, width, height) => `(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    padding:[20,20],
    width:${width},
    appendPadding:0,
    
    height:${height},
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    tickCount: 6,
  });

  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        // textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.axis('value',{
    grid:null,
    label:null,
  });
  chart.tooltip(false);
  chart.area({startOnZero: false})
    .position('date*value')
    .color('type', ${JSON.stringify(['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'])})
    .shape('smooth').animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    });
  chart.line()
    .position('date*value')
    .color('type', [ '#E74949', '#545968', '#FFC069' ])
    .style({
      lineWidth: 1
    })
    .shape('smooth').animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    });
  chart.render();
})()
`;
export const baseComChart = (data, width, height) => `(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    padding:[20,40],
    width:${width},
    height:${height},
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    tickCount: 5,
    formatter: function formatter(val) {
      let date = val.split('-');
      return date[0]+'-'+date[1];
    }
  });
  chart.scale('value', {
    tickCount: 5,
    formatter: function formatter(val) {
      return (val*100)+ '%';
    }
  });

  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        // textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.axis('value',{
    grid:null,
  });
  chart.tooltip(false);
  chart.area({startOnZero: false})
    .position('date*value')
    .color('type', ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'])
    .shape('smooth').animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    });
  chart.line()
    .position('date*value')
    .color('type', ['#E74949', '#545968', 'transparent'])
    .style({
      lineWidth: 1
    })
    .shape('smooth').animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    });
  chart.render();
})()
`;
//发现页小图
export const smChart = (data) => `(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    padding: 0
  });
  chart.source(${JSON.stringify(data)});
  chart.axis(false);
  chart.legend(false);
  chart.tooltip(false);
  chart.area()
    .position('date*value')
    .color('l(90) 0:#DC4949 1:#ffffff').shape('smooth');
  chart.line()
    .position('date*value')
    .color( '#DC4949').style({
      lineWidth: 1
    });
    chart.point().position('date*value').size('tag', function(val) {
      if(typeof val!='string'){
        return val ? 3 : 0;
      }else{
        return 0
      }
    }).style('tag', {
      fill: function fill(val) {
        if (val === 2) {
          return '#4BA471';
        } else if (val === 1) {
          return '#E74949';
        }else if (val === 3) {
            return '#0051CC';
         }else if(val===4){
           return '#EB7121';
         }
      },
      stroke: '#fff',
      lineWidth: 1
    });
  chart.render();
})()
`;

export const dynamicChart = (data) => `
(function(){
    ${lineUpdate}
    ${base(data)}
      chart.line({
        sortable: false
      }).position('date*value').shape('smooth').animate({
        update: {
          animation: 'lineUpdate'
        }
      });
      chart.area({
        sortable: false
      }).position('date*value').shape('smooth').animate({
        update: {
          animation: 'lineUpdate'
        }
      });
      chart.render();
})();
`;
export const gradientArea = (data) => `
(function(){
const chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio
});
chart.source(${JSON.stringify(data)}, {
  time: {
    type: 'timeCat',
    tickCount: 3,
    range: [ 0, 1 ]
  },
  tem: {
    tickCount: 5,
    min: 0
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
chart.tooltip({
  showCrosshairs: true,
  custom: true, // 自定义 tooltip 内容框
  onChange: function onChange(obj) {
    const legend = chart.get('legendController').legends.top[0];
    const tooltipItems = obj.items;
    const legendItems = legend.items;
    const map = {};
    legendItems.forEach(function(item) {
      map[item.name] = item;
    });
    tooltipItems.forEach(function(item) {
      const name = item.name;
      const value = item.value;
      if (map[name]) {
        map[name].value = value;
      }
    });
    legend.setItems(Object.values(map));
  },
  onHide: function onHide() {
    const legend = chart.get('legendController').legends.top[0];
    legend.setItems(chart.getLegendItems().country);
  }
});

chart.area()
  .position('type*value')
  .color('l(90) 0:#E74949 1:#FEFAFA')
  .shape('smooth');
chart.line()
  .position('type*value')
  .color('l(90) 0:#E74949 1:#E74949')
  .shape('smooth');
chart.render()}
)()`;
export const area = (data) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
  });
  
  chart.source(${JSON.stringify(data)}, {
    date: {
      range: [ 0, 1 ],
      type: 'timeCat',
      mask: 'MM-DD'
    },
    value: {
      max: 300,
      tickCount: 4
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange: function onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.forEach(function(item) {
        map[item.name] = item;
      });
      tooltipItems.forEach(function(item) {
        const name = item.name;
        const value = item.value;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide: function onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
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
  chart.area()
    .position('date*value')
    .color('city')
    .adjust('stack');
  chart.line()
    .position('date*value')
    .color('city')
    .adjust('stack');
  chart.render();
})();
`;

export const pie = () => `
(function(){
  var map = {
      '芳华': '40%',
      '妖猫传': '20%',
      '机器之血': '18%',
      '心理罪': '15%',
      '寻梦环游记': '5%',
      '其他': '2%'
    };
    var data = [{
      name: '芳华',
      percent: 0.4,
      a: '1'
    }, {
      name: '妖猫传',
      percent: 0.2,
      a: '1'
    }, {
      name: '机器之血',
      percent: 0.18,
      a: '1'
    }, {
      name: '心理罪',
      percent: 0.15,
      a: '1'
    }, {
      name: '寻梦环游记',
      percent: 0.05,
      a: '1'
    }, {
      name: '其他',
      percent: 0.02,
      a: '1'
    }];
     chart = new F2.Chart({
      id: 'chart',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
      percent: {
        formatter: function formatter(val) {
          return val * 100 + '%';
        }
      }
    });
    chart.legend({
      position: 'right',
      itemFormatter: function itemFormatter(val) {
        return val + '  ' + map[val];
      }
    });
    chart.tooltip(false);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.85
    });
    chart.axis(false);
    chart.interval().position('a*percent').color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']).adjust('stack').style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    }).animate({
      appear: {
        duration: 1200,
        easing: 'bounceOut'
      }
    });
  
    chart.pieLabel({
      activeShape: true,
      lineStyle:{
          opacity:0
      },
      anchorStyle:{
          opacity:0
      }
    });
    chart.render();
    var frontPlot = chart.get('frontPlot');
    var coord = chart.get('coord'); // 获取坐标系对象
    frontPlot.addShape('sector', {
      attrs: {
        x: coord.center.x,
        y: coord.center.y,
        r: coord.circleRadius * coord.innerRadius * 1.2, // 全半径
        r0: coord.circleRadius * coord.innerRadius,
        fill: '#000',
        opacity: 0.15
      }
    });
    chart.get('canvas').draw();
})();
`;

export const LowBuyAreaChart = (_data = [], _colors, _areaColors, tag_position = {}, px, rectArr) => {
    // 如果是两条线 则调换位置 以更改层叠顺序
    let isDoubleLine = !!_data?.[0]?.type;
    const data = isDoubleLine ? _data.reverse() : _data;
    const colors = isDoubleLine ? _colors.reverse() : _colors;
    const areaColors = isDoubleLine ? _areaColors.reverse() : _areaColors;
    return `
(function(){
let tooltip = document.createElement('div');
tooltip.style.position = 'absolute'
tooltip.style.background = 'rgba(0,0,0,0.6)';
tooltip.style.borderRadius = '5px';
tooltip.style.fontSize = '12px';
tooltip.style.lineHeight = '18px';
tooltip.style.color = '#fff';
tooltip.style.padding = '3px 5px';
tooltip.style.top = '5px';
tooltip.style.opacity = 0;
document.body.appendChild(tooltip);

let width = ${px(311)};
let height = ${px(200)};

const data = ${JSON.stringify(data)};
chart = new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
  width: width,
  height: height,
  appendPadding: [10, 10, 10, 0],
});
chart.source(data);
chart.scale('date', {
  type: 'timeCat',
  tickCount: 3,
  range: [0, 1]
});
chart.scale('value', {
  tickCount: 5,
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
    cfg.text = parseFloat(text).toFixed(2);
    cfg.fontFamily = 'DINAlternate-Bold';
    return cfg;
  }
});
chart.legend(false);
chart.tooltip({
  crosshairsStyle: {
    stroke: ${JSON.stringify(colors[0])},
    lineWidth: 0.5,
    lineDash: [2],
  },
  crosshairsType: 'y',
  showCrosshairs: true,
  snap: true,
  tooltipMarkerStyle: {
    radius: 1
  },
  custom: true,
  onHide: function(){
    tooltip.style.opacity = 0;
  },
  onShow: function onShow(ev) {
    if(!ev.items) return;
    const item = ev.items[0];
    let str = '<div>'+item.title+'</div>';
    if(data[0].type){
      str += '<div>跟随信号收益：'+item.value+'</div>'
      str += '<div>不跟随信号收益：'+ev.items[1].value +'</div>'
    }
    tooltip.innerHTML = str;
    let left = 0;
    if(item.x <  (tooltip.offsetWidth / 2)){
      left = item.x + 10;
    }else if (width - item.x < (tooltip.offsetWidth / 2)){
      left = item.x - 10 - tooltip.offsetWidth;
    } else {
      left = item.x - (tooltip.offsetWidth / 2)
    }
    tooltip.style.left = left + 'px';
    tooltip.style.opacity = 1;
  }
});
  chart.area({startOnZero: false, connectNulls: true})
  .position('date*value')
  .shape('smooth')
  .color(${data[0].type ? `'type',` : ''}${JSON.stringify(areaColors)})
  .animate({
      appear: {
      animation: 'groupWaveIn',
      duration: 500
      }
  });

chart.line()
  .position('date*value')
  .shape('smooth')
  .color(${data[0].type ? `'type',` : ''}${JSON.stringify(colors)})
  .animate({
    appear: {
      animation: 'groupWaveIn',
      duration: 500
    }
  })
  .style('type', {
    lineWidth: 1,
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

  if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.buy)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.buy?.position)},
        content: ${JSON.stringify(tag_position?.buy?.name)},
        limitInPlot:true,
        offsetY: -8,
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
    if(${JSON.stringify(rectArr)}){
      ${JSON.stringify(rectArr)}.forEach(item=>{
        chart.guide().rect({ //  分割背景透明区域
          start: [item[0], 'max'], // 左上角
          end: [item[1], 'min'], // 右下角
          style: {
              fill: '#62CF90',
              opacity: 0.2
          }
        });
      })
    }
chart.render();
})();
`;
};

export const LowBuyPanelChart = ({chart: {chart}, desc}) => {
    let ticks = chart.ticks.reduce((memo, cur) => {
        memo[cur[0] * 100] = cur[1];
        return memo;
    }, {});
    let valueArea = chart.value_area;

    let badTickValue = chart?.ticks?.[1]?.[0];
    let axisLabelDistance = badTickValue > 0.3 && badTickValue < 0.7 ? '4' : '0';
    return `
  (function(){
    option = {
      backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#fff' }, { offset: 1, color: '#FBFBFC' }]),
      series: [
        {
          type: 'gauge',
          center: ['50%', '50%'],
          radius:'70%',
          min: 0,
          max: 100,
          splitNumber: 50,
          progress: {
            show: true,
            width: 28
          },
          pointer: {
            show: false
          },
          emphasis: {
            disabled: true
          },
          axisLine: {
            lineStyle: {
              width: 28,
              color: [[1, '#F8F9FA']]
            }
          },
          axisTick: {
            distance: -40,
            splitNumber: 1,
            lineStyle: {
              width: 1,
              color: '#E2E4EA'
            }
          },
          splitLine: {
            show: true,
            distance: -45,
            length: 0,
            lineStyle: {
              width: 1,
              color: '#E2E4EA'
            }
          },
          axisLabel: {
            show: true,
            distance: ${axisLabelDistance},
            color: '#9AA1B2',
            formatter: function (val) {
             let ticks = ${JSON.stringify(ticks)};
            return ticks[val] === '-' ? '' : (ticks[val] || '')
            },
            padding:[0,0,0,0],
            fontSize: 14
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-0%'],
            fontSize: 40,
            fontWeight: 'bolder',
            formatter: '${chart?.marks?.text || ' '}',
            rich:{
                a: {
                   color: '#E74949',
                   fontWeight: '600',
                   fontSize: '24px',
                   lineHeight: 33
                },
                b: {
                   color: '#E74949',
                   fontWeight: '600',
                   fontSize: '14px',
                   lineHeight: 20,
                   verticalAlign:'center',
                },
                c: {
                   color: '#E74949',
                   fontWeight: '600',
                   fontFamily: 'DINAlternate-Bold',
                   verticalAlign:'top',
                   fontSize: '24px',
                   lineHeight: 28
                },
                d:{
                   color: '#121D3A',
                   fontWeight: '600',
                   fontSize: '24px',
                   lineHeight: 33
                },
                e:{
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#121D3A',
                  lineHeight: 17
                },
                f:{
                  fontFamily: 'DINAlternate-Bold',
                  fontWeight: 'bold',
                  color: '#E74949',
                  fontSize: 18,
                  lineHeight: 30
                },
                g:{
                  backgroundColor:'#E74949',
                  color:'#fff',
                  borderRadius: 5,
                  height: 20,
                  width: 60,
                  fontSize:10,
                  lineHeight: 18
                }
            },
            color: 'auto'
          },
          data: [${valueArea.map(([value], idx, arr) => {
              return `{
                  value:${value * 100 >= 100 ? 99.99 : value * 100},
                  itemStyle: {
                      color: ${
                          idx === 0
                              ? arr.length > 1
                                  ? `'#F8F9FA'`
                                  : `new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#F6F7F8' }, { offset: 1, color: '#DAE6FF' }])`
                              : `new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: ${
                                    arr[idx - 1][0]
                                }, color: '#F8F9FA' },{ offset: ${value}, color: '#F9BABA' }])`
                      }
                  }
              }`;
          })}]
        },
        {
          type: 'gauge',
          center: ['50%', '50%'],
          radius:'73%',
          emphasis: {
            disabled: true
          },
          min: 0,
          max: 100,
          progress: {
            show: true,
            width: 6
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[1, '#E2E4EA']]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [${valueArea.map(([value, colour], idx) => {
              return `{
                  value:${value * 100 >= 100 ? 99.99 : value * 100},
                  detail: {
                    show: ${idx > 0 ? `false` : `true`},
                    formatter: '${desc || ' '}',
                    offsetCenter:[0,'70%'],
                    rich:{
                        a:{
                        fontSize: 12,
                        color:'#121D3A',
                        lineHeight: 17,
                        },
                        b:{
                        fontSize: 16,
                        color:'#121D3A',
                        fontFamily:'DINAlternate-Bold',
                        lineHeight: 19,
                        fontWeight: 'bold'
                        },
                    }
                  },
                   itemStyle: {
                      color: '${colour}'
                   }
              }`;
          })}]
        }
      ]
    };
    if(window.ReactNativeWebView){
      chartDom.addEventListener('click',function(){
        window.ReactNativeWebView.postMessage("click")
      });
    }
    option && myChart.setOption(option);
  })()
  `;
};
