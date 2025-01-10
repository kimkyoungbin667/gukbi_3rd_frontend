import React, { useEffect, useState } from "react";
import { getMyPets, deletePet, uploadPetImage } from "../../api/pet";
import "../../css/pet/MyPetsPage.css";

function MyPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPetId, setEditingPetId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedPetId, setExpandedPetId] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  const fetchPets = async () => {
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

  const handleEdit = (petId) => {
    setEditingPetId(petId);
    setSelectedImage(null);
    setIsValidImage(true);
    setMessage("");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateImage(file)) {
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await uploadPetImage(editingPetId, formData);

      setMessage("이미지가 성공적으로 업로드되었습니다.");
      setEditingPetId(null);
      setSelectedImage(null);

      await fetchPets();
    } catch (error) {
      console.error("이미지 업로드 실패:", error.message);
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  const toggleDetails = (petId) => {
    setExpandedPetId(expandedPetId === petId ? null : petId);
    if (expandedPetId !== petId) {
      setActiveTab((prev) => ({ ...prev, [petId]: "weight" }));
    }
  };

  const changeTab = (petId, tab) => {
    setActiveTab((prev) => ({ ...prev, [petId]: tab }));
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>내 반려동물 목록</h1>
      <div>
        {pets.map((pet) => (
          <div
          key={pet.pet_id}
          style={{
            display: "flex",
            flexDirection: "column", // 세로 정렬
            alignItems: "center", // 가운데 정렬
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {/* 사진과 텍스트 영역 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
            {/* 사진 */}
            <img
              src={pet.profile_url || "http://localhost:8080/default_image_url.jpg"}
              alt={pet.dog_name}
              width="300"
              height="300"
              style={{ objectFit: "cover", borderRadius: "8px", marginRight: "20px" }}
            />
        
            {/* 텍스트 및 버튼 */}
            <div style={{ textAlign: "left", flex: 1 }}>
              <p>이름: {pet.dog_name}</p>
              <p>품종: {pet.kind_name}</p>
              <p>성별: {pet.sex}</p>
              <p>중성화 여부: {pet.neuter_status}</p>
              {editingPetId === pet.pet_id ? (
                <div>
                  <input type="file" onChange={handleImageChange} />
                  {!isValidImage && <p style={{ color: "red" }}>유효하지 않은 이미지입니다.</p>}
                  <button onClick={handleImageUpload}>업로드</button>
                  <button onClick={() => setEditingPetId(null)}>취소</button>
                </div>
              ) : (
                <button onClick={() => handleEdit(pet.pet_id)}>수정</button>
              )}
              <button onClick={() => handleDelete(pet.pet_id)}>삭제</button>
              <button onClick={() => toggleDetails(pet.pet_id)} style={{ marginTop: "10px" }}>
                {expandedPetId === pet.pet_id ? "접기 ▲" : "펼치기 ▼"}
              </button>
            </div>
          </div>
        
          {/* 펼쳐지는 추가 정보 영역 */}
          {expandedPetId === pet.pet_id && (
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                width: "100%",
                borderTop: "1px solid #ccc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
                <button
                  onClick={() => changeTab(pet.pet_id, "weight")}
                  style={{ fontWeight: activeTab[pet.pet_id] === "weight" ? "bold" : "normal" }}
                >
                  오늘의 애완동물 정보 입력하기
                </button>
                <button
                  onClick={() => changeTab(pet.pet_id, "meal")}
                  style={{ fontWeight: activeTab[pet.pet_id] === "meal" ? "bold" : "normal" }}
                >
                  애완동물 변화추이 보기
                </button>
              </div>
              {activeTab[pet.pet_id] === "weight" && <p>애완동물 정보 작성: {pet.weight || "알 수 없음"}</p>}
              {activeTab[pet.pet_id] === "meal" && <p>그래프로 보기: {pet.meal_amount || "알 수 없음"}</p>}
            </div>
          )}
        </div>
        


        ))}
      </div>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default MyPetsPage;