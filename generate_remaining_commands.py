#!/usr/bin/env python3
"""
Simple script to generate remaining command files from the original command_handlers.js
"""

import re
import os

def extract_command_block(content, command_id):
    """Extract a specific command block from the content"""
    # Find the start of the command
    start_pattern = f"'{command_id}'\\s*:\\s*{{"
    start_match = re.search(start_pattern, content)
    if not start_match:
        return None
    
    start_pos = start_match.start()
    
    # Find the end by counting braces
    brace_count = 0
    pos = start_match.end() - 1  # Start from the opening brace
    
    while pos < len(content):
        char = content[pos]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                # Found the closing brace
                end_pos = pos + 1
                # Look for the comma after the closing brace
                while end_pos < len(content) and content[end_pos] in ' \n\t':
                    end_pos += 1
                if end_pos < len(content) and content[end_pos] == ',':
                    end_pos += 1
                return content[start_pos:end_pos]
        pos += 1
    
    return None

def convert_to_class(command_id, command_block):
    """Convert a command block to a class"""
    # Extract the hex part for class name
    hex_part = command_id.replace('0x', '').zfill(2)
    class_name = f"Command{hex_part}"
    
    # Extract the content inside the braces
    brace_start = command_block.find('{')
    brace_end = command_block.rfind('}')
    if brace_start == -1 or brace_end == -1:
        return None
    
    content = command_block[brace_start+1:brace_end]
    
    # Simple conversion - just wrap the existing methods in a class
    class_content = f'''/**
 * Command {command_id} - Auto-generated from command_handlers.js
 */
class {class_name} extends BaseCommand {{
    constructor(commandId) {{
        super(commandId);
    }}

{content}
}}

// Register the command class globally
window.{class_name} = {class_name};'''
    
    return class_content

def main():
    # Read the original file
    with open('public/js/command_handlers.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Commands we haven't created yet
    remaining_commands = [
        '0x06', '0x07', '0x09', '0x14', '0x15', '0x16', '0x17', 
        '0x19', '0x20', '0x21', '0x30', '0x31', '0x32', '0x33', 
        '0x34', '0x35', '0x36', '0x41'
    ]
    
    # Create output directory if it doesn't exist
    os.makedirs('public/js/commands', exist_ok=True)
    
    for command_id in remaining_commands:
        print(f"Processing {command_id}...")
        
        # Extract the command block
        command_block = extract_command_block(content, command_id)
        if not command_block:
            print(f"  Could not find command {command_id}")
            continue
        
        # Convert to class
        class_content = convert_to_class(command_id, command_block)
        if not class_content:
            print(f"  Could not convert command {command_id}")
            continue
        
        # Write to file
        filename = f"public/js/commands/command-{command_id.lower()}.js"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(class_content)
        
        print(f"  Generated: {filename}")

if __name__ == '__main__':
    main()
