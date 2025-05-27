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

    setUploadStatus("uploading");
    setFile(files[0]);

    if (file) {
      console.log("Files selected:", file);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    setFile(event.target.files[0].name);
    setUploadStatus("idle");
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
              single
              accept=".pdf,.docx,.txt"
              style={{ display: "none" }}
            />
            {file?.name}
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
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
