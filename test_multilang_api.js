const http = require('http');
const querystring = require('querystring');

// Function to make HTTP requests with cookies
function makeRequest(path, method = 'GET', data = null, cookies = '') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Cookie': cookies,
                'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                // Extract cookies from response
                const setCookies = res.headers['set-cookie'] || [];
                const sessionCookie = setCookies.find(cookie => cookie.startsWith('connect.sid='));
                
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: responseData,
                    sessionCookie: sessionCookie || cookies
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

async function testMultilingualAPI() {
    console.log('🔍 Testing Multilingual API...\n');
    
    try {
        // Step 1: Login
        console.log('1. Logging in...');
        const loginData = querystring.stringify({
            username: 'admin',
            password: 'admin'
        });
        
        const loginResponse = await makeRequest('/login', 'POST', loginData);
        if (loginResponse.statusCode !== 302) {
            console.error('❌ Login failed');
            return;
        }
        
        const sessionCookie = loginResponse.sessionCookie;
        console.log('✅ Login successful');
        
        // Step 2: Test English API
        console.log('\n2. Testing English API...');
        const enResponse = await makeRequest('/api/commands?lang=en', 'GET', null, sessionCookie);
        
        if (enResponse.statusCode !== 200) {
            console.error(`❌ English API failed: ${enResponse.statusCode}`);
            return;
        }
        
        const enData = JSON.parse(enResponse.data);
        console.log('✅ English API successful');
        
        // Show sample English data
        const enCategories = Object.keys(enData);
        const firstEnCategory = enCategories[0];
        const firstEnCommand = enData[firstEnCategory][0];
        
        console.log(`Sample English data:`);
        console.log(`  Category: "${firstEnCategory}"`);
        console.log(`  Command: "${firstEnCommand.name}"`);
        console.log(`  Total categories: ${enCategories.length}`);
        
        // Step 3: Test Chinese API
        console.log('\n3. Testing Chinese API...');
        const zhResponse = await makeRequest('/api/commands?lang=zh', 'GET', null, sessionCookie);
        
        if (zhResponse.statusCode !== 200) {
            console.error(`❌ Chinese API failed: ${zhResponse.statusCode}`);
            return;
        }
        
        const zhData = JSON.parse(zhResponse.data);
        console.log('✅ Chinese API successful');
        
        // Show sample Chinese data
        const zhCategories = Object.keys(zhData);
        const firstZhCategory = zhCategories[0];
        const firstZhCommand = zhData[firstZhCategory][0];
        
        console.log(`Sample Chinese data:`);
        console.log(`  Category: "${firstZhCategory}"`);
        console.log(`  Command: "${firstZhCommand.name}"`);
        console.log(`  Total categories: ${zhCategories.length}`);
        
        // Step 4: Compare data
        console.log('\n4. Comparing data...');
        
        const enCommandCount = Object.values(enData).reduce((sum, cmds) => sum + cmds.length, 0);
        const zhCommandCount = Object.values(zhData).reduce((sum, cmds) => sum + cmds.length, 0);
        
        console.log(`English command count: ${enCommandCount}`);
        console.log(`Chinese command count: ${zhCommandCount}`);
        console.log(`Counts match: ${enCommandCount === zhCommandCount ? '✅' : '❌'}`);
        
        // Check if categories are different (translated)
        const categoriesDifferent = firstEnCategory !== firstZhCategory;
        const commandsDifferent = firstEnCommand.name !== firstZhCommand.name;
        
        console.log(`Categories translated: ${categoriesDifferent ? '✅' : '❌'}`);
        console.log(`Commands translated: ${commandsDifferent ? '✅' : '❌'}`);
        
        // Step 5: Test search API
        console.log('\n5. Testing search API...');
        
        const searchEnResponse = await makeRequest('/api/search?q=device&lang=en', 'GET', null, sessionCookie);
        const searchZhResponse = await makeRequest('/api/search?q=设备&lang=zh', 'GET', null, sessionCookie);
        
        if (searchEnResponse.statusCode === 200 && searchZhResponse.statusCode === 200) {
            const searchEnData = JSON.parse(searchEnResponse.data);
            const searchZhData = JSON.parse(searchZhResponse.data);
            
            const enSearchCount = Object.values(searchEnData).reduce((sum, cmds) => sum + cmds.length, 0);
            const zhSearchCount = Object.values(searchZhData).reduce((sum, cmds) => sum + cmds.length, 0);
            
            console.log(`✅ Search API working`);
            console.log(`English search results: ${enSearchCount}`);
            console.log(`Chinese search results: ${zhSearchCount}`);
        } else {
            console.log('⚠️ Search API had issues');
        }
        
        // Final verdict
        console.log('\n🎯 Final Assessment:');
        if (categoriesDifferent && commandsDifferent && enCommandCount === zhCommandCount) {
            console.log('🎉 SUCCESS: Multilingual API is working correctly!');
            console.log('✅ Categories are translated');
            console.log('✅ Commands are translated');
            console.log('✅ Data consistency maintained');
        } else {
            console.log('❌ ISSUES: Multilingual API needs attention');
            if (!categoriesDifferent) console.log('❌ Categories not translated');
            if (!commandsDifferent) console.log('❌ Commands not translated');
            if (enCommandCount !== zhCommandCount) console.log('❌ Data count mismatch');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testMultilingualAPI();
