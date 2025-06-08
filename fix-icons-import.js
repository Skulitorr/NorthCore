// This patch script fixes the Icons import in index.tsx
// Run this script with: node fix-icons-import.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pages', 'index.tsx');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Replace the import statement
  const result = data.replace(
    "import { Icons } from '../components/common/Icons';",
    "import Icons from '../components/common/Icons';"
  );

  // Write the file back
  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated Icons import in index.tsx');
  });
});
