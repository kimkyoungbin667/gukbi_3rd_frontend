import React, { useEffect, useState } from "react";
import '../../css/ai/aisolution.css';
import animalBoard from '../../../assets/img/ai/dd.png';
import animalPost from '../../../assets/img/ai/animalPost.png';
import BarChartComponent from './BarChartComponent';
import { getAnimalList, getAnimalDetail, getAiSolution } from "../../api/ai";

function AiSolution() {
  const [animalData, setAnimalData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedPetId, setSelectedPetId] = useState('');
  const [solutionResult, setSolutionResult] = useState("");  // ✅ 솔루션 결과
  const [loading, setLoading] = useState(false);             // ✅ 로딩 상태

  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);

  // 1. 반려동물 목록 불러오기
  useEffect(() => {
    getAnimalList()
      .then(res => {
        setAnimalData(res.data.data);
      })
      .catch(err => {
        console.error("반려동물 목록 불러오기 실패:", err);
      });
  }, []);

  // 2. 모달 열기 (petId 선택)
  const imsi = (petId) => {
    setSelectedPetId(petId);
    setIsModalOpen(true);
  };

  // 3. 솔루션 요청
  const handleSolution = async () => {
    // 🔒 날짜 유효성 검사
    if (!selectedStartDate || !selectedEndDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    if (selectedStartDate > selectedEndDate) {
      alert("시작일은 종료일보다 이전이어야 합니다.");
      return;
    }

    const requestData = {
      petId: selectedPetId,
      startDate: selectedStartDate,
      endDate: selectedEndDate
    };

    try {
      setLoading(true);

      const res = await getAiSolution(requestData);

      if (res.data) {
        console.log("✅ 솔루션 응답:", res.data);
        setSolutionResult(res.data);
      } else {
        console.warn("⚠️ 솔루션 응답이 없습니다.");
        alert("솔루션 응답이 없습니다.");
      }

    } catch (err) {
      console.error("❌ 솔루션 요청 실패:", err);
      alert("솔루션 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsSolutionModalOpen(true);
  }, [solutionResult])

  // 4. 모달 제출
  const handleModalSubmit = () => {
    handleSolution();
    setIsModalOpen(false);
    setSelectedStartDate("");
    setSelectedEndDate("");
  };

  // 5. 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStartDate("");
    setSelectedEndDate("");
  };

  return (
    <div className="ai-solution-container">
      <div className="ai-solution-board">
        <p className="ai-solution-main-title">🤖 AI 솔루션</p>

        {/* Board 배경 */}
        <div className="ai-solution-board">

          <div className="ai-solution-choice-inside">
            <p>👉 솔루션할 반려동물을 선택해주세요</p>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>솔루션 날짜 선택</h2>

                <label>시작일</label>
                <input
                  type="date"
                  value={selectedStartDate}
                  onChange={e => setSelectedStartDate(e.target.value)}
                  className="date-picker"
                />

                <label>종료일</label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={e => setSelectedEndDate(e.target.value)}
                  className="date-picker"
                />

                <div className="modal-buttons">
                  <button onClick={handleModalSubmit} className="confirm-button">
                    확인
                  </button>
                  <button onClick={handleModalClose} className="cancel-button">
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* 반려동물 카드 */}
          <div className="animal-list-board">
            {animalData.map((animal, index) => (
              <div
                className="ai-solution-card"
                key={index}
              >
                <img src={animalPost} className="ai-solution-background" alt="Animal Card" />
                <div className="animal-info">
                  <img
                    src={`http://58.74.46.219:33334/upload/${animal.profileUrl}`}
                    alt="반려동물 사진"
                    className="my-animal-picture"
                  />
                  <p className="my-animal-name">{animal.dogName}</p>
                  <p className="my-animal-kind">{animal.kindName}</p>
                  <button
                    type="button"
                    className="start-ai-solution"
                    onClick={() => imsi(animal.petId)}
                  >
                    솔루션 시작
                  </button>
                </div>
              </div>
            ))}
          </div>



          {/* 로딩 상태 표시 - 모달로 변경 */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-message">
                ⏳ 솔루션을 준비 중입니다...
              </div>
            </div>
          )}

          {/* 솔루션 영역 */}
          {isSolutionModalOpen && solutionResult && (
            <div className="solution-modal-overlay">
              <div className="solution-modal-content">
                <p className="ai-resulttitle">📄 AI 솔루션 결과</p>

                {/* 반려동물 정보 */}
                <section>
                  {solutionResult && solutionResult.animalInfo ? (
                    <div className="animal-info-area">
                      <div className="animal-info-inline">
                        <span>{`${solutionResult.animalInfo.name}(${solutionResult.animalInfo.breed})`}</span>
                        <span>{solutionResult.animalInfo.age}</span>
                      </div>
                    </div>
                  ) : (
                    <p>솔루션 중...</p>
                  )}
                </section> <br />

                {/* 각 항목 비교 */}
                <span className="compare-title">📊 평균 수치 비교</span>
                <div className="chart-row">

                  {/* 운동 거리 비교 */}
                  <div className="chart-box">
                    {solutionResult && solutionResult.summaryData && solutionResult.averageData ? (
                      <BarChartComponent
                        title="🐾 운동 거리"
                        myData={solutionResult.summaryData.totalExerciseDistance}
                        breedAvg={solutionResult.averageData.averageExerciseDistance}
                        unit="km"
                        name={solutionResult.animalInfo.name}
                        breed={solutionResult.animalInfo.breed}
                      />
                    ) : (
                      <div className="loading-overlay">
                        <div className="loading-message">
                          솔루션 준비중...
                        </div>
                      </div>
                    )}
                  </div>




                  {/* 운동 시간 비교 */}
                  <div className="chart-box">
                    {solutionResult && solutionResult.summaryData && solutionResult.averageData ? (
                      <BarChartComponent
                        title="⏱️ 운동 시간"
                        myData={solutionResult.summaryData.totalExerciseTime}
                        breedAvg={solutionResult.averageData.averageExerciseTime}
                        unit="분"
                        name={solutionResult.animalInfo.name}
                        breed={solutionResult.animalInfo.breed}
                      />
                    ) : (
                      <p>운동 시간 정보를 불러오는 중입니다...</p>
                    )}
                  </div>

                  {/* 식사량 비교 */}
                  <div className="chart-box">
                    {solutionResult && solutionResult.summaryData && solutionResult.averageData ? (
                      <BarChartComponent
                        title="🍖 식사량"
                        myData={solutionResult.summaryData.totalMealAmount}
                        breedAvg={solutionResult.averageData.averageMealAmount}
                        unit="g"
                        name={solutionResult.animalInfo.name}
                        breed={solutionResult.animalInfo.breed}
                      />
                    ) : (
                      <p>식사량 정보를 불러오는 중입니다...</p>
                    )}
                  </div>

                  {/* 물 섭취량 비교 */}
                  <div className="chart-box">
                    {solutionResult && solutionResult.summaryData && solutionResult.averageData ? (
                      <BarChartComponent
                        title="💧 물 섭취량"
                        myData={solutionResult.summaryData.totalWaterIntake}
                        breedAvg={solutionResult.averageData.averageWaterIntake}
                        unit="mL"
                        name={solutionResult.animalInfo.name}
                        breed={solutionResult.animalInfo.breed}
                      />
                    ) : (
                      <p>물 섭취량 정보를 불러오는 중입니다...</p>
                    )}
                  </div>

                </div> <br /> <br />

                <section className="solution-section">
                  {solutionResult.solutions ? (
                    <>
                      {/* 🏃 운동 솔루션 */}
                      <div className="solution-box solution-workarea">
                        <h4 className="solution-title">🐕 운동 솔루션</h4>
                        <p className="solution-content">{solutionResult.solutions.exercise}</p>
                      </div>

                      {/* 🩺 의료 솔루션 */}
                      <div className="solution-box solution-medicalarea">
                        <h4 className="solution-title">🩺 의료 솔루션</h4>
                        <p className="solution-content">{solutionResult.solutions.medical}</p>
                      </div>

                      {/* 🍖 식단 솔루션 */}
                      <div className="solution-box solution-foodarea">
                        <h4 className="solution-title">🍖 식단 솔루션</h4>
                        <p className="solution-content">{solutionResult.solutions.diet}</p>
                      </div>

                      {/* 💧 물 섭취 솔루션 */}
                      <div className="solution-box solution-waterintake">
                        <h4 className="solution-title">💧 물 섭취 솔루션</h4>
                        <p className="solution-content">
                          {solutionResult.solutions.waterIntake}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>솔루션 정보를 불러오는 중입니다...</p>
                  )}
                </section> <br /><br />


                {/* ==================== 의료 기록 ====================*/}
                <section>
                  <h3>🩺 의료 기록</h3>
                  <div className="medical-table-area">
                    {solutionResult && solutionResult.medicalRecords && solutionResult.medicalRecords.length > 0 ? (
                      <table className="medical-table">
                        <thead>
                          <tr>
                            <th>📝 설명</th>
                            <th>📅 진료일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solutionResult.medicalRecords.map((record, index) => (
                            <tr key={index}>
                              <td>{record.description}</td>
                              <td>{record.day.substring(0, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>의료 기록이 없습니다.</p>
                    )}
                  </div>
                  <br />
                </section> <br /> <br />



                {/* 📌 전반적인 상태 */}
                <div className="solution-box solution-overall">
                  <h4 className="solution-title">📌 전체적인 솔루션</h4>
                  <p className="solution-content">{solutionResult.solutions.overall}</p>
                </div>
                {/* 닫기 버튼 */}
                <button onClick={() => setIsSolutionModalOpen(false)} className="solution-close-button">
                  닫기
                </button>
              </div>
            </div>
          )
          }
        </div>
      </div >
    </div >





  );
}

export default AiSolution;
