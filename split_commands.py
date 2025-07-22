#!/usr/bin/env python3
"""
Script to automatically split command_handlers.js into individual command files
"""

import re
import os
import json

def extract_commands_from_file(file_path):
    """Extract all command handlers from the original file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all command definitions
    command_pattern = r"'(0x[0-9A-Fa-f]+)'\s*:\s*\{(.*?)\n\s*\},"
    commands = {}
    
    # Split by command boundaries
    lines = content.split('\n')
    current_command = None
    current_content = []
    brace_count = 0
    in_command = False
    
    for line in lines:
        # Check if this line starts a new command
        command_match = re.match(r"\s*'(0x[0-9A-Fa-f]+)'\s*:\s*\{", line)
        if command_match:
            # Save previous command if exists
            if current_command and current_content:
                commands[current_command] = '\n'.join(current_content)
            
            # Start new command
            current_command = command_match.group(1)
            current_content = [line]
            brace_count = 1
            in_command = True
            continue
        
        if in_command:
            current_content.append(line)
            # Count braces to find end of command
            brace_count += line.count('{') - line.count('}')
            
            # If we've closed all braces, this command is complete
            if brace_count == 0:
                commands[current_command] = '\n'.join(current_content)
                current_command = None
                current_content = []
                in_command = False
    
    return commands

def convert_to_class_format(command_id, command_content):
    """Convert a command object to class format"""
    
    # Extract the class name
    class_name = f"Command{command_id.replace('0x', '').upper()}"
    
    # Extract methods from the command content
    methods = {}
    
    # Find all method definitions
    method_pattern = r"(\w+):\s*function\s*\([^)]*\)\s*\{(.*?)\n\s*\},"
    method_matches = re.finditer(method_pattern, command_content, re.DOTALL)
    
    for match in method_matches:
        method_name = match.group(1)
        method_body = match.group(2)
        methods[method_name] = method_body.strip()
    
    # Also find properties (non-function values)
    property_pattern = r"(\w+):\s*(\{[^}]*\}|[^,\n]+),"
    property_matches = re.finditer(property_pattern, command_content)
    
    properties = {}
    for match in property_matches:
        prop_name = match.group(1)
        prop_value = match.group(2).strip()
        if not prop_value.startswith('function'):
            properties[prop_name] = prop_value
    
    # Generate the class file content
    class_content = f'''/**
 * Command {command_id} - Auto-generated from command_handlers.js
 */
class {class_name} extends BaseCommand {{
    constructor(commandId) {{
        super(commandId);
'''
    
    # Add properties as instance variables
    for prop_name, prop_value in properties.items():
        class_content += f'        this.{prop_name} = {prop_value};\n'
    
    class_content += '    }\n\n'
    
    # Add methods
    for method_name, method_body in methods.items():
        # Clean up method body - remove 'this.' references where appropriate
        cleaned_body = method_body.replace('this.', 'this.')
        
        class_content += f'''    {method_name}({get_method_params(method_name)}) {{
{indent_code(cleaned_body, 8)}
    }}

'''
    
    class_content += f'''}}

// Register the command class globally
window.{class_name} = {class_name};'''
    
    return class_content

def get_method_params(method_name):
    """Get parameter list for common methods"""
    if method_name == 'render':
        return 'container'
    elif method_name in ['attachListeners', 'getPayload', 'getPacketType']:
        return ''
    else:
        return ''  # Default to no parameters

def indent_code(code, spaces):
    """Indent code by specified number of spaces"""
    lines = code.split('\n')
    indented_lines = []
    for line in lines:
        if line.strip():
            indented_lines.append(' ' * spaces + line)
        else:
            indented_lines.append('')
    return '\n'.join(indented_lines)

def main():
    input_file = 'public/js/command_handlers.js'
    output_dir = 'public/js/commands'
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract commands
    commands = extract_commands_from_file(input_file)
    
    print(f"Found {len(commands)} commands:")
    for cmd_id in commands.keys():
        print(f"  - {cmd_id}")
    
    # Generate individual files
    for command_id, command_content in commands.items():
        filename = f"command-{command_id.lower()}.js"
        filepath = os.path.join(output_dir, filename)
        
        try:
            class_content = convert_to_class_format(command_id, command_content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(class_content)
            
            print(f"Generated: {filepath}")
        except Exception as e:
            print(f"Error generating {filepath}: {e}")

if __name__ == '__main__':
    main()
