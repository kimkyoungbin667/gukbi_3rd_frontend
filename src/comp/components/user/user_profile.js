import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/user";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((response) => {
        console.log("사용자 정보:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error.message);
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>환영합니다, {user.userName}님!</h1>
      <p>이메일: {user.userEmail}</p>
      <p>닉네임: {user.userNickname}</p>
      <p>생년월일: {user.userBirth}</p>
    </div>
  );
}
