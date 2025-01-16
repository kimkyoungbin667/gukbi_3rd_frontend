import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // 추가: LineElement 등록 필요
  PointElement, // PointElement도 필요할 수 있음
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getPetGraphData } from "../../api/pet";

// Chart.js에서 필요한 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // 추가
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
        setGraphData(data);
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
        text: "주간 활동 그래프",
      },
    },
  };

  return <Bar data={graphData} options={options} />;
};

export default PetGraph;
