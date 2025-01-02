import React, { useEffect, useState } from "react";

function ReplyForm({ replies }) {
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {

    console.log(replies);
  }, []);
  return (
    <div className="reply-form">
      <h1>replies</h1>
    </div>
  );
}

export default ReplyForm;
