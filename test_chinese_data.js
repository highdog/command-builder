const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

console.log('Testing Chinese data in database...\n');

// Test query to get a few commands with both English and Chinese data
const query = `
    SELECT 
        hex_id,
        name_en,
        name_zh,
        SUBSTR(description_en, 1, 100) as desc_en_preview,
        SUBSTR(description_zh, 1, 100) as desc_zh_preview
    FROM commands 
    WHERE hex_id IS NOT NULL 
    ORDER BY hex_id 
    LIMIT 10
`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err.message);
        db.close();
        return;
    }
    
    console.log('Sample commands with Chinese translations:');
    console.log('=' .repeat(80));
    
    rows.forEach((row, index) => {
        console.log(`${index + 1}. Command ${row.hex_id}`);
        console.log(`   English Name: ${row.name_en}`);
        console.log(`   Chinese Name: ${row.name_zh || 'NOT FOUND'}`);
        console.log(`   English Desc: ${row.desc_en_preview}...`);
        console.log(`   Chinese Desc: ${row.desc_zh_preview || 'NOT FOUND'}...`);
        console.log('-'.repeat(80));
    });
    
    // Count total commands with Chinese translations
    db.get('SELECT COUNT(*) as total, COUNT(description_zh) as with_zh FROM commands', [], (err, counts) => {
        if (err) {
            console.error('Error counting:', err.message);
        } else {
            console.log(`\nSummary:`);
            console.log(`Total commands: ${counts.total}`);
            console.log(`Commands with Chinese descriptions: ${counts.with_zh}`);
            console.log(`Coverage: ${((counts.with_zh / counts.total) * 100).toFixed(1)}%`);
        }
        
        db.close();
    });
});
