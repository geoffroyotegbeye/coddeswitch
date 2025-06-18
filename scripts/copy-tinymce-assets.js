const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../node_modules/tinymce');
const targetDir = path.join(__dirname, '../public/tinymce');

// Copier les skins
fs.copySync(
  path.join(sourceDir, 'skins'),
  path.join(targetDir, 'skins')
);

// Copier les thèmes
fs.copySync(
  path.join(sourceDir, 'themes'),
  path.join(targetDir, 'themes')
);

// Copier les icônes
fs.copySync(
  path.join(sourceDir, 'icons'),
  path.join(targetDir, 'icons')
);

console.log('TinyMCE assets copied successfully!'); 