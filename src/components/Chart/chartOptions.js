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
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.axis('value',{
    // grid:null,
    formatter: function formatter(val) {
      return (val*100)+ '%';
    },
    // label:null,
  });
  chart.tooltip(false);
  chart.area()
    .position('date*value')
    .color('type', [ '#E74949', '#545968', '#FFC069' ])
    .shape('smooth').animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    });
  chart.line()
    .position('date*value')
    .color('type', [ '#E74949', '#545968', '#FFC069' ])
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
  });
  chart.scale('value', {
    tickCount: 5,
    // range: [ 0, 1 ],
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
    .color('l(90) 0:#DC4949 1:#ffffff').shape('smooth')
   
    ;
  chart.line()
    .position('date*value')
    .color( '#DC4949').shape('smooth')
    ;
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
