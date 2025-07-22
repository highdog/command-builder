const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');
const zhMarkdownPath = './Mobile-zh-CN.md';

function extractCommandId(name) {
    // Extract hex ID from command name (e.g., "0x07 Get Bluetooth Led Configurations" -> "0x07")
    const match = name.match(/0x[0-9A-Fa-f]+/);
    return match ? match[0].toLowerCase() : null;
}

function parseChineseMarkdown(content) {
    const sections = content.split(/\n(?=##\s)/);
    const commands = {};
    
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
            
            // Extract command ID from Chinese name
            const commandId = extractCommandId(name);
            
            if (commandId && name && description) {
                commands[commandId] = {
                    category_zh: category,
                    name_zh: name,
                    description_zh: description
                };
                console.log(`Found Chinese command: ${commandId} -> ${name}`);
            }
        });
    });
    
    return commands;
}

function updateDatabase() {
    try {
        console.log('Reading Chinese markdown file...');
        const zhContent = fs.readFileSync(zhMarkdownPath, 'utf-8');
        const zhCommands = parseChineseMarkdown(zhContent);
        
        console.log(`Parsed ${Object.keys(zhCommands).length} Chinese commands`);
        
        if (Object.keys(zhCommands).length === 0) {
            console.error("Could not parse any commands from Chinese markdown file.");
            db.close();
            return;
        }

        // First, get all existing commands from database
        db.all('SELECT id, hex_id, name_en FROM commands', [], (err, rows) => {
            if (err) {
                console.error('Error fetching commands from database:', err.message);
                db.close();
                return;
            }
            
            console.log(`Found ${rows.length} commands in database`);
            
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                const stmt = db.prepare('UPDATE commands SET category_zh = ?, name_zh = ?, description_zh = ? WHERE hex_id = ?');
                let updatedCount = 0;
                let notFoundCount = 0;

                rows.forEach(row => {
                    const hexId = row.hex_id;
                    if (hexId && zhCommands[hexId]) {
                        const zhData = zhCommands[hexId];
                        stmt.run(zhData.category_zh, zhData.name_zh, zhData.description_zh, hexId, function(err) {
                            if (err) {
                                console.error(`Error updating command "${hexId}":`, err.message);
                            } else if (this.changes > 0) {
                                updatedCount++;
                                console.log(`✓ Updated ${hexId}: ${row.name_en} -> ${zhData.name_zh}`);
                            }
                        });
                    } else {
                        notFoundCount++;
                        console.log(`⚠️ No Chinese translation found for ${hexId}: ${row.name_en}`);
                    }
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
                            console.log(`\n🎉 Successfully updated ${updatedCount} commands with Chinese translations.`);
                            console.log(`⚠️ ${notFoundCount} commands had no Chinese translation found.`);
                            
                            // Verify the update
                            db.get('SELECT COUNT(*) as total, COUNT(description_zh) as with_zh FROM commands', [], (err, counts) => {
                                if (err) {
                                    console.error('Error verifying update:', err.message);
                                } else {
                                    console.log(`\n📊 Verification:`);
                                    console.log(`Total commands: ${counts.total}`);
                                    console.log(`Commands with Chinese descriptions: ${counts.with_zh}`);
                                    console.log(`Coverage: ${((counts.with_zh / counts.total) * 100).toFixed(1)}%`);
                                }
                                db.close();
                            });
                        }
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error processing files or database:', error);
        if (db) db.close();
    }
}

console.log('🚀 Starting Chinese data update with improved matching...');
updateDatabase();
