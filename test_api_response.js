const http = require('http');

// Test API response for a specific command
function testCommandAPI(commandId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/commands/${commandId}`,
            method: 'GET',
            headers: {
                'Cookie': 'session=test' // Mock session for testing
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function runTests() {
    console.log('Testing API responses for Chinese data...\n');
    
    // Test a few different commands
    const testCommands = [1, 2, 3]; // Database IDs
    
    for (const commandId of testCommands) {
        try {
            console.log(`Testing command ID ${commandId}:`);
            const response = await testCommandAPI(commandId);
            
            console.log(`  hex_id: ${response.hex_id}`);
            console.log(`  name_en: ${response.name_en}`);
            console.log(`  name_zh: ${response.name_zh || 'NOT FOUND'}`);
            console.log(`  description_en: ${response.description_en ? response.description_en.substring(0, 100) + '...' : 'NOT FOUND'}`);
            console.log(`  description_zh: ${response.description_zh ? response.description_zh.substring(0, 100) + '...' : 'NOT FOUND'}`);
            console.log('-'.repeat(80));
            
        } catch (error) {
            console.error(`Error testing command ${commandId}:`, error.message);
        }
    }
}

runTests();
