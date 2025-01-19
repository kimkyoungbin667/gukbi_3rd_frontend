import React, { useState, useEffect } from "react";
import { getMedicalRecords, addMedicalRecord, deleteMedicalRecord } from "../../api/pet";
import "../../css/pet/MedicalHistory.css"; // CSS 파일 연결

function MedicalHistory({ petId }) {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    record_type: "vaccination",
    record_date: "",
    description: "",
    next_due_date: "",
    clinic_name: "",
    vet_name: "",
    notes: "",
  });

  // 의료 기록 가져오기
  const fetchMedicalRecords = async () => {
    try {
      const data = await getMedicalRecords(petId);
      setRecords(data);
      setFilteredRecords(data); // 초기화 시 모든 기록 표시
    } catch (error) {
      console.error("의료 기록 로드 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [petId]);

  // 검색 처리
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = records.filter((record) =>
      record.description.toLowerCase().includes(term) || // 내용 검색
      record.clinic_name?.toLowerCase().includes(term) || // 병원 이름 검색 (null 처리)
      record.record_date.includes(term) // 날짜 검색
    );

    setFilteredRecords(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedicalRecord({ ...form, pet_id: petId });
      setForm({
        record_type: "vaccination",
        record_date: "",
        description: "",
        next_due_date: "",
        clinic_name: "",
        vet_name: "",
        notes: "",
      });
      await fetchMedicalRecords();
      alert("의료 기록이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("의료 기록 추가 실패:", error.message);
      alert("의료 기록 추가에 실패했습니다.");
    }
  };

  const handleDelete = async (medicalId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteMedicalRecord(medicalId);
      await fetchMedicalRecords();
      alert("의료 기록이 삭제되었습니다.");
    } catch (error) {
      console.error("의료 기록 삭제 실패:", error.message);
      alert("의료 기록 삭제에 실패했습니다.");
    }
  };

  if (loading) return <p className="loading">의료 기록 로딩 중...</p>;

  return (
    <div className="medical-history-container">
      <h3 className="medical-history-header">의료 기록</h3>
      
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="내용, 병원 이름, 날짜로 검색..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="medical-history-grid">
        {/* 의료 기록 추가 폼 */}
        <form onSubmit={handleSubmit} className="medical-form">
          <h4 className="form-title">새 기록 추가</h4>
          <div className="form-group">
            <label>기록 유형:</label>
            <select name="record_type" value={form.record_type} onChange={handleChange}>
              <option value="vaccination">예방접종</option>
              <option value="treatment">치료</option>
            </select>
          </div>
          <div className="form-group">
            <label>기록 날짜:</label>
            <input type="date" name="record_date" value={form.record_date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>내용:</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>다음 접종 예정일:</label>
            <input type="date" name="next_due_date" value={form.next_due_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>병원 이름:</label>
            <input type="text" name="clinic_name" value={form.clinic_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>수의사 이름:</label>
            <input type="text" name="vet_name" value={form.vet_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>특이 사항:</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-button">추가</button>
        </form>

        {/* 의료 기록 목록 */}
        <div className="medical-records-list">
          <h4 className="list-title">기존 기록</h4>
          {filteredRecords.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.medical_id} className="medical-record-card">
                <button
                  onClick={() => handleDelete(record.medical_id)}
                  className="delete-button"
                >
                  삭제
                </button>
                <p>
                  <span className="icon">🩺</span><span>기록 유형:</span> {record.record_type === "vaccination" ? "예방접종" : "치료"}
                </p>
                <div className="field-divider"></div>
                <p>
                  <span className="icon">📅</span><span>기록 날짜:</span> {record.record_date}
                </p>
                <div className="field-divider"></div>
                <p>
                  <span className="icon">📝</span><span>내용:</span> {record.description}
                </p>
                {record.next_due_date && (
                  <>
                    <div className="field-divider"></div>
                    <p>
                      <span className="icon">🔔</span><span>다음 접종 예정일:</span> {record.next_due_date}
                    </p>
                  </>
                )}
                {record.clinic_name && (
                  <>
                    <div className="field-divider"></div>
                    <p>
                      <span className="icon">🏥</span><span>병원 이름:</span> {record.clinic_name}
                    </p>
                  </>
                )}
                {record.vet_name && (
                  <>
                    <div className="field-divider"></div>
                    <p>
                      <span className="icon">👨‍⚕️</span><span>수의사 이름:</span> {record.vet_name}
                    </p>
                  </>
                )}
                {record.notes && (
                  <>
                    <div className="field-divider"></div>
                    <p>
                      <span className="icon">💡</span><span>특이 사항:</span> {record.notes}
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;
