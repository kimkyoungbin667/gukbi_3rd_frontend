import React, { useState } from 'react';
import '../../css/chat/chatalarm.css';

const ChatAlarm = ({ message, time, senderNickname, sendType, onClose }) => {


    return (
        <div className="notification-box">
            <div className="notification-header">
                <img src={require('../../../assets/img/bbab.png')} alt="알림 아이콘" className="notification-icon" />  {/* 알림 아이콘 추가 */}
                <h3>{senderNickname}</h3>

                <button className="close-btn" onClick={onClose}>X</button>
            </div>
            <div className="notification-body">

                <p className='alarm-message'>{message}</p>


                <p className="message-time">{time}</p>  {/* 시간 */}
            </div>
        </div>
    );
};

export default ChatAlarm;
