import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { getPetGraphData } from "../../api/pet";

// Chart.js에서 필요한 컴포넌트 등록
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

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await getPetGraphData(petId);
        // labels와 날짜를 결합
        const updatedLabels = data.labels.map((day, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index)); // 지난 7일을 계산
          const formattedDate = date.toISOString().split("T")[0]; // 날짜 형식: YYYY-MM-DD
          return `${day} (${formattedDate})`;
        });
        setGraphData({ ...data, labels: updatedLabels });
      } catch (err) {
        setError("그래프 데이터를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [petId]);

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
          data: graphData.datasets.find((d) => d.label === "식사량 (g)").data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          type: "bar",
        },
        {
          label: "식사량 (g) - 선",
          data: graphData.datasets.find((d) => d.label === "식사량 (g)").data,
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
          data: graphData.datasets.find((d) => d.label === "운동 시간 (분)").data,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          type: "bar",
        },
        {
          label: "운동 시간 (분) - 선",
          data: graphData.datasets.find((d) => d.label === "운동 시간 (분)").data,
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
          data: graphData.datasets.find((d) => d.label === "몸무게 (kg)").data,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          type: "bar",
        },
        {
          label: "몸무게 (kg) - 선",
          data: graphData.datasets.find((d) => d.label === "몸무게 (kg)").data,
          borderColor: "rgba(255, 159, 64, 1)",
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
          data: graphData.datasets.find((d) => d.label === "물 섭취량 (ml)").data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          type: "bar",
        },
        {
          label: "물 섭취량 (ml) - 선",
          data: graphData.datasets.find((d) => d.label === "물 섭취량 (ml)").data,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    },
  ];

  return (
    <div className="graphs-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {graphComponents.map((graph, index) => (
        <div key={index} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ textAlign: "center" }}>{graph.title}</h3>
          <Bar
            data={{
              labels: graphData.labels,
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
  );
};

export default PetGraph;
