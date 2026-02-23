import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'client', 'src', 'pages', 'Home.jsx');

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove glass
    content = content.replace(/className="bg-white\/10 backdrop-blur-md border-y border-white\/20/g, 'className="bg-white');
    
    // Cards
    content = content.replace(/bg-white\/10 backdrop-blur-md/g, 'bg-gray-50');
    // Card borders
    content = content.replace(/border-white\/20/g, 'border-gray-100');

    // Replace text colors manually because they are tricky, but let's try
    // We only changed specific classes
    fs.writeFileSync(file, content, 'utf8');
}
