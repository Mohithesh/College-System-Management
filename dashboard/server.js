const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage
}).single('timetable');

// Static folder
app.use(express.static(path.join(__dirname)));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send('Error uploading file.');
    } else {
      if (req.file == undefined) {
        res.send('No file selected.');
      } else {
        res.send(`File uploaded: <a href="${req.file.path}">${req.file.filename}</a>`);
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
