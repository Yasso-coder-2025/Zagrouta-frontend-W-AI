import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'client', 'src', 'pages', 'Home.jsx');

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove solid backgrounds from sections (make them transparent or glass)
    content = content.replace(/className="bg-white/g, 'className="bg-white/10 backdrop-blur-md border-y border-white/20');
    // Replace hardcoded dark text with white/light text for readability on dark gradient
    content = content.replace(/text-gray-900/g, 'text-white');
    content = content.replace(/text-gray-800/g, 'text-white');
    content = content.replace(/text-gray-600/g, 'text-gray-200');
    content = content.replace(/text-gray-500/g, 'text-gray-200');
    
    // Cards: replace bg-gray-50 with glassmorphism 
    content = content.replace(/bg-gray-50/g, 'bg-white/10 backdrop-blur-md');
    // Card borders
    content = content.replace(/border-gray-100/g, 'border-white/20');
    
    // Navbar if we wanted to change it (we are doing Home for now)
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed Home.jsx for gradient background');
}
