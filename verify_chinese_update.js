const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

console.log('🔍 Verifying Chinese Data Update\n');

// Test specific commands to ensure they have proper Chinese content
const testCommands = [
    '0x00', '0x02', '0x03', '0x06', '0x07', '0x09', 
    '0x14', '0x15', '0x16', '0x17', '0x19', '0x20'
];

console.log('Testing specific commands for Chinese content:');
console.log('=' .repeat(80));

let testCount = 0;
let passCount = 0;

testCommands.forEach(hexId => {
    db.get(`
        SELECT 
            hex_id,
            name_en,
            name_zh,
            SUBSTR(description_en, 1, 50) as desc_en_preview,
            SUBSTR(description_zh, 1, 50) as desc_zh_preview,
            LENGTH(description_zh) as desc_zh_length
        FROM commands 
        WHERE hex_id = ?
    `, [hexId], (err, row) => {
        testCount++;
        
        if (err) {
            console.error(`❌ Error testing ${hexId}:`, err.message);
            return;
        }
        
        if (!row) {
            console.log(`❌ ${hexId}: Command not found in database`);
            return;
        }
        
        const hasChineseName = row.name_zh && row.name_zh !== row.name_en;
        const hasChineseDesc = row.description_zh && row.description_zh !== row.description_en;
        const hasReasonableLength = row.desc_zh_length > 50;
        
        const isValid = hasChineseName && hasChineseDesc && hasReasonableLength;
        if (isValid) passCount++;
        
        const status = isValid ? '✅' : '❌';
        console.log(`${status} ${hexId}:`);
        console.log(`   EN Name: ${row.name_en}`);
        console.log(`   ZH Name: ${row.name_zh || 'MISSING'}`);
        console.log(`   EN Desc: ${row.desc_en_preview}...`);
        console.log(`   ZH Desc: ${row.desc_zh_preview || 'MISSING'}...`);
        console.log(`   ZH Length: ${row.desc_zh_length} chars`);
        console.log('-'.repeat(80));
        
        // Check if all tests are complete
        if (testCount === testCommands.length) {
            console.log(`\n📊 Test Results:`);
            console.log(`Passed: ${passCount}/${testCount} (${((passCount/testCount)*100).toFixed(1)}%)`);
            
            if (passCount === testCount) {
                console.log('🎉 All tests passed! Chinese translations are working correctly.');
            } else {
                console.log('⚠️ Some tests failed. Chinese translations may need attention.');
            }
            
            // Overall statistics
            db.get(`
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN name_zh IS NOT NULL AND name_zh != name_en THEN 1 END) as valid_names,
                    COUNT(CASE WHEN description_zh IS NOT NULL AND description_zh != description_en THEN 1 END) as valid_descriptions,
                    AVG(LENGTH(description_zh)) as avg_desc_length
                FROM commands 
                WHERE hex_id IS NOT NULL
            `, [], (err, stats) => {
                if (err) {
                    console.error('Error getting statistics:', err.message);
                } else {
                    console.log(`\n📈 Overall Statistics:`);
                    console.log(`Total commands with hex_id: ${stats.total}`);
                    console.log(`Valid Chinese names: ${stats.valid_names} (${((stats.valid_names/stats.total)*100).toFixed(1)}%)`);
                    console.log(`Valid Chinese descriptions: ${stats.valid_descriptions} (${((stats.valid_descriptions/stats.total)*100).toFixed(1)}%)`);
                    console.log(`Average description length: ${Math.round(stats.avg_desc_length)} characters`);
                }
                
                db.close();
            });
        }
    });
});
