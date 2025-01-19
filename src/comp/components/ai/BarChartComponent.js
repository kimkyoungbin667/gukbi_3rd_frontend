import React from 'react';
import Chart from 'react-apexcharts';
import '../../css/ai/barchart.css';

const BarChartComponent = ({ title, myData, breedAvg, unit, name, breed }) => {
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: 'studyGood, sans-serif'  // ✅ 전체 차트 기본 폰트 적용
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val}${unit}`,
            style: {
                fontSize: '20px',  // ✅ 데이터 라벨 폰트 크기
                fontFamily: 'studyGood',  // ✅ 데이터 라벨 폰트 적용
                fontWeight: 'bold',
                colors: ['#333'],  // ✅ 데이터 라벨 색상
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: [title],
            labels: {
                style: {
                    fontSize: '25px',  // ✅ X축 레이블 폰트 크기
                    fontFamily: 'studyGood',  // ✅ X축 폰트 적용
                    fontWeight: '500',
                    colors: ['#333'],
                },
            },
            title: {
                style: {
                    fontSize: '20px',
                    fontFamily: 'studyGood',  // ✅ X축 타이틀 폰트 적용
                    fontWeight: 'bold',
                }
            }
        },
        yaxis: {
            title: {
                text: unit,
                style: {
                    fontSize: '20px',
                    fontFamily: 'studyGood',  // ✅ Y축 타이틀 폰트 적용
                    fontWeight: 'bold',
                }
            },
            labels: {
                style: {
                    fontSize: '20px',  // ✅ Y축 레이블 폰트 크기
                    fontFamily: 'studyGood',
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            style: {
                fontSize: '14px',
                fontFamily: 'studyGood',  // ✅ 툴팁 폰트 적용
            },
            y: {
                formatter: (val) => `${val}${unit}`
            }
        },
        colors: ['#82ca9d', '#C5BAFF'],  // ✅ 내 반려동물: 초록, 품종 평균: 보라
        legend: {
            position: 'top',
            fontSize: '20px',
            fontFamily: 'studyGood',  // ✅ 범례 폰트 적용
            fontWeight: 'bold',
            labels: {
                colors: '#333',
            }
        }
    };

    const chartSeries = [
        {
            name: name,
            data: [parseFloat(myData)]
        },
        {
            name: `${breed} 평균`,
            data: [parseFloat(breedAvg)]
        }
    ];

    return (
        <div className="barchart-comparetitle">
            <h4>{title} 비교</h4>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
    );
};

export default BarChartComponent;
