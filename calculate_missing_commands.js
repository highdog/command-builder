// Message Definition中的所有命令（从数据库查询结果）
const messageDefinitionCommands = [
    '0x00', '0x01', '0x02', '0x03', '0x06', '0x07', '0x08', '0x09', '0x0A', 
    '0x14', '0x15', '0x16', '0x17', '0x19', '0x20', '0x21', '0x30', '0x31', 
    '0x32', '0x33', '0x34', '0x35', '0x36', '0x37', '0x38', '0x41', '0x44', 
    '0x45', '0x46', '0x47', '0x48', '0x49', '0x4A', '0x4B', '0x4C', '0x4D', 
    '0x4E', '0x4F', '0x57', '0x58', '0x59', '0x5A', '0x5B', '0x5C', '0x5D', 
    '0x5E', '0x5F', '0x60', '0x61', '0x62', '0x63', '0x64', '0x65', '0x66', 
    '0x67', '0x68', '0x69', '0x70', '0x71', '0x72', '0x73', '0x7C', '0x7D', 
    '0x7E', '0x7F'
];

// 已实现的命令（从commands文件夹）
const implementedCommands = [
    '0x00', '0x02', '0x03', '0x06', '0x07', '0x09', '0x14', '0x15', '0x16', 
    '0x17', '0x19', '0x20', '0x21', '0x30', '0x31', '0x32', '0x33', '0x34', 
    '0x35', '0x36', '0x37', '0x38', '0x41', '0x44', '0x45', '0x46', '0x47', 
    '0x48', '0x49', '0x4a', '0x4b', '0x4c', '0x4d', '0x4e', '0x4f', '0x57', 
    '0x58', '0x59', '0x5a', '0x5b', '0x5c', '0x5d', '0x5e', '0x5f', '0x60', 
    '0x61', '0x62', '0x63', '0x64', '0x65', '0x66', '0x67', '0x68', '0x69', 
    '0x70', '0x71', '0x72', '0x73', '0x7c'
];

// 标准化命令ID（统一大小写）
const normalizeCommands = (commands) => {
    return commands.map(cmd => cmd.toUpperCase());
};

const normalizedMessageDef = normalizeCommands(messageDefinitionCommands);
const normalizedImplemented = normalizeCommands(implementedCommands);

// 找出缺失的命令
const missingCommands = normalizedMessageDef.filter(cmd => !normalizedImplemented.includes(cmd));

console.log('📊 Message Definition 命令统计');
console.log('=' .repeat(50));
console.log(`总命令数: ${normalizedMessageDef.length}`);
console.log(`已实现: ${normalizedImplemented.length}`);
console.log(`缺失: ${missingCommands.length}`);
console.log(`完成率: ${((normalizedImplemented.length / normalizedMessageDef.length) * 100).toFixed(1)}%`);

console.log('\n🔴 缺失的命令:');
console.log('=' .repeat(50));
missingCommands.forEach((cmd, index) => {
    console.log(`${index + 1}. ${cmd}`);
});

console.log('\n✅ 已实现的命令:');
console.log('=' .repeat(50));
normalizedImplemented.sort().forEach((cmd, index) => {
    console.log(`${index + 1}. ${cmd}`);
});

console.log(`\n📈 总结: Message Definition分类中有 ${missingCommands.length} 个命令还没有实现构建选项`);
