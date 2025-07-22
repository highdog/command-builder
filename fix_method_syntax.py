#!/usr/bin/env python3
"""
Fix method syntax in command files
"""

import os
import re
import glob

def fix_method_syntax_in_file(filepath):
    """Fix method syntax in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix method declarations: "        methodName(" -> "    methodName("
    content = re.sub(r'^        (\w+)\(', r'    \1(', content, flags=re.MULTILINE)
    
    # Fix method separators: ensure proper closing and spacing
    content = re.sub(r'\n        \}(\s*\n\s*)(\w+\s*\([^)]*\)\s*\{)', r'\n    }\1\1    \2', content)
    
    # Fix constructor closing
    content = re.sub(r'\n        \}(\s*\n\s*)(render|attachListeners|getPayload|getPacketType)', r'\n    }\1\1    \2', content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    # Find files that need fixing
    problem_files = ['public/js/commands/command-0x20.js']
    
    for filepath in problem_files:
        if os.path.exists(filepath):
            print(f"Fixing {filepath}...")
            if fix_method_syntax_in_file(filepath):
                print(f"  Fixed")
            else:
                print(f"  No changes needed")

if __name__ == '__main__':
    main()
