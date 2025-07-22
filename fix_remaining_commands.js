const fs = require('fs');
const path = require('path');

// Commands to fix (excluding 0x01 and 0x08 which are already fixed)
const commands = ['0x0a', '0x7d', '0x7e', '0x7f'];

function fixCommand(commandId) {
    const filePath = path.join(__dirname, 'public', 'js', 'commands', `command-${commandId}.js`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return;
    }
    
    console.log(`Fixing ${commandId}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix buildForm() to render(container)
    content = content.replace(/buildForm\(\)\s*{/, 'render(container) {');
    
    // 2. Fix return ` to container.innerHTML = `
    content = content.replace(/return\s*`/, 'container.innerHTML = `');
    
    // 3. Add attachListeners call and method
    const attachListenersCode = `
        
        this.attachListeners();
    }

    attachListeners() {
        // Add event listeners for all form elements
        const formElements = document.querySelectorAll('#field-packet-type, [id^="field-"]');
        formElements.forEach(element => {
            if (element.id && element.id.startsWith('field-')) {
                this.addListener(element.id, 'change');
            }
        });
    }`;
    
    content = content.replace(/(\s*`;)\s*}(\s*generatePayload)/, `$1${attachListenersCode}\n\n    get$2`);
    
    // 4. Fix generatePayload() to getPayload()
    content = content.replace(/generatePayload\(\)\s*{/, 'getPayload() {');
    
    // 5. Fix payload return - remove packet type and command ID, just return the payload bytes
    content = content.replace(/const payload = \[\s*parseInt\(packetType\),\s*0x[0-9A-Fa-f]+,\s*([\s\S]*?)\];/g, 
        (match, payloadContent) => {
            return `return [\n            ${payloadContent.trim()}\n        ];`;
        });
    
    // 6. Add getPacketType method
    const getPacketTypeCode = `
    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }`;
    
    content = content.replace(/(getPayload\(\)[^}]*})/s, `$1\n${getPacketTypeCode}`);
    
    // 7. Remove getDescription method entirely
    content = content.replace(/getDescription\(\)\s*{[\s\S]*?^    }/gm, '');
    
    // 8. Remove any remaining return object wrappers
    content = content.replace(/return\s*{\s*bytes:\s*payload,\s*description:\s*this\.getDescription\(\)\s*};\s*/g, '');
    
    // 9. Remove onchange attributes
    content = content.replace(/onchange="generateOutput\(\)"/g, '');
    
    // 10. Clean up any duplicate methods or malformed code
    content = content.replace(/}\s*}\s*}/g, '}');
    content = content.replace(/get\s*getPayload/g, 'getPayload');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${commandId}`);
}

// Fix all remaining commands
commands.forEach(fixCommand);

console.log('🎉 All remaining command files have been fixed!');
