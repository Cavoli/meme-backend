const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const imageDirectories = ['cat', 'food', 'funny', 'anime', 'art', 'wholesome', 'aww', 'travel', 'comics', 'inspiring'];

app.use('/images', express.static(path.join(__dirname)));

app.get('/random-image', (req, res) => {
    const folder = req.query.folder;
    let allFiles = [];

    if (folder) {
        const folderPath = path.join(__dirname, folder);
        if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
            allFiles = fs.readdirSync(folderPath).map(file => `${folder}/${file}`);
        } else {
            return res.status(400).send('Invalid folder name');
        }
    } else {
        imageDirectories.forEach(dir => {
            const files = fs.readdirSync(path.join(__dirname, dir)).map(file => `${dir}/${file}`);
            allFiles = allFiles.concat(files);
        });
    }

    if (allFiles.length === 0) {
        return res.status(404).send('No images found');
    }

    const randomImage = allFiles[Math.floor(Math.random() * allFiles.length)];
    const imagePath = path.join(__dirname, randomImage);
    res.sendFile(imagePath);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
