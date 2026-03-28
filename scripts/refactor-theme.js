const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('/Users/sakshamvij/Downloads/HackSky/ai-co-founder/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (file.includes('src/app/page.tsx')) return; // Skip the main page we already styled perfectly
    if (file.includes('layout.tsx')) return; // Will handle layout manually

    content = content.replace(/text-white/g, 'text-gray-900');
    content = content.replace(/text-gray-300/g, 'text-gray-700');
    content = content.replace(/text-gray-400/g, 'text-gray-600');
    content = content.replace(/bg-dark-100/g, 'bg-white/80');
    content = content.replace(/bg-dark-200/g, 'bg-white/60');
    content = content.replace(/bg-dark-300/g, 'bg-transparent');
    content = content.replace(/border-white\/10/g, 'border-gray-200');

    fs.writeFileSync(file, content);
});
console.log('Successfully replaced classes systematically.');
