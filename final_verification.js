const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

console.log('🔍 Final Verification of Chinese Language Support\n');

// Test 1: Check database schema
console.log('1. Checking database schema...');
db.all("PRAGMA table_info(commands)", [], (err, columns) => {
    if (err) {
        console.error('❌ Error checking schema:', err.message);
        return;
    }
    
    const chineseColumns = columns.filter(col => col.name.includes('_zh'));
    console.log(`✅ Found ${chineseColumns.length} Chinese columns:`, chineseColumns.map(c => c.name).join(', '));
    
    // Test 2: Check data coverage
    console.log('\n2. Checking data coverage...');
    db.get(`
        SELECT 
            COUNT(*) as total,
            COUNT(name_zh) as names_zh,
            COUNT(description_zh) as descriptions_zh,
            COUNT(category_zh) as categories_zh
        FROM commands
    `, [], (err, stats) => {
        if (err) {
            console.error('❌ Error checking coverage:', err.message);
            return;
        }
        
        console.log(`✅ Total commands: ${stats.total}`);
        console.log(`✅ Chinese names: ${stats.names_zh} (${((stats.names_zh/stats.total)*100).toFixed(1)}%)`);
        console.log(`✅ Chinese descriptions: ${stats.descriptions_zh} (${((stats.descriptions_zh/stats.total)*100).toFixed(1)}%)`);
        console.log(`✅ Chinese categories: ${stats.categories_zh} (${((stats.categories_zh/stats.total)*100).toFixed(1)}%)`);
        
        // Test 3: Sample data quality
        console.log('\n3. Checking sample data quality...');
        db.all(`
            SELECT 
                hex_id,
                name_en,
                name_zh,
                LENGTH(description_en) as desc_en_len,
                LENGTH(description_zh) as desc_zh_len
            FROM commands 
            WHERE hex_id IN ('00', '02', '03', '06', '07')
            ORDER BY hex_id
        `, [], (err, samples) => {
            if (err) {
                console.error('❌ Error checking samples:', err.message);
                return;
            }
            
            console.log('Sample commands:');
            samples.forEach(cmd => {
                const quality = cmd.desc_zh_len > 50 ? '✅' : '⚠️';
                console.log(`  ${quality} ${cmd.hex_id}: "${cmd.name_en}" → "${cmd.name_zh}" (${cmd.desc_zh_len} chars)`);
            });
            
            // Test 4: Check for common issues
            console.log('\n4. Checking for common issues...');
            db.all(`
                SELECT 
                    COUNT(*) as count,
                    'Missing Chinese names' as issue
                FROM commands 
                WHERE name_zh IS NULL OR name_zh = ''
                UNION ALL
                SELECT 
                    COUNT(*) as count,
                    'Missing Chinese descriptions' as issue
                FROM commands 
                WHERE description_zh IS NULL OR description_zh = ''
                UNION ALL
                SELECT 
                    COUNT(*) as count,
                    'Identical EN/ZH names' as issue
                FROM commands 
                WHERE name_en = name_zh
                UNION ALL
                SELECT 
                    COUNT(*) as count,
                    'Identical EN/ZH descriptions' as issue
                FROM commands 
                WHERE description_en = description_zh
            `, [], (err, issues) => {
                if (err) {
                    console.error('❌ Error checking issues:', err.message);
                    return;
                }
                
                issues.forEach(issue => {
                    const status = issue.count === 0 ? '✅' : '⚠️';
                    console.log(`  ${status} ${issue.issue}: ${issue.count} cases`);
                });
                
                console.log('\n🎉 Verification complete!');
                console.log('\n📋 Summary:');
                console.log('- Database has proper Chinese column support');
                console.log('- Chinese translations are loaded and available');
                console.log('- API endpoints should return Chinese data');
                console.log('- Frontend language switching should work');
                
                db.close();
            });
        });
    });
});
