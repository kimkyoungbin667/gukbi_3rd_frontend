import React, { useState, useEffect } from "react";
import { saveDailyRecord, getDailyRecordsBySection, deleteDailyRecord } from "../../api/pet"; // 삭제 API 추가
import "../../css/pet/PetDaily_Record.css";

function PetDailyRecord({ petId }) {
  const [dailyInput, setDailyInput] = useState({
    mealAmount: "",
    exerciseDuration: "",
    exerciseDistance: "",
    weight: "",
    waterIntake: "",
    notes: "",
  });

  const [activeSection, setActiveSection] = useState("meal");
  const [records, setRecords] = useState([]); // 저장된 데이터를 관리

  useEffect(() => {
    // 활성화된 섹션의 데이터를 가져옵니다.
    const fetchRecords = async () => {
      try {
        const data = await getDailyRecordsBySection(petId, activeSection);
        console.log("Fetched Data:", data); // 데이터 확인

        // 오늘 날짜 필터링
        const today = new Date().toISOString().split("T")[0];
        const todayRecords = data.filter(
          (record) => record.activity_date === today
        );

        setRecords(todayRecords); // 오늘 데이터만 상태에 저장
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchRecords();
  }, [petId, activeSection]); // 섹션이 변경될 때마다 실행

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDailyInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toISOString().split("T")[1].split(".")[0];

    const sectionData = {
      pet_id: petId,
      activity_date: currentDate,
      activity_time: currentTime,
    };

    if (activeSection === "meal") {
      sectionData.meal_amount = dailyInput.mealAmount;
      sectionData.water_intake = dailyInput.waterIntake;
    } else if (activeSection === "exercise") {
      sectionData.exercise_duration = dailyInput.exerciseDuration;
      sectionData.exercise_distance = dailyInput.exerciseDistance;
    } else if (activeSection === "weight") {
      sectionData.weight = dailyInput.weight;
      sectionData.notes = dailyInput.notes;
    }

    try {
      await saveDailyRecord(sectionData);
      alert("기록이 저장되었습니다.");
      setDailyInput({});
      setRecords((prev) => [...prev, sectionData]); // 새 데이터 추가
    } catch (error) {
      console.error("기록 저장 실패:", error);
      alert("기록 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("이 기록을 삭제하시겠습니까?")) return;

    try {
      await deleteDailyRecord(recordId); // API 호출
      setRecords((prev) => prev.filter((record) => record.daily_id !== recordId)); // 삭제된 기록 제외
      alert("기록이 삭제되었습니다.");
    } catch (error) {
      console.error("기록 삭제 실패:", error);
      alert("기록 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="daily-record-container">
      <h3 className="daily-record-header">오늘의 기록</h3>
      <div className="section-buttons">
        <button
          className={activeSection === "meal" ? "active" : ""}
          onClick={() => setActiveSection("meal")}
        >
          식사량
        </button>
        <button
          className={activeSection === "exercise" ? "active" : ""}
          onClick={() => setActiveSection("exercise")}
        >
          운동
        </button>
        <button
          className={activeSection === "weight" ? "active" : ""}
          onClick={() => setActiveSection("weight")}
        >
          몸무게
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          {activeSection === "meal" && (
            <>
              <label>식사량 (g):</label>
              <input
                type="number"
                name="mealAmount"
                value={dailyInput.mealAmount}
                onChange={handleChange}
              />
              <label>물 섭취량 (ml):</label>
              <input
                type="number"
                name="waterIntake"
                value={dailyInput.waterIntake}
                onChange={handleChange}
              />
            </>
          )}
          {activeSection === "exercise" && (
            <>
              <label>운동 시간 (분):</label>
              <input
                type="number"
                name="exerciseDuration"
                value={dailyInput.exerciseDuration}
                onChange={handleChange}
              />
              <label>운동 거리 (km):</label>
              <input
                type="number"
                name="exerciseDistance"
                value={dailyInput.exerciseDistance}
                onChange={handleChange}
              />
            </>
          )}
          {activeSection === "weight" && (
            <>
              <label>몸무게 (kg):</label>
              <input
                type="number"
                name="weight"
                value={dailyInput.weight}
                onChange={handleChange}
              />
              <label>특이 사항:</label>
              <textarea
                name="notes"
                value={dailyInput.notes}
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <button type="submit" className="daily-submit-button">
          저장
        </button>
      </form>

      <div className="records-list">
        <h4>오늘 저장된 기록</h4>
        <ul>
          {records.map((record) => (
            <li key={record.daily_id}>
              {activeSection === "meal" && (
                <>
                  <span>식사량: {record.meal_amount || "없음"} g</span>
                  <span>물 섭취량: {record.water_intake || "없음"} ml</span>
                </>
              )}
              {activeSection === "exercise" && (
                <>
                  <span>운동 시간: {record.exercise_duration || "없음"} 분</span>
                  <span>운동 거리: {record.exercise_distance || "없음"} km</span>
                </>
              )}
              {activeSection === "weight" && (
                <>
                  <span>몸무게: {record.weight || "없음"} kg</span>
                  <span>특이 사항: {record.notes || "없음"}</span>
                </>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default PetDailyRecord;
