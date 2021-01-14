/*
 * @Date: 2021-01-14 14:11:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 14:15:07
 * @Description:图表配置
 */
const lineUpdate = `
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
      duration: 800,
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
export const baseChart = (data) => `(function(){
    ${base(data)}
  chart.line().position('date*value');
  chart.point()
  .position('date*value')
  .size('tag', function(val) {
    return val ? 4 : 0;
  })
  .style('tag', {
    fill: function fill(val) {
      if (val === 2) {
        return '#518DFE';
      } else if (val === 1) {
        return '#F35833';
      }
    },
    stroke: '#fff',
    lineWidth: 1
  });
  chart.render();
})();
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
const data = [
    {
        name: '股票类',
        percent: 83.59,
        a: '1',
    },
    {
        name: '债券类',
        percent: 2.17,
        a: '1',
    },
    {
        name: '现金类',
        percent: 14.24,
        a: '1',
    },
];

const map = {};
data.forEach(function (obj) {
    map[obj.name] = obj.percent + '%';
});

export const Pie = () => `
(function(){
new F2.Chart({
  id: 'chart',
  pixelRatio: window.devicePixelRatio,
  padding: [ 20, 'auto' ]
});
chart.source(${JSON.stringify(data)}, {
  percent: {
    formatter: function formatter(val) {
      return val + '%';
    }
  }
});
chart.tooltip(false);
// chart.legend({
//   position: 'right',
//   itemFormatter: function itemFormatter(val) {
//     return val + '    ' + map[val];
//   }
// });
chart.coord('polar', {
  transposed: true,
  innerRadius: 0.7,
  radius: 0.85
});
chart.axis(false);
chart.interval()
  .position('a*percent')
  .color('name', [ '#FE5D4D', '#3BA4FF', '#737DDE' ])
  .adjust('stack');

chart.guide().html({
  position: [ '50%', '45%' ],
  html: <div style="width: 250px;height: 40px;text-align: center;">
      <div style="font-size: 16px">总资产</div>
      <div style="font-size: 24px">133.08 亿</div>
    </div>
});
chart.render();
})()
`;
