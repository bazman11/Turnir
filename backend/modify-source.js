import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import express from "express";
import multer from "multer";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 5050;

const upload = multer({ dest: "uploads/" });

const sourceFilePath = path.join(__dirname, "../src/App.tsx");

const processExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const jsxContent = data
    .map(
      (row) =>
        `<div>${row.Player1} ${row.Score1} : ${row.Score2} ${row.Player2}</div>`
    )
    .join("\n");
  return jsxContent;
};

const updateReactSourceFile = (jsxContent) => {
  const originalContent = fs.readFileSync(sourceFilePath, "utf-8");

  const updatedContent = originalContent.replace(
    /<div>proba<\/div>/,
    `\n${jsxContent}\n<div>proba</div>`
  );

  fs.writeFileSync(sourceFilePath, updatedContent, "utf-8");
  console.log("React source file updated successfully!");
};

app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  try {
    const jsxContent = processExcelFile(filePath);
    updateReactSourceFile(jsxContent);
    res.send({ message: "React source file updated successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Failed to update React source file." });
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
