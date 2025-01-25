import React from "react";

const Upload: React.FC = () => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        //const data = await response.json(); // Fetch extracted data
        // Update sheets state with extracted data
        alert("File uploaded and data processed successfully!");
      } else {
        alert("Failed to process file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };
  return <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />;
};

export default Upload;
