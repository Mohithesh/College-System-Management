const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configure storage for single upload
const singleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'uploaded.pdf'); // Overwrite previous file
    }
});

const singleUpload = multer({ storage: singleStorage });

// Configure storage for multiple uploads
const multipleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original filename
    }
});

const multipleUpload = multer({ storage: multipleStorage });

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Single upload route
app.post('/schedule', singleUpload.single('file'), (req, res) => {
    res.json({ url: `/uploads/uploaded.pdf` });
});

// Endpoint to fetch the single uploaded file
app.get('/single-file', (req, res) => {
    const fileUrl = fs.existsSync('uploads/uploaded.pdf') ? '/uploads/uploaded.pdf' : null;
    res.json({ url: fileUrl });
});

// Multiple upload route
app.post('/materials', multipleUpload.single('file'), (req, res) => {
    const { classSelect, sectionSelect, yearSelect } = req.body;
    const metadata = `class: ${classSelect}, section: ${sectionSelect}, year: ${yearSelect}`;
    const fileData = {
        filename: req.file.filename,
        metadata: metadata,
        url: `/uploads/${req.file.filename}`
    };

    // Save file data to a JSON file
    const fileDataPath = path.join(__dirname, 'uploads', 'files.json');
    let files = [];
    if (fs.existsSync(fileDataPath)) {
        files = JSON.parse(fs.readFileSync(fileDataPath, 'utf8'));
    }
    files.push(fileData);
    fs.writeFileSync(fileDataPath, JSON.stringify(files, null, 2), 'utf8');

    res.json(fileData);
});

// Endpoint to fetch list of uploaded files
app.get('/files', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const fileDataPath = path.join(__dirname, 'uploads', 'files.json');
    let files = [];
    if (fs.existsSync(fileDataPath)) {
        files = JSON.parse(fs.readFileSync(fileDataPath, 'utf8'));
    }
    if (query) {
        files = files.filter(file => file.metadata.toLowerCase().includes(query));
    }
    res.json(files);
});

// Endpoint to delete a file
app.delete('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const fileDataPath = path.join(__dirname, 'uploads', 'files.json');
    let files = [];
    if (fs.existsSync(fileDataPath)) {
        files = JSON.parse(fs.readFileSync(fileDataPath, 'utf8'));
    }
    files = files.filter(file => file.filename !== filename);
    fs.writeFileSync(fileDataPath, JSON.stringify(files, null, 2), 'utf8');

    res.json({ message: 'File deleted' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

