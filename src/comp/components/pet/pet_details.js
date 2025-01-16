import React, { useState, useEffect } from "react";
import { getPetDetails, savePetDetails } from "../../api/pet";

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
    const fetchDetails = async () => {
        try {
          const data = await getPetDetails(petId);
          console.log("API 응답 데이터:", data);
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
      petId: petId, // camelCase로 백엔드와 맞추기
      birthDate: form.birth_date, // snake_case -> camelCase
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
  

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>상세 정보</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>생년월일:</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>건강 상태:</label>
          <input
            type="text"
            name="health_status"
            value={form.health_status}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>식단 요구사항:</label>
          <textarea
            name="dietary_requirements"
            value={form.dietary_requirements}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>알레르기 정보:</label>
          <textarea
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>특이 사항:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default PetDetails;
