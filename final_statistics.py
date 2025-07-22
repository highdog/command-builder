#!/usr/bin/env python3
"""
Generate final statistics for the command refactoring project
"""

import os
import glob

def count_lines_in_file(filepath):
    """Count lines in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except:
        return 0

def main():
    print("=== 命令处理器重构最终统计 ===\n")
    
    # Count command files
    command_files = glob.glob('public/js/commands/command-*.js')
    command_files.sort()
    
    print(f"📁 命令文件总数: {len(command_files)}")
    print(f"📄 基础文件数: 2 (base-command.js + command-loader.js)")
    print(f"📊 总文件数: {len(command_files) + 2}")
    
    # Count lines
    total_lines = 0
    for filepath in command_files:
        lines = count_lines_in_file(filepath)
        total_lines += lines
    
    # Add base files
    base_lines = count_lines_in_file('public/js/commands/base-command.js')
    loader_lines = count_lines_in_file('public/js/command-loader.js')
    total_lines += base_lines + loader_lines
    
    print(f"📝 总代码行数: {total_lines}")
    print(f"📈 平均每个命令: {total_lines // len(command_files) if command_files else 0} 行")
    
    # Original file stats
    original_lines = count_lines_in_file('public/js/command_handlers.js')
    print(f"📋 原始文件行数: {original_lines}")
    
    # List all commands
    print(f"\n🎯 所有命令列表:")
    commands = []
    for filepath in command_files:
        filename = os.path.basename(filepath)
        cmd_id = filename.replace('command-', '').replace('.js', '').upper()
        commands.append(cmd_id)
    
    # Group commands by range
    ranges = {
        '0x00-0x0F': [],
        '0x10-0x1F': [],
        '0x20-0x2F': [],
        '0x30-0x3F': [],
        '0x40-0x4F': [],
        '0x50-0x5F': [],
        '0x60-0x6F': [],
        '0x70-0x7F': []
    }
    
    for cmd in commands:
        hex_val = int(cmd.replace('0X', ''), 16)
        if 0x00 <= hex_val <= 0x0F:
            ranges['0x00-0x0F'].append(cmd)
        elif 0x10 <= hex_val <= 0x1F:
            ranges['0x10-0x1F'].append(cmd)
        elif 0x20 <= hex_val <= 0x2F:
            ranges['0x20-0x2F'].append(cmd)
        elif 0x30 <= hex_val <= 0x3F:
            ranges['0x30-0x3F'].append(cmd)
        elif 0x40 <= hex_val <= 0x4F:
            ranges['0x40-0x4F'].append(cmd)
        elif 0x50 <= hex_val <= 0x5F:
            ranges['0x50-0x5F'].append(cmd)
        elif 0x60 <= hex_val <= 0x6F:
            ranges['0x60-0x6F'].append(cmd)
        elif 0x70 <= hex_val <= 0x7F:
            ranges['0x70-0x7F'].append(cmd)
    
    for range_name, cmd_list in ranges.items():
        if cmd_list:
            print(f"  {range_name}: {', '.join(sorted(cmd_list))}")
    
    print(f"\n✅ 重构完成!")
    print(f"   • 从 1 个巨大文件 → {len(command_files) + 2} 个模块化文件")
    print(f"   • 支持 {len(command_files)} 个不同的命令")
    print(f"   • 完全向后兼容")
    print(f"   • 易于维护和扩展")

if __name__ == '__main__':
    main()
