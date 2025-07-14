const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');
const enMarkdownPath = './Mobile.md';
const zhMarkdownPath = './Mobile-zh-CN.md';

function parseMarkdown(content) {
    const sections = content.split(/\n(?=##\s)/);
    const commands = [];
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const sectionTitleLine = lines.shift()?.trim();

        if (!sectionTitleLine || !sectionTitleLine.startsWith('## ')) {
            return;
        }

        const category = sectionTitleLine.replace('## ', '').trim();
        const commandBlocks = section.split(/\n(?=###\s)/);
        
        commandBlocks.slice(1).forEach(block => {
            const blockLines = block.trim().split('\n');
            const commandTitleLine = blockLines.shift()?.trim();
            if (!commandTitleLine) return;

            const name = commandTitleLine.replace('###', '').trim();
            const description = blockLines.join('\n').trim();

            if (name && description) {
                commands.push({ category, name, description });
            }
        });
    });
    return commands;
}

function updateDatabase() {
    try {
        const enContent = fs.readFileSync(enMarkdownPath, 'utf-8');
        const zhContent = fs.readFileSync(zhMarkdownPath, 'utf-8');

        const enCommands = parseMarkdown(enContent);
        const zhCommands = parseMarkdown(zhContent);

        if (enCommands.length === 0 || zhCommands.length === 0) {
            console.error("Could not parse commands from one or both markdown files.");
            db.close();
            return;
        }

        if (enCommands.length !== zhCommands.length) {
            console.warn("Warning: The number of commands in English and Chinese documents does not match.");
        }

        const commandMap = {};
        enCommands.forEach((cmd, index) => {
            if (zhCommands[index]) {
                commandMap[cmd.name] = {
                    category_zh: zhCommands[index].category,
                    name_zh: zhCommands[index].name,
                    description_zh: zhCommands[index].description
                };
            }
        });

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            const stmt = db.prepare('UPDATE commands SET category_zh = ?, name_zh = ?, description_zh = ? WHERE name_en = ?');
            let updatedCount = 0;

            Object.keys(commandMap).forEach(enName => {
                const zhData = commandMap[enName];
                stmt.run(zhData.category_zh, zhData.name_zh, zhData.description_zh, enName, function(err) {
                    if (err) {
                        console.error(`Error updating command "${enName}":`, err.message);
                    } else if (this.changes > 0) {
                        updatedCount++;
                    }
                });
            });

            stmt.finalize(err => {
                if (err) {
                    console.error("Finalize failed, rolling back.", err.message);
                    db.run('ROLLBACK');
                    db.close();
                    return;
                }
                
                db.run('COMMIT', (commitErr) => {
                    if (commitErr) {
                        console.error("Commit failed", commitErr.message);
                        db.run('ROLLBACK');
                    } else {
                        console.log(`Successfully updated ${updatedCount} commands with Chinese translations.`);
                    }
                    db.close();
                });
            });
        });

    } catch (error) {
        console.error('Error processing files or database:', error);
        if (db) db.close();
    }
}

updateDatabase();
