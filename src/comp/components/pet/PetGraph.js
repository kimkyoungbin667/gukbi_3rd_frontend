import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getPetGraphData } from "../../api/pet";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PetGraph = ({ petId }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 가장 가까운 월요일 계산
  const getPreviousMonday = (date) => {
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1; // 일요일(0)은 월요일로부터 6일 차이
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);
    return monday;
  };

  const [startDate, setStartDate] = useState(getPreviousMonday(new Date())); // 기본값: 가장 가까운 월요일

  // 요일 배열
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  const fetchGraphData = async (startDate) => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // API 호출
      const data = await getPetGraphData(petId, {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      // 레이블 업데이트
      const updatedLabels = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${dayOfWeek} (${date.toISOString().split("T")[0]})`;
      });

      // 그래프 데이터 상태 업데이트
      setGraphData({
        labels: updatedLabels,
        datasets: data.datasets.map((dataset) => ({
          ...dataset,
          data: [...dataset.data], // 참조를 깨기 위해 데이터 복사
        })),
      });
    } catch (err) {
      setError("그래프 데이터를 불러오지 못했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(startDate); // 시작 날짜 변경 시 데이터 가져오기
  }, [petId, startDate]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };

  const graphComponents = [
    {
      title: "식사량 (g)",
      datasets: [
        {
          label: "식사량 (g) - 막대",
          data: graphData?.datasets?.find((d) => d.label === "식사량 (g)")?.data || [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          type: "bar",
        },
        {
          label: "식사량 (g) - 선",
          data: graphData?.datasets?.find((d) => d.label === "식사량 (g)")?.data || [],
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    },
    {
      title: "운동 시간 (분)",
      datasets: [
        {
          label: "운동 시간 (분) - 막대",
          data: graphData?.datasets?.find((d) => d.label === "운동 시간 (분)")?.data || [],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          type: "bar",
        },
        {
          label: "운동 시간 (분) - 선",
          data: graphData?.datasets?.find((d) => d.label === "운동 시간 (분)")?.data || [],
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    },
    {
      title: "몸무게 (kg)",
      datasets: [
        {
          label: "몸무게 (kg) - 막대",
          data: graphData?.datasets?.find((d) => d.label === "몸무게 (kg)")?.data || [],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          type: "bar",
        },
        {
          label: "몸무게 (kg) - 선",
          data: graphData?.datasets?.find((d) => d.label === "몸무게 (kg)")?.data || [],
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    },
    {
      title: "물 섭취량 (ml)",
      datasets: [
        {
          label: "물 섭취량 (ml) - 막대",
          data: graphData?.datasets?.find((d) => d.label === "물 섭취량 (ml)")?.data || [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          type: "bar",
        },
        {
          label: "물 섭취량 (ml) - 선",
          data: graphData?.datasets?.find((d) => d.label === "물 섭취량 (ml)")?.data || [],
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label>시작 날짜:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(getPreviousMonday(date))} // 월요일로 강제 설정
            selectsStart
            maxDate={new Date()} // 오늘까지 선택 가능
          />
        </div>
      </div>

      <div className="graphs-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {graphComponents.map((graph, index) => (
          <div key={index} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ textAlign: "center" }}>{graph.title}</h3>
            <Bar
              data={{
                labels: graphData?.labels || [],
                datasets: graph.datasets,
              }}
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    ...options.plugins.title,
                    text: graph.title,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetGraph;
