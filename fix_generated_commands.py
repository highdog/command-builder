#!/usr/bin/env python3
"""
Fix the generated command files to have proper class method syntax
"""

import os
import re
import glob

def fix_command_file(filepath):
    """Fix a single command file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the class name
    class_match = re.search(r'class (\w+) extends BaseCommand', content)
    if not class_match:
        print(f"Could not find class name in {filepath}")
        return False
    
    class_name = class_match.group(1)
    
    # Fix method syntax: convert "methodName: function(...) {" to "methodName(...) {"
    content = re.sub(r'(\s+)(\w+):\s*function\s*\(([^)]*)\)\s*{', r'\1\2(\3) {', content)
    
    # Remove trailing commas after methods
    content = re.sub(r'},(\s*\n\s*\w+\s*\([^)]*\)\s*{)', r'}\1', content)
    content = re.sub(r'},(\s*\n\s*})', r'}\1', content)
    
    # Fix the last method (remove trailing comma)
    content = re.sub(r'},(\s*\n\s*}\s*\n\s*//)', r'}\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    # Find all generated command files
    command_files = glob.glob('public/js/commands/command-0x*.js')
    
    # Skip the manually created ones that are already correct
    skip_files = [
        'public/js/commands/command-0x00.js',
        'public/js/commands/command-0x02.js', 
        'public/js/commands/command-0x03.js',
        'public/js/commands/command-0x59.js'
    ]
    
    for filepath in command_files:
        if filepath in skip_files:
            print(f"Skipping {filepath} (manually created)")
            continue
            
        print(f"Fixing {filepath}...")
        if fix_command_file(filepath):
            print(f"  Fixed successfully")
        else:
            print(f"  Failed to fix")

if __name__ == '__main__':
    main()
