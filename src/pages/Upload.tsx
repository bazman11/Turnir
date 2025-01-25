import React from "react";
import { Button, Container, Form } from "react-bootstrap";

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
  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Upload Tabele</h2>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Izaberite excel file za upload:</Form.Label>
          <Form.Control
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileUpload}
          />
        </Form.Group>
        <Button variant="primary" type="button">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Upload;
