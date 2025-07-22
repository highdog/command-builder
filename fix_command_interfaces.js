const fs = require('fs');
const path = require('path');

// Commands to fix
const commands = [
    { file: 'command-0x08.js', className: 'Command08' },
    { file: 'command-0x0a.js', className: 'Command0A' },
    { file: 'command-0x7d.js', className: 'Command7D' },
    { file: 'command-0x7e.js', className: 'Command7E' },
    { file: 'command-0x7f.js', className: 'Command7F' }
];

function fixCommandFile(filePath, className) {
    console.log(`Fixing ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix method names and structure
    content = content
        // Change buildForm() to render(container)
        .replace(/buildForm\(\)\s*{/, 'render(container) {')
        // Change return ` to container.innerHTML = `
        .replace(/return\s*`/, 'container.innerHTML = `')
        // Add attachListeners call at the end of render method
        .replace(/(\s*`;)\s*}(\s*generatePayload)/, '$1\n        \n        this.attachListeners();\n    }\n\n    attachListeners() {\n        // Add event listeners for form elements\n        const elements = document.querySelectorAll(\'[onchange="generateOutput()"]\');\n        elements.forEach(element => {\n            element.addEventListener(\'change\', () => {\n                if (typeof generateOutput === \'function\') {\n                    generateOutput();\n                }\n            });\n        });\n    }\n\n    get$2')
        // Change generatePayload() to getPayload()
        .replace(/generatePayload\(\)\s*{/, 'getPayload() {')
        // Remove the return object wrapper and just return bytes array
        .replace(/return\s*{\s*bytes:\s*payload,\s*description:\s*this\.getDescription\(\)\s*};\s*}/g, 'return payload.slice(2); // Remove packet type and command ID\n    }')
        // Add getPacketType method
        .replace(/(getPayload\(\)[^}]+})/s, '$1\n\n    getPacketType() {\n        const packetType = document.getElementById(\'field-packet-type\')?.value || \'0\';\n        return parseInt(packetType);\n    }')
        // Remove getDescription method entirely
        .replace(/getDescription\(\)\s*{[^}]+}(\s*})*\s*}/s, '}');
    
    // Remove any remaining getDescription calls
    content = content.replace(/,\s*description:\s*this\.getDescription\(\)/g, '');
    
    // Fix onchange attributes to not call generateOutput directly
    content = content.replace(/onchange="generateOutput\(\)"/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
}

// Fix all command files
commands.forEach(cmd => {
    const filePath = path.join(__dirname, 'public', 'js', 'commands', cmd.file);
    if (fs.existsSync(filePath)) {
        fixCommandFile(filePath, cmd.className);
    } else {
        console.log(`❌ File not found: ${filePath}`);
    }
});

console.log('🎉 All command files have been fixed!');
