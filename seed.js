const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');
const markdownPath = './Mobile.md';

function parseMarkdownAndSeedDatabase() {
  try {
    const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

    const sections = markdownContent.split(/\n(?=##\s)/);
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
          // For now, use English content as a placeholder for Chinese
          commands.push({
            category_en: category,
            name_en: name,
            description_en: description,
            category_zh: category, // Placeholder
            name_zh: name,       // Placeholder
            description_zh: description // Placeholder
          });
        }
      });
    });

    if (commands.length === 0) {
      console.log("Could not parse any commands from Mobile.md.");
      db.close();
      return;
    }

    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO commands (category_en, name_en, description_en, category_zh, name_zh, description_zh) VALUES (?, ?, ?, ?, ?, ?)');
      let insertedCount = 0;
      db.run('BEGIN TRANSACTION');
      commands.forEach(cmd => {
        stmt.run(cmd.category_en, cmd.name_en, cmd.description_en, cmd.category_zh, cmd.name_zh, cmd.description_zh, function(err) {
          if (err) {
            console.error(`Error inserting command "${cmd.name_en}":`, err.message);
          } else {
            insertedCount++;
          }
        });
      });
      stmt.finalize();
      db.run('COMMIT', (err) => {
        if (err) {
            console.error("Commit failed", err.message);
        }
        console.log(`Successfully inserted ${insertedCount} commands.`);
        db.close();
      });
    });

  } catch (error) {
    console.error('Error processing Markdown file:', error);
    if (db) db.close();
  }
}

parseMarkdownAndSeedDatabase();