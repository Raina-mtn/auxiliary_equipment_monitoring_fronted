// 水波纹
const waterQulity = ['优', '良', '差']
const water = [80,50,30]
export const waterOption = (data = 1) => ({
    title: {
        show: true,
        text: '总体情况',
        x: '48%',
        y: '59%',
        z: 10,
        textAlign: 'center',
        textStyle: {
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 500
        },
    },
    series: [{
        type: 'liquidFill',
        radius: '80%',
        center: ['50%', '50%'],
        data: [water[data-1] / 100],
        label: {
            normal: {
                formatter: function () {
                    return waterQulity[data - 1];
                },
                textStyle: {
                    color: '#3DFFFF',
                    fontSize: 32,
                }
            }
        },
        color: ['rgba(31,159,251)'],
        backgroundStyle: {
            color: 'rgba(31,159,251,0.5)'
        },
        outline: {
            borderDistance: 10,
            itemStyle: {
                borderWidth: 3,
                borderColor: 'rgba(31,159,251,0.5)',
            }
        },
    }]
})
// 圆形饼图
export const pieOption = (value = 0, text:string, total:number) => ({
    title: [{
        text: '{a|' + value + '}{c|台}',
        x: 'center',
        y: '30%',
        textStyle: {
            rich: {
                a: {
                    fontSize: 36,
                    color: '#3DFFFF',
                    fontWeight: 'bold' //百分比数字
                },

                c: {
                    fontSize: 16,
                    color: '#E2EDFF', //百分符号颜色
                }
            }
        }
    }, {
        text,
        x: 'center',
        y: '60%',
        textStyle: {
            fontSize: 16,
            color: '#E2EDFF',
            fontWeight: 'normal'
        }
    }],

    series: [{
        type: 'pie',
        radius: ['88%', '82%'],
        silent: true,
        clockwise: false,
        startAngle: 90,
        z: 0,
        zlevel: 0,
        label: {
            normal: {
                position: "center",

            }
        },
        data: [{
            value: value,
            name: "",
            itemStyle: {
                normal: {
                    shadowColor: '#4FADFD',
                    shadowBlur: 10,
                    color: { // 完成的圆环的颜色
                        colorStops: [{
                            offset: 0,
                            color: '#4CF8FE' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#098DF9' // 100% 处的颜色
                        }]
                    },
                }
            }
        },
            {
                value: total - value,
                name: "",
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#4FADFD33"
                    }
                }
            }
        ]
    },
    ]
})

export const barOption = (data:any[] = []) => {
    var color = [
        "rgba(99, 231, 183",
        "rgba(119, 200, 250",
    ];
    const sData = data.map((v, index) => ({
        name: v.name,
        color: index > 2 ? `${color[1]})` : `${color[0]})`,
        value: v.data,
        itemStyle: {
            normal: {
                show: true,
                color: {
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        {offset: 0, color: index > 2 ? `${color[1]},0.3)` : `${color[0]},0.3)`},
                        {offset: 1, color: index > 2 ? `${color[1]},1)` : `${color[0]},1)`}
                    ]
                },
                barBorderRadius: 10,
            },
        }
    }))
    return {
        grid: {
            left: "5%",
            right: "5%",
            bottom: "0%",
            top: "8%",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "none",
            },
            formatter: function (params:[any]) {
                return (
                    params[0].name +
                    "<br/>" +
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" + Number(params[0].value)
                );
            },
        },
        xAxis: {
            show: false,
            type: "value",
        },
        yAxis: [
            {
                type: "category",
                inverse: true,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                    inside: false,
                },
                data: data.map(v => v.name),
            },
            {
                type: "category",
                inverse: true,
                axisTick: "none",
                axisLine: "none",
                show: true,
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: "#ffffff",
                        fontSize: "12",
                    },
                },
                data: data.map(v => v.data),
            },
        ],
        series: [
            {
                name: "",
                type: "bar",
                zlevel: 1,
                barWidth: 10,
                data: sData,
                label: {
                    normal: {
                        color: "#b3ccf8",
                        show: true,
                        position: [0, "-20px"],
                        textStyle: {
                            fontSize: 14,
                        },
                        formatter: function (a:any) {
                            return a.name;
                        },
                    },
                },
            },
            {
                name: "背景",
                type: "bar",
                barWidth: 10,
                barGap: "-100%",
                data: data.map(v => v.data),
                itemStyle: {
                    normal: {
                        color: "rgba(255,255,255,0.2)",
                        barBorderRadius: 30,
                    },
                },
            },
        ],
    }
};


export const lineOption = (object:{xData:string[], sData:any[]}) => ({
    color: ['#FDAD39', '#098DF9'],
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        show: true,
        textStyle: {
            color: '#fff'
        },
        top: '5%',
        icon: 'roundRect',
        itemHeight: 2,
        itemWidth: 8
    },
    grid: {
        left: '5%',
        right: '4%',
        bottom: 0,
        top: '20%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: object.xData,
            axisPointer: {
                type: 'shadow'
            },
            boundaryGap: false,
            // 坐标轴线
            axisLine: {
                lineStyle: {
                    color: "#6C8097" //X轴字体颜色
                }
            },
            axisLabel: {
                color: '#E2EDFF'
            }

        }
    ],
    yAxis: [
        {

            type: 'value',
            axisLabel: {
                show: true,
                color: '#E2EDFF'
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                // show:false,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(108,128,151,0.3)' //里面横着的虚线
                }
            }
        },
    ],
    series: object.sData.map((v) => ({
        name: `${v.name}`,
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: {
            normal: {
                width: 1,
            }
        },
        data: v.ydata
    }))
})
