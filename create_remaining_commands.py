#!/usr/bin/env python3
"""
Create the remaining command files
"""

import os

# Define the remaining commands with their descriptions and basic structures
remaining_commands = {
    '0x5a': {
        'name': 'Set Custom Keys',
        'description': '设置自定义按键',
        'has_response': True
    },
    '0x5b': {
        'name': 'Get Prompt Language',
        'description': '获取提示语言',
        'has_response': True
    },
    '0x5c': {
        'name': 'Set Prompt Language',
        'description': '设置提示语言',
        'has_response': True
    },
    '0x5d': {
        'name': 'Factory Reset',
        'description': '恢复出厂设置',
        'has_response': True
    },
    '0x5e': {
        'name': 'Get Prompt Sound State',
        'description': '获取提示音状态',
        'has_response': True
    },
    '0x5f': {
        'name': 'Set Prompt Sound State',
        'description': '设置提示音状态',
        'has_response': True
    },
    '0x60': {
        'name': 'Get ANC Mode',
        'description': '获取ANC模式',
        'has_response': True
    },
    '0x61': {
        'name': 'Set ANC Mode',
        'description': '设置ANC模式',
        'has_response': True
    },
    '0x62': {
        'name': 'Get Low Latency Mode',
        'description': '获取低延迟模式',
        'has_response': True
    },
    '0x63': {
        'name': 'Set Low Latency Mode',
        'description': '设置低延迟模式',
        'has_response': True
    },
    '0x64': {
        'name': 'Get Wearing Detection Configuration',
        'description': '获取佩戴检测配置',
        'has_response': True
    },
    '0x65': {
        'name': 'Set Wearing Detection Configuration',
        'description': '设置佩戴检测配置',
        'has_response': True
    },
    '0x66': {
        'name': 'Get Enabled Voice Prompts',
        'description': '获取启用的语音提示',
        'has_response': True
    },
    '0x67': {
        'name': 'Set Enabled Voice Prompts',
        'description': '设置启用的语音提示',
        'has_response': True
    },
    '0x68': {
        'name': 'Get LED Brightness',
        'description': '获取LED亮度',
        'has_response': True
    },
    '0x69': {
        'name': 'Set LED Brightness',
        'description': '设置LED亮度',
        'has_response': True
    },
    '0x70': {
        'name': 'Get Sidetone Mode',
        'description': '获取侧音模式',
        'has_response': True
    },
    '0x71': {
        'name': 'Set Sidetone Mode',
        'description': '设置侧音模式',
        'has_response': True
    },
    '0x72': {
        'name': 'Get Sidetone Gain',
        'description': '获取侧音增益',
        'has_response': True
    },
    '0x73': {
        'name': 'Set Sidetone Gain',
        'description': '设置侧音增益',
        'has_response': True
    },
    '0x7c': {
        'name': 'Get Dolby Atmos Config',
        'description': '获取杜比全景声配置',
        'has_response': True
    }
}

def create_command_file(cmd_id, cmd_info):
    """Create a command file"""
    hex_part = cmd_id.replace('0x', '').upper()
    class_name = f"Command{hex_part}"
    
    # Determine if it's a GET or SET command
    is_set_command = 'Set' in cmd_info['name'] or 'Factory Reset' in cmd_info['name']
    
    # Basic template
    template = f'''/**
 * Command {cmd_id} - {cmd_info['name']}
 * {cmd_info['description']}
 */
class {class_name} extends BaseCommand {{
    constructor(commandId) {{
        super(commandId);
    }}

    render(container) {{
        const html = `
            <div class="form-group">
                <label for="field-packet-type-{cmd_id}">数据包类型:</label>
                <select id="field-packet-type-{cmd_id}" class="payload-input">
                    <option value="0"{"" if not is_set_command else " selected"}>COMMAND ({'get' if not is_set_command else 'execute'})</option>
                    <option value="2"{"" if is_set_command else " selected"}>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-{cmd_id}">
                <div class="form-group">
                    <label for="field-value-{cmd_id}">值:</label>
                    <input type="number" id="field-value-{cmd_id}" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }}

    attachListeners() {{
        this.addListener('field-packet-type-{cmd_id}', 'change', (e) => {{
            document.getElementById('response-options-{cmd_id}').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        }});
    }}

    getPayload() {{
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-{cmd_id}').value) || 0;
        return [value];
    }}

    getPacketType() {{
        return parseInt(document.getElementById('field-packet-type-{cmd_id}').value, 10);
    }}
}}

// Register the command class globally
window.{class_name} = {class_name};'''
    
    return template

def main():
    # Create output directory if it doesn't exist
    os.makedirs('public/js/commands', exist_ok=True)
    
    created_count = 0
    for cmd_id, cmd_info in remaining_commands.items():
        filename = f"public/js/commands/command-{cmd_id}.js"
        
        # Skip if file already exists
        if os.path.exists(filename):
            print(f"Skipping {filename} (already exists)")
            continue
        
        content = create_command_file(cmd_id, cmd_info)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Created: {filename}")
        created_count += 1
    
    print(f"\nCreated {created_count} command files")

if __name__ == '__main__':
    main()
