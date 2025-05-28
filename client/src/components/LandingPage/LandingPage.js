import { use, useState } from "react";
import "./LandingPage.css";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function LandingPage() {
  // Function to handle file upload

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // status = "idle" | "uploading" | "success" | "error"

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);
    setUploadStatus("uploading");

    if (file) {
      console.log("Files selected:", selectedFile.name);
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData, // so basically send the formData to the backend
      });

      const data = await response.json();
      console.log("Server response:", data);
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error");
    }
  };

  return (
    <div>
      <div id="landing-page-container">
        <div id="upload-button-container">
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
              width: "200px",
              height: "50px",
              fontSize: "16px",
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
          {file && (
            <div id="file-name-display">
              <p>Selected file: {file?.name}</p>
            </div>
          )}
          {uploadStatus === "uploading" && (
            <p id="upload-status">Uploading...</p>
          )}
          {uploadStatus === "success" && (
            <p id="upload-status" style={{ color: "green" }}>
              File uploaded successfully!
            </p>
          )}
          {uploadStatus === "error" && (
            <p id="upload-status" style={{ color: "red" }}>
              Error uploading file.
            </p>
          )}
          {setUploadStatus === "idle"}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
