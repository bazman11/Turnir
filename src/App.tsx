import React from "react";

const App: React.FC = () => {
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
        alert("File uploaded and source file updated successfully!");
      } else {
        alert("Failed to update source file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div>
      <div>Games</div>
      <div>Lakers 156 : 158 Boston</div>
      <div>Charlotte 140 : 120 Memphis</div>
      <div>Barcelona 3 : 2 Real Madrid</div>
      
<div>Lakers 156 : 158 Boston</div>
<div>Charlotte 140 : 120 Memphis</div>
<div>Barcelona 3 : 2 Real Madrid</div>
<div>proba</div>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
    </div>
  );
};

export default App;
