const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

console.log('🔍 Direct Database Debug for Command ID 13\n');

db.get('SELECT * FROM commands WHERE id = 13', [], (err, row) => {
    if (err) {
        console.error('❌ Database error:', err.message);
        db.close();
        return;
    }
    
    if (!row) {
        console.log('❌ No record found with ID 13');
        db.close();
        return;
    }
    
    console.log('📊 Raw Database Record:');
    console.log('=' .repeat(60));
    console.log(`ID: ${row.id}`);
    console.log(`Hex ID: ${row.hex_id}`);
    console.log(`Type: ${row.type}`);
    console.log(`Category EN: ${row.category_en}`);
    console.log(`Category ZH: ${row.category_zh}`);
    console.log(`Name EN: ${row.name_en}`);
    console.log(`Name ZH: ${row.name_zh}`);
    console.log(`Description EN Length: ${row.description_en ? row.description_en.length : 0}`);
    console.log(`Description ZH Length: ${row.description_zh ? row.description_zh.length : 0}`);
    
    console.log('\n📝 Content Comparison:');
    console.log('=' .repeat(60));
    
    console.log('\nEnglish Name:');
    console.log(`"${row.name_en}"`);
    
    console.log('\nChinese Name:');
    console.log(`"${row.name_zh}"`);
    
    console.log('\nNames Equal:', row.name_en === row.name_zh ? '❌ YES' : '✅ NO');
    
    console.log('\nEnglish Description (first 200 chars):');
    console.log(`"${row.description_en ? row.description_en.substring(0, 200) : 'N/A'}..."`);
    
    console.log('\nChinese Description (first 200 chars):');
    console.log(`"${row.description_zh ? row.description_zh.substring(0, 200) : 'N/A'}..."`);
    
    console.log('\nDescriptions Equal:', row.description_en === row.description_zh ? '❌ YES' : '✅ NO');
    
    // Test JSON serialization (what the API would return)
    console.log('\n🔄 JSON Serialization Test:');
    console.log('=' .repeat(60));
    
    const jsonString = JSON.stringify(row, null, 2);
    const parsed = JSON.parse(jsonString);
    
    console.log('Serialized and parsed successfully:', !!parsed);
    console.log('Parsed Chinese name:', `"${parsed.name_zh}"`);
    console.log('Parsed Chinese desc length:', parsed.description_zh ? parsed.description_zh.length : 0);
    console.log('Parsed Chinese desc preview:', parsed.description_zh ? parsed.description_zh.substring(0, 100) + '...' : 'N/A');
    
    // Final verdict
    console.log('\n🎯 Final Analysis:');
    console.log('=' .repeat(60));
    
    const hasValidZhName = row.name_zh && row.name_zh !== row.name_en;
    const hasValidZhDesc = row.description_zh && row.description_zh !== row.description_en;
    
    console.log(`Valid Chinese Name: ${hasValidZhName ? '✅' : '❌'}`);
    console.log(`Valid Chinese Description: ${hasValidZhDesc ? '✅' : '❌'}`);
    
    if (hasValidZhName && hasValidZhDesc) {
        console.log('\n🎉 SUCCESS: Database contains proper Chinese translations!');
        console.log('The problem must be in the API or frontend logic.');
    } else {
        console.log('\n❌ PROBLEM: Database does not contain proper Chinese translations.');
        console.log('The update script may not have worked correctly.');
    }
    
    db.close();
});
