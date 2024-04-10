// 告警趋势统计
const qxcolors = ['#9FAE4E', '#FF7729', '#4BADCC', '#FF7729', '#9FAE4E']
export const qxOption = (object: { xData: string[], sData: any[] }) => ({
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: object.sData.map(v => v.name),
        right: '4%',
        textStyle: {	// 设置图例字体
            color: '#fff'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { // 改变x轴颜色 默认不写为黑色
            lineStyle: {
                color: '#fff',
                width: 1 // 这里是为了突出显示加上的
            }
        },
        data: object.xData
    },
    yAxis: {
        type: 'value',
        axisLine: { // 改变y轴颜色 默认不写为黑色
            lineStyle: {
                color: '#fff',
                width: 1 // 这里是为了突出显示加上的
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed', // 背景线为虚线
                color: 'rgba(135,140,147,.8)' // 左侧显示线
            }
        }
    },
    series: object.sData.map((v) => ({
        name: `${v.name}`,
        type: 'line',
        data: v.ydata,
        color: qxcolors[v.index]
    }))
})
// 圆形饼图
export const pieOption = (object: { totalWarnNum: number, data: any[], TypeName: string[], value: string[] }) => ({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        right: '0',
        top: '30%',
        orient: 'vertical',
        data: object.TypeName,
        textStyle: { //图例文字的样式
            color: '#fff',
            fontSize: 12
        },
        formatter: function (name) {
            var index = 0;
            var clientlabels = object.TypeName;
            var clientcounts = object.value;
            var total = 0;
            clientlabels.forEach(function (value, i) {
                total = total + clientcounts[i];
                if (value == name) {
                    index = i;
                }
            });
            return name + "  " + parseInt(clientcounts[index] / total * 100) + '%' + "  " + clientcounts[index];
        }
    },
    series: [
        {
            center: ['30%', '50%'],
            name: 'Access From',
            type: 'pie',
            radius: ['55%', '85%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    color: '#4c4a4a',
                    formatter: '{total|' + object.totalWarnNum + '}' + '\n\r' + '{active|总警告数}',
                    rich: {
                        total: {
                            fontSize: 35,
                            fontFamily: "微软雅黑",
                            color: '#FFFFFF'
                        },
                        active: {
                            fontFamily: "微软雅黑",
                            fontSize: 16,
                            color: '#FFFFFF',
                            lineHeight: 30,
                        },
                    }
                },
                emphasis: {//中间文字显示
                    show: true,
                }
            },
            labelLine: {
                show: false
            },
            data: object.data,
            itemStyle: {
                normal: {
                    color: function (colors) {
                        var colorList = ['#00E900', '#00C1F8', '#D2F900', '#FF7729', '#9FAE4E']
                        return colorList[colors.dataIndex]
                    }
                }
            }
        }
    ]
})