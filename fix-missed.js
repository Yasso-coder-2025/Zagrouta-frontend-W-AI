import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  path.join(__dirname, 'client', 'src', 'pages', 'Home.jsx'),
  path.join(__dirname, 'client', 'src', 'pages', 'Planner.jsx'),
  path.join(__dirname, 'client', 'src', 'pages', 'Services.jsx')
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace the rest of the pink-600/700 codebase uses to primary
    content = content.replace(/text-pink-600/g, 'text-primary');
    content = content.replace(/bg-pink-600/g, 'bg-primary');
    content = content.replace(/hover:bg-pink-700/g, 'hover:bg-primary-hover');
    content = content.replace(/border-pink-600/g, 'border-primary');
    content = content.replace(/text-pink-500/g, 'text-primary');
    content = content.replace(/ring-pink-500/g, 'ring-primary'); 
    content = content.replace(/bg-pink-700/g, 'bg-primary-hover');
    
    content = content.replace(/bg-pink-50/g, 'bg-primary-50');
    content = content.replace(/hover:bg-pink-50/g, 'hover:bg-primary-50');
    content = content.replace(/border-pink-50/g, 'border-primary-50');
    content = content.replace(/text-pink-50/g, 'text-primary-50');
    content = content.replace(/text-pink-100/g, 'text-primary-100');
    content = content.replace(/border-pink-100/g, 'border-primary-100');
    content = content.replace(/hover:border-pink-100/g, 'hover:border-primary-100');
    content = content.replace(/bg-pink-100/g, 'bg-primary-100');
    content = content.replace(/bg-pink-200/g, 'bg-primary-200');
    content = content.replace(/border-pink-200/g, 'border-primary-200');
    content = content.replace(/hover:border-pink-200/g, 'hover:border-primary-200');
    content = content.replace(/hover:bg-pink-100/g, 'hover:bg-primary-100');
    content = content.replace(/text-pink-800/g, 'text-primary-800');
    content = content.replace(/bg-pink-800/g, 'bg-primary-800');
    content = content.replace(/bg-pink-900/g, 'bg-primary-900');
    content = content.replace(/text-pink-200/g, 'text-primary-200');
    content = content.replace(/bg-pink-500/g, 'bg-primary');
    
    // Auto fix text-white
    const lines = content.split('\n');
    const newLines = lines.map(line => {
        if (line.includes('bg-primary') && line.includes('text-white')) {
            return line.replace(/text-white/g, 'text-primary-foreground');
        }
        return line;
    });
    
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
});
console.log('Fixed 3 files');
