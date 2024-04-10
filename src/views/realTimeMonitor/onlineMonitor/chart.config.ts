export const chartOption = (object: { xData: string[], sData: { name: string, ydata: any[] }[] }, type: 'bar' | 'line') => {
    const series = type === 'line' ? object.sData.map((v) => ({
        name: `${v.name}`,
        type,
        showSymbol: false,
        smooth: true,
        lineStyle: {
            normal: {
                width: 1,
            }
        },
        data: v.ydata
    })) : object.sData.map((v) => ({
        name: `${v.name}`,
        type,
        barWidth: 10,
        data: v.ydata
    }))
    return {
        color: ['#CC654B', '#4EA150'],
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
                boundaryGap: type === 'line' ? false : true,
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
        series
    }
}