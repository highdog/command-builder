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

async function testAPI() {
    console.log('🔍 Testing API directly...\n');
    
    try {
        // Step 1: Login
        console.log('1. Logging in...');
        const loginData = querystring.stringify({
            username: 'admin',
            password: 'admin'
        });
        
        const loginResponse = await makeRequest('/login', 'POST', loginData);
        console.log(`Login response: ${loginResponse.statusCode}`);
        
        if (loginResponse.statusCode !== 302) {
            console.error('❌ Login failed');
            return;
        }
        
        const sessionCookie = loginResponse.sessionCookie;
        console.log('✅ Login successful, got session cookie');
        
        // Step 2: Get commands list
        console.log('\n2. Getting commands list...');
        const commandsResponse = await makeRequest('/api/commands', 'GET', null, sessionCookie);
        
        if (commandsResponse.statusCode !== 200) {
            console.error(`❌ Commands API failed: ${commandsResponse.statusCode}`);
            console.error(commandsResponse.data);
            return;
        }
        
        const commandsData = JSON.parse(commandsResponse.data);
        console.log('✅ Commands list retrieved');
        
        // Find command with hex_id 0x07
        let targetCommand = null;
        for (const [category, commands] of Object.entries(commandsData)) {
            const found = commands.find(cmd => cmd.hex_id === '0x07');
            if (found) {
                targetCommand = found;
                console.log(`✅ Found 0x07 command: ${found.name} (ID: ${found.id})`);
                break;
            }
        }
        
        if (!targetCommand) {
            console.error('❌ 0x07 command not found');
            return;
        }
        
        // Step 3: Get specific command details
        console.log('\n3. Getting command details...');
        const detailResponse = await makeRequest(`/api/commands/${targetCommand.id}`, 'GET', null, sessionCookie);
        
        if (detailResponse.statusCode !== 200) {
            console.error(`❌ Command detail API failed: ${detailResponse.statusCode}`);
            console.error(detailResponse.data);
            return;
        }
        
        const commandDetail = JSON.parse(detailResponse.data);
        console.log('✅ Command details retrieved');
        
        // Step 4: Analyze the data
        console.log('\n4. Analyzing Chinese data...');
        console.log('=' .repeat(60));
        console.log(`Command ID: ${commandDetail.hex_id}`);
        console.log(`English Name: ${commandDetail.name_en}`);
        console.log(`Chinese Name: ${commandDetail.name_zh}`);
        console.log(`English Desc Length: ${commandDetail.description_en ? commandDetail.description_en.length : 0}`);
        console.log(`Chinese Desc Length: ${commandDetail.description_zh ? commandDetail.description_zh.length : 0}`);
        
        console.log('\nEnglish Description Preview:');
        console.log(commandDetail.description_en ? commandDetail.description_en.substring(0, 100) + '...' : 'N/A');
        
        console.log('\nChinese Description Preview:');
        console.log(commandDetail.description_zh ? commandDetail.description_zh.substring(0, 100) + '...' : 'N/A');
        
        // Check if Chinese is actually different from English
        const namesDifferent = commandDetail.name_zh !== commandDetail.name_en;
        const descsDifferent = commandDetail.description_zh !== commandDetail.description_en;
        
        console.log('\n📊 Analysis:');
        console.log(`Names are different: ${namesDifferent ? '✅' : '❌'}`);
        console.log(`Descriptions are different: ${descsDifferent ? '✅' : '❌'}`);
        console.log(`Has Chinese description: ${!!commandDetail.description_zh ? '✅' : '❌'}`);
        
        if (namesDifferent && descsDifferent && commandDetail.description_zh) {
            console.log('\n🎉 SUCCESS: API returns proper Chinese data!');
        } else {
            console.log('\n❌ PROBLEM: Chinese data is not properly different from English');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();
