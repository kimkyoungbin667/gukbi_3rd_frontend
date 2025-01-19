import React from "react";
import "../../css/general/AlertBox.css"; // 스타일 추가

export default function AlertBox({ message, onClose }) {
    return (
        <div className="alert-overlay">
            <div className="alert-box">
                <p>{message}</p>
                <button className="alert-button" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
}
