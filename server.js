const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dashboard/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'dashboard' directory
app.use(express.static(path.join(__dirname, 'dashboard')));

// Routes to serve the HTML files
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/home.html'));
});

app.get('/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/schedule.html'));
});

app.get('/materials', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/materials.html'));
});

app.get('/assignments', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/assignments.html'));
});

app.get('/exams', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/exams.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/pages/faq.html'));
});

// Handle file upload
app.post('/upload', upload.single('timetable'), (req, res) => {
  if (req.file) {
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } else {
    res.status(400).send('Error: No file uploaded');
  }
});

// Serve list of uploaded files
app.get('/uploads', (req, res) => {
    const fs = require('fs');
    const directoryPath = path.join(__dirname, 'dashboard/uploads');
  
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to scan directory');
      }
      res.json(files);
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
