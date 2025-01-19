import React, { useState, useEffect } from "react";
import { getMedicalRecords, addMedicalRecord, deleteMedicalRecord } from "../../api/pet";
import "../../css/pet/MedicalHistory.css"; // CSS 파일 연결

function MedicalHistory({ petId }) {
  const [records, setRecords] = useState([]);
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

  const fetchMedicalRecords = async () => {
    try {
      const data = await getMedicalRecords(petId);
      setRecords(data);
    } catch (error) {
      console.error("의료 기록 로드 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [petId]);

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
          {records.length === 0 ? (
            <p>의료 기록이 없습니다.</p>
          ) : (
            records.map((record) => (
              <div key={record.medical_id} className="medical-record-card">
                <p>기록 유형: {record.record_type === "vaccination" ? "예방접종" : "치료"}</p>
                <p>기록 날짜: {record.record_date}</p>
                <p>내용: {record.description}</p>
                {record.next_due_date && <p>다음 접종 예정일: {record.next_due_date}</p>}
                {record.clinic_name && <p>병원 이름: {record.clinic_name}</p>}
                {record.vet_name && <p>수의사 이름: {record.vet_name}</p>}
                {record.notes && <p>특이 사항: {record.notes}</p>}
                <button onClick={() => handleDelete(record.medical_id)} className="delete-button">삭제</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;
