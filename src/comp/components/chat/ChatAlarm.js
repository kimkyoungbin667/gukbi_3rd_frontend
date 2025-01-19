import React, { useState } from 'react';
import '../../css/chat/chatalarm.css';

const ChatAlarm = ({ message, time, onClose }) => {

    return (
        <div className="notification-box">
            <div className="notification-header">
                <img src={require('../../../assets/img/bbab.png')} alt="알림 아이콘" className="notification-icon" />  {/* 알림 아이콘 추가 */}
                <h3>알림</h3>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
            <div className="notification-body">
                <p>{message}</p>  {/* 메시지 */}
                <p className="message-time">{time}</p>  {/* 시간 */}
            </div>
        </div>
    );
};

export default ChatAlarm;
