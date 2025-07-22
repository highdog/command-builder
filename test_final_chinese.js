const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

console.log('🔍 Final Chinese Translation Test\n');

// Test a few specific commands to verify Chinese content
const testCommands = ['0x00', '0x07', '0x06'];

console.log('Testing Chinese translations for key commands:');
console.log('=' .repeat(80));

let completedTests = 0;

testCommands.forEach(hexId => {
    db.get(`
        SELECT 
            hex_id,
            name_en,
            name_zh,
            description_en,
            description_zh,
            LENGTH(description_zh) as zh_length
        FROM commands 
        WHERE hex_id = ?
    `, [hexId], (err, row) => {
        completedTests++;
        
        if (err) {
            console.error(`❌ Error testing ${hexId}:`, err.message);
            return;
        }
        
        if (!row) {
            console.log(`❌ ${hexId}: Command not found`);
            return;
        }
        
        console.log(`\n🔍 Testing ${hexId}:`);
        console.log(`English Name: ${row.name_en}`);
        console.log(`Chinese Name: ${row.name_zh}`);
        console.log(`Chinese Desc Length: ${row.zh_length} characters`);
        
        // Check if Chinese content is actually different from English
        const namesDifferent = row.name_zh !== row.name_en;
        const descsDifferent = row.description_zh !== row.description_en;
        const hasReasonableLength = row.zh_length > 50;
        
        console.log(`Names Different: ${namesDifferent ? '✅' : '❌'}`);
        console.log(`Descriptions Different: ${descsDifferent ? '✅' : '❌'}`);
        console.log(`Reasonable Length: ${hasReasonableLength ? '✅' : '❌'}`);
        
        // Show first 100 characters of each description
        console.log(`\nEnglish Preview: ${row.description_en.substring(0, 100)}...`);
        console.log(`Chinese Preview: ${row.description_zh.substring(0, 100)}...`);
        
        const isValid = namesDifferent && descsDifferent && hasReasonableLength;
        console.log(`Overall Status: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
        console.log('-'.repeat(80));
        
        // When all tests are complete, show summary
        if (completedTests === testCommands.length) {
            console.log('\n📊 Summary Test - Random Sample:');
            
            db.all(`
                SELECT 
                    hex_id,
                    name_zh,
                    LENGTH(description_zh) as zh_len,
                    CASE 
                        WHEN name_zh != name_en AND description_zh != description_en AND LENGTH(description_zh) > 50 
                        THEN 'VALID' 
                        ELSE 'INVALID' 
                    END as status
                FROM commands 
                WHERE hex_id IS NOT NULL 
                ORDER BY RANDOM() 
                LIMIT 5
            `, [], (err, samples) => {
                if (err) {
                    console.error('Error getting samples:', err.message);
                } else {
                    samples.forEach(sample => {
                        console.log(`${sample.status === 'VALID' ? '✅' : '❌'} ${sample.hex_id}: ${sample.name_zh} (${sample.zh_len} chars)`);
                    });
                }
                
                // Final statistics
                db.get(`
                    SELECT 
                        COUNT(*) as total,
                        COUNT(CASE WHEN name_zh IS NOT NULL AND name_zh != '' THEN 1 END) as has_zh_name,
                        COUNT(CASE WHEN description_zh IS NOT NULL AND description_zh != '' THEN 1 END) as has_zh_desc,
                        COUNT(CASE WHEN name_zh != name_en THEN 1 END) as different_names,
                        COUNT(CASE WHEN description_zh != description_en THEN 1 END) as different_descs,
                        AVG(LENGTH(description_zh)) as avg_zh_length
                    FROM commands 
                    WHERE hex_id IS NOT NULL
                `, [], (err, stats) => {
                    if (err) {
                        console.error('Error getting final stats:', err.message);
                    } else {
                        console.log('\n📈 Final Statistics:');
                        console.log(`Total commands: ${stats.total}`);
                        console.log(`Has Chinese names: ${stats.has_zh_name} (${((stats.has_zh_name/stats.total)*100).toFixed(1)}%)`);
                        console.log(`Has Chinese descriptions: ${stats.has_zh_desc} (${((stats.has_zh_desc/stats.total)*100).toFixed(1)}%)`);
                        console.log(`Different names: ${stats.different_names} (${((stats.different_names/stats.total)*100).toFixed(1)}%)`);
                        console.log(`Different descriptions: ${stats.different_descs} (${((stats.different_descs/stats.total)*100).toFixed(1)}%)`);
                        console.log(`Average Chinese description length: ${Math.round(stats.avg_zh_length)} characters`);
                        
                        if (stats.different_descs > stats.total * 0.8) {
                            console.log('\n🎉 SUCCESS: Chinese translations appear to be working correctly!');
                            console.log('✅ Most commands have different Chinese and English content');
                            console.log('✅ Chinese descriptions have reasonable length');
                            console.log('✅ Language switching should work properly');
                        } else {
                            console.log('\n⚠️ WARNING: Chinese translations may need attention');
                            console.log('❌ Many commands still have identical Chinese and English content');
                        }
                    }
                    
                    db.close();
                });
            });
        }
    });
});
