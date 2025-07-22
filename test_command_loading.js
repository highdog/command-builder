const http = require('http');

// Test if the new commands are accessible via the command builder
function testCommandAccess() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/command_builder.html',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ Command Builder页面可访问');
            
            // Check if the command loader is included
            if (data.includes('command-loader.js')) {
                console.log('✅ Command Loader已包含');
            } else {
                console.log('❌ Command Loader未包含');
            }
            
            // Check if base command is included
            if (data.includes('base-command.js')) {
                console.log('✅ Base Command已包含');
            } else {
                console.log('❌ Base Command未包含');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ 请求失败:', error.message);
    });

    req.end();
}

// Test if individual command files are accessible
async function testCommandFiles() {
    const newCommands = ['0x01', '0x08', '0x0a', '0x7d', '0x7e', '0x7f'];
    
    console.log('\n🔍 测试命令文件可访问性:');
    
    for (const cmd of newCommands) {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/js/commands/command-${cmd}.js`,
            method: 'GET'
        };

        await new Promise((resolve) => {
            const req = http.request(options, (res) => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${cmd}: 文件可访问`);
                } else {
                    console.log(`❌ ${cmd}: HTTP ${res.statusCode}`);
                }
                resolve();
            });

            req.on('error', (error) => {
                console.log(`❌ ${cmd}: ${error.message}`);
                resolve();
            });

            req.end();
        });
    }
}

// Test command loader configuration
function testCommandLoaderConfig() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/js/command-loader.js',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('\n🔍 检查Command Loader配置:');
            
            const newCommands = ['0x01', '0x08', '0x0a', '0x7d', '0x7e', '0x7f'];
            
            for (const cmd of newCommands) {
                if (data.includes(`'${cmd}'`)) {
                    console.log(`✅ ${cmd}: 已在AVAILABLE_COMMANDS中`);
                } else {
                    console.log(`❌ ${cmd}: 未在AVAILABLE_COMMANDS中`);
                }
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ 请求失败:', error.message);
    });

    req.end();
}

async function runTests() {
    console.log('🚀 开始测试新命令加载...\n');
    
    testCommandAccess();
    
    setTimeout(() => {
        testCommandLoaderConfig();
    }, 1000);
    
    setTimeout(async () => {
        await testCommandFiles();
        
        console.log('\n📋 测试总结:');
        console.log('1. 检查Command Builder页面是否包含必要的脚本');
        console.log('2. 检查Command Loader是否包含新命令');
        console.log('3. 检查新命令文件是否可访问');
        console.log('\n如果所有测试都通过，新命令应该可以在Command Builder中正常工作。');
    }, 2000);
}

runTests();
