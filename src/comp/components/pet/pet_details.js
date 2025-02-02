import React, { useState, useEffect } from "react";
import { getPetDetails, savePetDetails } from "../../api/pet";
import "../../css/pet/PetDetails.css"; // 스타일 파일

function PetDetails({ petId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    birth_date: "",
    health_status: "",
    dietary_requirements: "",
    allergies: "",
    notes: "",
  });

  useEffect(() => {
    console.log("Pet ID:", petId); // petId 값 확인
    const fetchDetails = async () => {
      try {
        const data = await getPetDetails(petId);
        setDetails(data);
        setForm(data);
      } catch (error) {
        console.error("상세정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const details = {
      petId: petId,
      birthDate: form.birth_date,
      healthStatus: form.health_status,
      dietaryRequirements: form.dietary_requirements,
      allergies: form.allergies,
      notes: form.notes,
    };

    try {
      await savePetDetails(details);
      alert("상세정보가 저장되었습니다.");
    } catch (error) {
      console.error("상세정보 저장 실패:", error);
      alert("상세정보 저장에 실패했습니다.");
    }
  };

  if (loading) return <p className="pet-details-loading">로딩 중...</p>;

  return (
    <div className="pet-details-container">
      <h2 className="pet-details-title">상세 정보</h2>
      <form onSubmit={handleSubmit} className="pet-details-grid">
        <div className="pet-details-form-group">
          <label>생년월일:</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            style={{ fontFamily: "StudyGood" }}
            required
          />
        </div>
        <div className="pet-details-form-group">
          <label>건강 상태:</label>
          <input
            type="text"
            name="health_status"
            style={{ fontFamily: "StudyGood" }}
            value={form.health_status}
            onChange={handleChange}
          />
        </div>
        <div className="pet-details-form-group">
          <label>식단 요구사항:</label>
          <textarea
          className="textareaa"
            name="dietary_requirements"
            value={form.dietary_requirements}
            onChange={handleChange}
           
          />
        </div>
        <div className="pet-details-form-group">
          <label>알레르기 정보:</label>
          <textarea
          className="textareaa"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
          />
        </div>
        <div className="pet-details-form-group pet-details-wide">
          <label>특이 사항:</label>
          <textarea
          className="textareaa"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="details-submit">
          저장
        </button>
      </form>
    </div>
  );
}

export default PetDetails;
