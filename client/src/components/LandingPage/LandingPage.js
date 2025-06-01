import { useState } from "react";
import "./LandingPage.css";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ChatPage from "../ChatPage/ChatPage";
import CircularProgress from "@mui/material/CircularProgress";

function LandingPage() {
  // Function to handle file upload

  const [uploadStatus, setUploadStatus] = useState("idle"); // status = "idle" | "uploading" | "success" | "error"

  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    const selectedFile = files[0];
    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "http://127.0.0.1:5000/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("Upload successful:", xhr.responseText);
        setUploadStatus("success");
      } else {
        console.error("Upload failed:", xhr.statusText);
        setUploadStatus("error");
      }
    };

    xhr.onerror = () => {
      console.error("Network error");
      setUploadStatus("error");
    };

    xhr.send(formData);
  };

  return (
    <div>
      <div id="landing-page-container">
        <div id="upload-button-container">
          {uploadStatus === ("idle" || "error") && (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
                width: "330px",
                height: "150px",
                fontSize: "18px",
                fontWeight: "500",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                border: "2px dashed #ccc",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              Upload files
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt"
                style={{ display: "none" }}
              />
            </Button>
          )}

          {uploadStatus === "uploading" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <CircularProgress
                variant={progress < 100 ? "determinate" : "indeterminate"}
                value={progress}
                size={80}
                thickness={5}
              />
              {progress < 100 ? <p>{progress}%</p> : <p>Processing file...</p>}
            </div>
          )}

          {uploadStatus === "success" && (
            <ChatPage onBack={() => setUploadStatus("idle")} />
          )}

          {uploadStatus === "error" && (
            <p id="upload-status" style={{ color: "red" }}>
              Error uploading file.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
