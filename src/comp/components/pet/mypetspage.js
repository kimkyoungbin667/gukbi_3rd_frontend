import React, { useEffect, useState } from "react";
import { getMyPets, deletePet, uploadPetImage } from "../../api/pet";
import "../../css/pet/MyPetsPage.css";
import PetDetails from "./pet_details";
import MedicalHistory from "./medical_histoy";
import PetDailyRecord from "./petdaily_recored";
import PetGraph from "./PetGraph";

function MyPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPetId, setEditingPetId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedPetId, setExpandedPetId] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  // 펫 목록을 서버에서 가져오는 함수
  const fetchPets = async () => {
    setLoading(true);
    try {
      const petData = await getMyPets();
      setPets(petData);
    } catch (error) {
      console.error("펫 정보 로드 실패:", error.message);
      setMessage("펫 정보를 로드하는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (petId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await deletePet(petId);
      await fetchPets();
      setMessage("펫이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("펫 삭제 실패:", error.message);
      setMessage("펫 삭제에 실패했습니다.");
    }
  };

  const validateImage = (file) => {
    const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file.type.startsWith("image/") || !validExtensions.includes(fileExtension)) {
      setIsValidImage(false);
      alert("유효하지 않은 이미지 형식입니다.");
      return false;
    }

    setIsValidImage(true);
    return true;
  };

  const handleImageUpload = async () => {
    if (!selectedImage?.file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage.file);

    try {
      const response = await uploadPetImage(editingPetId, formData);

      if (response.url) {
        setMessage("이미지가 성공적으로 업로드되었습니다.");
        window.location.reload(); // 새로고침 유지
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error.message);
      setMessage("이미지 업로드에 실패했습니다.");
    } finally {
      setEditingPetId(null);
      setSelectedImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      const previewUrl = URL.createObjectURL(file);

      setSelectedImage({ file, previewUrl });

      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.pet_id === editingPetId
            ? { ...pet, profile_url: previewUrl }
            : pet
        )
      );
    }
  };

  const toggleDetails = (petId) => {
    setExpandedPetId((prevId) => (prevId === petId ? null : petId));
    setActiveTab((prev) => ({ ...prev, [petId]: "details" }));
  };

  const changeTab = (petId, tab) => {
    setActiveTab((prev) => ({ ...prev, [petId]: tab }));
  };

  const cancelEdit = () => {
    setSelectedImage(null); // 선택된 이미지 초기화
    setEditingPetId(null); // 수정 상태 초기화
    window.location.reload(); // 새로고침 유지
  };


  if (loading) return <p className="loading">로딩 중...</p>;

  return (
    <div className="pets-container">
      <h1 className="title">내 반려동물 목록</h1>
      <div className="pets-list">
        {pets.map((pet) => (
          <div key={pet.pet_id} className="pet-card">
            <div className="pet-info">
              <img
                key={editingPetId === pet.pet_id ? selectedImage?.previewUrl || pet.profile_url : pet.profile_url}
                src={
                  editingPetId === pet.pet_id && selectedImage?.previewUrl
                    ? selectedImage.previewUrl
                    : `http://localhost:8080${pet.profile_url}`
                }
                alt={pet.dog_name}
                className="pet-image"
              />
              <div className="pet-details">
                <p>이름: {pet.dog_name}</p>
                <p>품종: {pet.kind_name}</p>
                <p>성별: {pet.sex}</p>
                <p>중성화 여부: {pet.neuter_status}</p>
                {editingPetId === pet.pet_id ? (
                  <div>
                    <label htmlFor={`file-input-${pet.pet_id}`} className="custom-file-label">
                      파일 선택
                    </label>
                    <input
                      id={`file-input-${pet.pet_id}`}
                      type="file"
                      className="custom-file-input"
                      onChange={handleImageChange}
                    />
                    {!isValidImage && <p style={{ color: "red" }}>유효하지 않은 이미지입니다.</p>}
                    <button className="button upload" onClick={handleImageUpload}>
                      업로드
                    </button>
                    <button className="button cancel" onClick={cancelEdit}>
                      취소
                    </button>
                  </div>
                ) : (
                  <button className="button edit" onClick={() => setEditingPetId(pet.pet_id)}>
                    수정
                  </button>
                )}

                <button className="button delete" onClick={() => handleDelete(pet.pet_id)}>
                  삭제
                </button>
                <button className="button toggle" onClick={() => toggleDetails(pet.pet_id)}>
                  {expandedPetId === pet.pet_id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {expandedPetId === pet.pet_id && (
              <div className="pet-extra-details">
                <div className="tabs">
                  <button
                    className={`tab ${activeTab[pet.pet_id] === "details" ? "active" : ""}`}
                    onClick={() => changeTab(pet.pet_id, "details")}
                  >
                    상세 정보
                  </button>
                  <button
                    className={`tab ${activeTab[pet.pet_id] === "weeklyGraph" ? "active" : ""}`}
                    onClick={() => changeTab(pet.pet_id, "weeklyGraph")}
                  >
                    주간 그래프
                  </button>
                  <button
                    className={`tab ${activeTab[pet.pet_id] === "dailyRecord" ? "active" : ""}`}
                    onClick={() => changeTab(pet.pet_id, "dailyRecord")}
                  >
                    오늘의 기록
                  </button>
                  <button
                    className={`tab ${activeTab[pet.pet_id] === "medicalHistory" ? "active" : ""}`}
                    onClick={() => changeTab(pet.pet_id, "medicalHistory")}
                  >
                    의료 기록
                  </button>
                </div>
                {activeTab[pet.pet_id] === "details" && <PetDetails petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "weeklyGraph" && <PetGraph petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "dailyRecord" && <PetDailyRecord petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "medicalHistory" && <MedicalHistory petId={pet.pet_id} />}
              </div>
            )}
          </div>
        ))}
      </div>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default MyPetsPage;
