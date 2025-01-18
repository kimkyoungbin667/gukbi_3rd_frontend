import React, { useState, useEffect } from "react";
import { saveDailyRecord, getDailyRecordsBySection } from "../../api/pet"; // API 호출 추가

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
        setRecords(data); // 데이터를 상태에 저장
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

  return (
    <div>
      <h3>오늘의 기록</h3>
      <div>
        <button onClick={() => setActiveSection("meal")}>식사량</button>
        <button onClick={() => setActiveSection("exercise")}>운동</button>
        <button onClick={() => setActiveSection("weight")}>몸무게</button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeSection === "meal" && (
          <div>
            <label>식사량 (g):</label>
            <input
              type="number"
              name="mealAmount"
              value={dailyInput.mealAmount}
              onChange={handleChange}
            />
            <label>물 섭취량 (리터):</label>
            <input
              type="number"
              name="waterIntake"
              value={dailyInput.waterIntake}
              onChange={handleChange}
            />
          </div>
        )}
        {activeSection === "exercise" && (
          <div>
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
          </div>
        )}
        {activeSection === "weight" && (
          <div>
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
          </div>
        )}
        <button type="submit">저장</button>
      </form>

      <div>
  <h4>저장된 기록</h4>
  <ul>
    {records.map((record, index) => (
      <li key={index}>
        {activeSection === "meal" && (
          <>
            <span>식사량: {record.meal_amount || "없음"} g</span>,{" "}
            <span>물 섭취량: {record.water_intake || "없음"} 리터</span>
          </>
        )}
        {activeSection === "exercise" && (
          <>
            <span>운동 시간: {record.exercise_duration || "없음"} 분</span>,{" "}
            <span>운동 거리: {record.exercise_distance || "없음"} km</span>
          </>
        )}
        {activeSection === "weight" && (
          <>
            <span>몸무게: {record.weight || "없음"} kg</span>,{" "}
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
