import React, { useState } from "react";
import { Star, Share2, Trash2, MoreVertical } from "lucide-react";
import domtoimage from "dom-to-image";

export default function MessageCard({
  message,
  timestamp,
  isStarred: initialStarred,
  messageId,
}) {
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [showActions, setShowActions] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const api = import.meta.env.VITE_API_ENDPOINT;

  const handleStar = async () => {
    try {
      setIsStarred(!isStarred);
      const response = await fetch(api + `/messages/` + messageId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ isStarred: !isStarred }),
      });
      const data = await response.json();
      if (data.success) {
        setIsStarred(!isStarred);
      }
    } catch (error) {
      setIsStarred(isStarred); // Revert state if error
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(api + `/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setIsDeleted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    const tempElement = document.createElement("div");
    tempElement.id = "tempMessageBox";
    tempElement.style.position = "fixed";
    tempElement.style.top = "0";
    tempElement.style.left = "0";
    tempElement.style.width = "1080px";
    tempElement.style.height = "1920px";
    tempElement.style.backgroundColor = "#f3f3f3";
    tempElement.style.display = "flex";
    tempElement.style.flexDirection = "column";
    tempElement.style.justifyContent = "center";
    tempElement.style.alignItems = "center";
    tempElement.style.padding = "40px";
    tempElement.style.boxSizing = "border-box";
    tempElement.style.zIndex = "1000";

    const innerBox = document.createElement("div");
    innerBox.style.width = "800px";
    innerBox.style.borderRadius = "20px";
    innerBox.style.overflow = "hidden";
    innerBox.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
    innerBox.style.textAlign = "center";

    const header = document.createElement("div");
    header.style.background = "linear-gradient(90deg, #ff7e5f, #feb47b)";
    header.style.padding = "40px";
    header.style.color = "white";
    header.style.fontSize = "36px";
    header.style.fontWeight = "bold";
    header.textContent = "Tell me what you REALLY think about me!";
  
    const messageContent = document.createElement("div");
    messageContent.style.backgroundColor = "white";
    messageContent.style.padding = "60px";
    messageContent.style.fontSize = "32px";
    messageContent.style.fontWeight = "500";
    messageContent.style.color = "#333";
    messageContent.textContent = message;
  
    const footer = document.createElement("div");
    footer.style.marginTop = "20px";
    footer.style.fontWeight = "bold";
    footer.style.position= 'absolute';
    footer.style.bottom = '20px';
    footer.style.fontSize = "50px";
    footer.style.color = "#555";
    footer.innerHTML =
      'received using WTF <span style="color: #ff7e5f;">🔥</span><br>https://wtf.techpi.me';
  
    innerBox.appendChild(header);
    innerBox.appendChild(messageContent);
    tempElement.appendChild(innerBox);
    tempElement.appendChild(footer);
  
    document.body.appendChild(tempElement);
  
    try {
      const dataUrl = await domtoimage.toPng(tempElement, {
        quality: 1,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `message_story_${messageId}.png`;
      link.click();
    } catch (error) {
      console.error("An error occurred while taking the screenshot:", error);
    } finally {
      document.body.removeChild(tempElement);
    }
  };
  
  
  

  return (
    <div
      className={
        "glass-morphism rounded-2xl p-5 space-y-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] neon-border" +
        (isDeleted ? " hidden" : "")
      }
    >
      <div id="messageBox" className="flex items-start justify-between gap-4">
        <p  className="text-white text-lg leading-relaxed flex-1">{message}</p>
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">{timestamp}</span>
        <div className="flex items-center gap-3">
          {showActions && (
            <>
              <button
                onClick={handleDownload} // Trigger download on click
                className="p-2 text-white/60 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-white/60 hover:text-neon-red transition-colors rounded-lg hover:bg-white/10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={handleStar}
            className={`p-2 transition-all duration-300 rounded-lg hover:bg-white/10 ${
              isStarred
                ? "text-neon-green"
                : "text-white/60 hover:text-neon-green"
            }`}
          >
            <Star
              className="w-5 h-5"
              fill={isStarred ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}