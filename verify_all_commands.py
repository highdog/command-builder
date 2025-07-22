#!/usr/bin/env python3
"""
Verify all command files have correct class names and syntax
"""

import os
import re
import glob
import subprocess

def verify_command_file(filepath):
    """Verify a single command file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract command ID from filename
    filename = os.path.basename(filepath)
    cmd_id = filename.replace('command-', '').replace('.js', '')
    
    # Expected class name
    hex_part = cmd_id.replace('0x', '').upper()
    expected_class_name = f"Command{hex_part}"
    
    # Check class declaration
    class_match = re.search(r'class (Command[0-9A-Fa-f]+) extends BaseCommand', content)
    if not class_match:
        return False, f"No class declaration found"
    
    actual_class_name = class_match.group(1)
    if actual_class_name != expected_class_name:
        return False, f"Class name mismatch: expected {expected_class_name}, got {actual_class_name}"
    
    # Check window assignment
    window_pattern = rf'window\.{re.escape(expected_class_name)} = {re.escape(expected_class_name)};'
    if not re.search(window_pattern, content):
        return False, f"Missing or incorrect window assignment"
    
    # Check syntax with Node.js
    try:
        result = subprocess.run(['node', '-c', filepath], capture_output=True, text=True)
        if result.returncode != 0:
            return False, f"Syntax error: {result.stderr}"
    except FileNotFoundError:
        print("Warning: Node.js not found, skipping syntax check")
    
    return True, "OK"

def main():
    print("=== 验证所有命令文件 ===\n")
    
    # Find all command files
    command_files = glob.glob('public/js/commands/command-0x*.js')
    command_files.sort()
    
    success_count = 0
    error_count = 0
    
    for filepath in command_files:
        filename = os.path.basename(filepath)
        cmd_id = filename.replace('command-', '').replace('.js', '')
        
        success, message = verify_command_file(filepath)
        
        if success:
            print(f"✓ {cmd_id}: {message}")
            success_count += 1
        else:
            print(f"✗ {cmd_id}: {message}")
            error_count += 1
    
    print(f"\n=== 验证结果 ===")
    print(f"成功: {success_count}")
    print(f"失败: {error_count}")
    print(f"总计: {len(command_files)}")
    
    if error_count == 0:
        print("\n🎉 所有命令文件验证通过！")
    else:
        print(f"\n⚠️  有 {error_count} 个文件需要修复")

if __name__ == '__main__':
    main()
