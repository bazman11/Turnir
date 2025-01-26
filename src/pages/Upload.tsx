import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";

const Upload: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handlePasscodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasscode(event.target.value);
  };

  const handleFileUpload = async () => {
    if (passcode !== "Hillsturnir1!") {
      alert("Unijeli ste pogrešnu šifru! Molimo pokušajte ponovo.");
      return;
    }

    if (!selectedFile) {
      alert("Molimo vas da izaberete fajl prije slanja!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Fetch extracted data
        // Update sheets state with extracted data
        alert("Fajl je uspješno uploadovan i procesiran!");
      } else {
        alert("Greška prilikom obrade fajla.");
      }
    } catch (err) {
      console.error("Greška pri uploadu fajla:", err);
    }

    setShowModal(false); // Close the modal after successful upload
    setPasscode(""); // Clear passcode input
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Upload Tabele</h2>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Izaberite Excel fajl za upload:</Form.Label>
          <Form.Control
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileSelect}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          disabled={!selectedFile}
          onClick={() => setShowModal(true)}
        >
          Pošalji
        </Button>
      </Form>

      {/* Passcode Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unesite šifru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPasscode">
            <Form.Label>Šifra:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Unesite šifru"
              value={passcode}
              onChange={handlePasscodeChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Odustani
          </Button>
          <Button
            variant="primary"
            onClick={handleFileUpload}
            disabled={!passcode}
          >
            Potvrdi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Upload;
