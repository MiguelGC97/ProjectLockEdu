const fs = require('fs');
const path = require('path');

// Function to delete an image file
const deleteImg = (filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../public/uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return reject(new Error('File not found'));
        }

        // Try deleting the file
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(new Error('Error deleting the file'));
            }
            resolve('File deleted successfully');
        });
    });
};

module.exports = deleteImg;
