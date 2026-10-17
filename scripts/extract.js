// Extract the JSON array from a saved MCP tool-result file into data/products.json
const fs = require('fs');
const path = require('path');
const [,, inFile] = process.argv;
const raw = fs.readFileSync(inFile, 'utf8');

let arr = null;
// Case 1: whole file is the outer JSON object {"result":"..."}
try {
  const outer = JSON.parse(raw);
  const text = typeof outer === 'string' ? outer : outer.result;
  const s = text.indexOf('['), e = text.lastIndexOf(']');
  arr = JSON.parse(text.slice(s, e + 1));
} catch (_) {}
// Case 2: file contains an escaped JSON array (\" style) — unescape via JSON string parse
if (!arr) {
  const s = raw.indexOf('[{\\"');
  const e = raw.lastIndexOf('}]');
  if (s >= 0 && e > s) {
    const unescaped = JSON.parse('"' + raw.slice(s, e + 2).replace(/"/g, '\\"') + '"');
    arr = JSON.parse(unescaped);
  }
}
// Case 3: plain JSON array somewhere in the file
if (!arr) {
  const s = raw.indexOf('['), e = raw.lastIndexOf(']');
  arr = JSON.parse(raw.slice(s, e + 1));
}

fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(arr, null, 1));
const cats = {};
for (const p of arr) { const c = typeof p.category === 'object' ? p.category.en : p.category; cats[c] = (cats[c] || 0) + 1; }
console.log('products:', arr.length);
console.log('categories:', JSON.stringify(cats));
console.log('no-image:', arr.filter(p => !p.images || !p.images.length).map(p => p.slug).join(', ') || 'none');
