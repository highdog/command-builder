#!/usr/bin/env python3
"""
Fix class names in command files to use uppercase hex digits
"""

import os
import re
import glob

def fix_class_name_in_file(filepath):
    """Fix class names in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract command ID from filename
    filename = os.path.basename(filepath)
    cmd_id = filename.replace('command-', '').replace('.js', '')
    
    # Convert to uppercase hex (e.g., 0x4a -> 4A)
    hex_part = cmd_id.replace('0x', '').upper()
    correct_class_name = f"Command{hex_part}"
    
    # Find current class name pattern
    class_match = re.search(r'class (Command[0-9A-Fa-f]+) extends BaseCommand', content)
    if not class_match:
        print(f"No class found in {filepath}")
        return False
    
    current_class_name = class_match.group(1)
    
    if current_class_name == correct_class_name:
        print(f"Skipping {filepath} (already correct: {correct_class_name})")
        return True
    
    print(f"Fixing {filepath}: {current_class_name} -> {correct_class_name}")
    
    # Replace class declaration
    content = re.sub(
        rf'class {re.escape(current_class_name)} extends BaseCommand',
        f'class {correct_class_name} extends BaseCommand',
        content
    )
    
    # Replace window assignment
    content = re.sub(
        rf'window\.{re.escape(current_class_name)} = {re.escape(current_class_name)};',
        f'window.{correct_class_name} = {correct_class_name};',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    # Find all command files
    command_files = glob.glob('public/js/commands/command-0x*.js')
    
    fixed_count = 0
    for filepath in command_files:
        if fix_class_name_in_file(filepath):
            fixed_count += 1
    
    print(f"\nProcessed {fixed_count} command files")

if __name__ == '__main__':
    main()
