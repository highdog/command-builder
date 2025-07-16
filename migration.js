const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// --- DATA TO MIGRATE ---
// Copied from command_builder.html

const commandPacketTypes = {
    "0x00": ["COMMAND", "RESPONSE", "ERROR"], "0x19": ["COMMAND", "RESPONSE", "ERROR"],
    "0x01": ["COMMAND", "RESPONSE", "ERROR"], "0x02": ["COMMAND", "RESPONSE", "ERROR"],
    "0x03": ["COMMAND", "RESPONSE", "ERROR"], "0x06": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"],
    "0x07": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x08": ["COMMAND", "RESPONSE", "ERROR"],
    "0x09": ["COMMAND", "RESPONSE", "ERROR"], "0x0A": ["COMMAND", "RESPONSE", "ERROR"],
    "0x14": ["COMMAND", "RESPONSE", "ERROR"], "0x15": ["COMMAND", "RESPONSE", "ERROR"],
    "0x16": ["COMMAND", "RESPONSE", "ERROR"], "0x17": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"],
    "0x41": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x44": ["COMMAND", "RESPONSE", "ERROR"],
    "0x45": ["COMMAND", "RESPONSE", "ERROR"], "0x46": ["COMMAND", "RESPONSE", "ERROR"],
    "0x47": ["COMMAND", "RESPONSE", "ERROR"], "0x48": ["COMMAND", "RESPONSE", "ERROR"],
    "0x49": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x4A": ["COMMAND", "RESPONSE", "ERROR"],
    "0x4B": ["COMMAND", "RESPONSE", "ERROR"], "0x4C": ["COMMAND", "RESPONSE", "ERROR"],
    "0x4D": ["COMMAND", "RESPONSE", "ERROR"], "0x4E": ["COMMAND", "RESPONSE", "ERROR"],
    "0x4F": ["COMMAND", "RESPONSE", "ERROR"], "0x59": ["COMMAND", "RESPONSE", "ERROR"],
    "0x5A": ["COMMAND", "RESPONSE", "ERROR"], "0x5B": ["COMMAND", "RESPONSE", "ERROR"],
    "0x5C": ["COMMAND", "RESPONSE", "ERROR"], "0x5E": ["COMMAND", "RESPONSE", "ERROR"],
    "0x5F": ["COMMAND", "RESPONSE", "ERROR"], "0x66": ["COMMAND", "RESPONSE", "ERROR"],
    "0x67": ["COMMAND", "RESPONSE", "ERROR"], "0x57": ["COMMAND", "RESPONSE", "ERROR"],
    "0x58": ["COMMAND", "RESPONSE", "ERROR"], "0x60": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"],
    "0x61": ["COMMAND", "RESPONSE", "ERROR"], "0x30": ["COMMAND", "RESPONSE", "ERROR"],
    "0x31": ["COMMAND", "RESPONSE", "ERROR"], "0x32": ["COMMAND", "RESPONSE", "ERROR"],
    "0x33": ["COMMAND", "RESPONSE", "ERROR"], "0x34": ["COMMAND", "RESPONSE", "ERROR"],
    "0x35": ["COMMAND", "RESPONSE", "ERROR"], "0x36": ["COMMAND", "RESPONSE", "ERROR"],
    "0x37": ["COMMAND", "RESPONSE", "ERROR"], "0x38": ["COMMAND", "RESPONSE", "ERROR"],
    "0x62": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x63": ["COMMAND", "RESPONSE", "ERROR"],
    "0x64": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x65": ["COMMAND", "RESPONSE", "ERROR"],
    "0x68": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x69": ["COMMAND", "RESPONSE", "ERROR"],
    "0x70": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"], "0x71": ["COMMAND", "RESPONSE", "ERROR"],
    "0x72": ["COMMAND", "RESPONSE", "ERROR"], "0x73": ["COMMAND", "RESPONSE", "ERROR"],
    "0x7C": ["COMMAND", "RESPONSE", "ERROR"], "0x7D": ["COMMAND", "RESPONSE", "ERROR"],
    "0x7E": ["COMMAND", "RESPONSE", "ERROR"], "0x7F": ["COMMAND", "RESPONSE", "ERROR"],
    "0x5D": ["COMMAND", "RESPONSE", "ERROR"], "0x20": ["COMMAND", "RESPONSE", "ERROR", "NOTIFICATION"],
    "0x21": ["COMMAND", "RESPONSE", "ERROR"]
};

const errorPayloadDef = [
    { id: 'error_code', name: 'Error Code', type: 'enum', values: { 'NOT_SUPPORTED': 0x00, 'INVALID_PARAM': 0x01, 'INVALID_STATE': 0x02 } }
];

const commandDefs = {
    '0x00': { name: '0x00 Get Device Type', payloads: {'COMMAND': [],'RESPONSE': [{ id: 'device_type', name: 'Device Type', type: 'enum', values: { 'VERIO_100': 0x00, 'VERIO_200': 0x01, 'VERIO_300': 0x02, 'AVENTHO_300': 0x03 } }],'ERROR': errorPayloadDef}},
    '0x06': { name: '0x06 Get Battery Level', payloads: {'COMMAND': [],'RESPONSE': [ { id: 'level_left', name: 'Left Earbud Level (0-100, 0xFF=offline)', type: 'uint8', defaultValue: 100 },{ id: 'level_right', name: 'Right Earbud Level (0-100, 0xFF=offline)', type: 'uint8', defaultValue: 100 },{ id: 'level_case', name: 'Case Level (0-100, 0xFF=offline)', type: 'uint8', defaultValue: 100 }],'NOTIFICATION': 'same_as_response','ERROR': errorPayloadDef}},
    '0x08': { name: '0x08 Set Bluetooth Led Configurations', payloads: {'COMMAND': [{ id: 'led_config', name: 'Bluetooth LED', type: 'enum', values: { 'On': 0x00, 'Off': 0x01 } }],'RESPONSE': 'same_as_command','ERROR': errorPayloadDef}},
    '0x19': { name: '0x19 Get Device MAC Address', payload: [] }, '0x02': { name: '0x02 Get Serial Number', payload: [] },
    '0x03': { name: '0x03 Get Feature Version', payload: [] }, '0x07': { name: '0x07 Get Bluetooth Led Configurations', payload: [] },
    '0x09': { name: '0x09 Get LE Configurations', payload: [] }, '0x14': { name: '0x14 Get Firmware Version', payload: [] },
    '0x15': { name: '0x15 Get Earbuds Color', payload: [] }, '0x17': { name: '0x17 Get Peripheral States', payload: [] },
    '0x41': { name: '0x41 Get Remaining Battery Time', payload: [] }, '0x44': { name: '0x44 Get Equalizer Mode', payload: [] },
    '0x46': { name: '0x46 Get User Equalizer Configuration', payload: [] }, '0x49': { name: '0x49 Play Status', payload: [] },
    '0x4A': { name: '0x4A Get Device Name', payload: [] }, '0x4C': { name: '0x4C Get Auto Shutdown Time', payload: [] },
    '0x4E': { name: '0x4E Get Selected Voice Assistant Mode', payload: [] }, '0x59': { name: '0x59 Get Custom Keys', payload: [] },
    '0x5B': { name: '0x5B Get Prompt Language', payload: [] }, '0x5E': { name: '0x5E Get Prompt Sound State', payload: [] },
    '0x66': { name: '0x66 Get Enabled Voice Prompts', payload: [{ id: 'batch_index', name: 'Batch Index', type: 'uint8' }] },
    '0x57': { name: '0x57 Get Voice Prompts Volume Level', payload: [] }, '0x60': { name: '0x60 Get ANC Mode', payload: [] },
    '0x30': { name: '0x30 Get Non-Adaptive ANC Level', payload: [] }, '0x32': { name: '0x32 Get ANC Transparency Gain', payload: [] },
    '0x34': { name: '0x34 Get ANC Wind Noise Detection Mode', payload: [] }, '0x36': { name: '0x36 Get Adaptive ANC Level', payload: [] },
    '0x37': { name: '0x37 Get ANC On Mode', payload: [] }, '0x62': { name: '0x62 Get Low Latency Mode', payload: [] },
    '0x64': { name: '0x64 Get Wearing Detection Configuration', payload: [] }, '0x68': { name: '0x68 Get LED Brightness', payload: [] },
    '0x70': { name: '0x70 Get Sidetone Mode', payload: [] }, '0x72': { name: '0x72 Get Sidetone Gain', payload: [] },
    '0x7C': { name: '0x7C Get Dolby Atmos Config', payload: [] }, '0x7E': { name: '0x7E Get Audio Codecs Configurations', payload: [] },
    '0x20': { name: '0x20 Get Usage Statistics', payload: [] },
    '0x01': { name: '0x01 Register Notification Listeners', payload: [{ id: 'feature', name: 'Feature ID', type: 'uint8', value: 0x11, readonly: true }] },
    '0x5D': { name: '0x5D Factory Reset', payload: [] }, '0x21': { name: '0x21 Reset Usage Statistics', payload: [] },
    '0x0A': { name: '0x0A Set LE Configurations', type: 'bitmask', payload: [ { id: 'google_fast_pair', name: 'Google Fast Pair', type: 'bool', bit: 0 },{ id: 'le_audio', name: 'LE Audio', type: 'bool', bit: 1 }]},
    '0x16': { name: '0x16 Set Earbuds Color', payload: [{ id: 'color', name: 'Color', type: 'enum', values: { 'Color1': 0x00, 'Color2': 0x01, 'Color3': 0x02, 'Color4': 0x03 } }] },
    '0x45': { name: '0x45 Set Equalizer Mode', payload: [{ id: 'eq_mode', name: 'Equalizer Mode', type: 'enum', values: { 'Off': 0x00, 'Rock': 0x01, 'Jazz': 0x02, 'Classical': 0x03, 'Pop': 0x04, 'User': 0x05, 'Bass Boost': 0x06, 'Smooth Treble': 0x07, 'Loudness': 0x08, 'Neutral': 0x09, 'Speech': 0x0A, 'Shooting': 0x0B, 'Battle Royal': 0x0C, 'Adventure': 0x0D, 'Racing': 0x0E, 'Strategy': 0x0F } }] },
    '0x47': { name: '0x47 Set User Equalizer Configuration', payload: [ { id: 'band1', name: 'Band 1 Gain (-12 to 12)', type: 'sint8' },{ id: 'band2', name: 'Band 2 Gain (-12 to 12)', type: 'sint8' },{ id: 'band3', name: 'Band 3 Gain (-12 to 12)', type: 'sint8' },{ id: 'band4', name: 'Band 4 Gain (-12 to 12)', type: 'sint8' },{ id: 'band5', name: 'Band 5 Gain (-12 to 12)', type: 'sint8' }]},
    '0x48': { name: '0x48 Trigger Media Button', payload: [{ id: 'media_button', name: 'Media Button', type: 'enum', values: { 'PLAY_PAUSE': 0x00, 'PREVIOUS_SONG': 0x01, 'NEXT_SONG': 0x02 } }] },
    '0x4B': { name: '0x4B Set Device Name', payload: [{ id: 'device_name', name: 'Device Name (max 31 chars)', type: 'string', maxLength: 31 }] },
    '0x4D': { name: '0x4D Set Auto Shutdown Time', payload: [{ id: 'shutdown_time', name: 'Shutdown Time (minutes, 0-360)', type: 'uint16' }] },
    '0x4F': { name: '0x4F Set Selected Voice Assistant Mode', payload: [{ id: 'va_mode', name: 'Voice Assistant', type: 'enum', values: { 'DEFAULT': 0x00, 'NONE': 0x01 } }] },
    '0x5A': { name: '0x5A Set Custom Keys', type: 'nibble_array', payload: [ { id: 'l_single', name: 'Left Single Tap', type: 'enum_nibble', values: { 'PLAY_PAUSE': 0x0, 'NONE': 0x1 } },{ id: 'l_long', name: 'Left Long Press', type: 'enum_nibble', values: { 'VOICE_ASSISTANT': 0x0, 'NONE': 0x1, 'VOLUME_UP': 0x2, 'VOLUME_DOWN': 0x3 } },{ id: 'l_double', name: 'Left Double Tap', type: 'enum_nibble', values: { 'NEXT_SONG': 0x0, 'PLAY_PAUSE': 0x1, 'PREVIOUS_SONG': 0x2, 'NONE': 0x3, 'VOICE_ASSISTANT': 0x4, 'SWITCH_ANC_MODE': 0x5 } },{ id: 'l_triple', name: 'Left Triple Tap', type: 'enum_nibble', values: { 'PREVIOUS_SONG': 0x0, 'PLAY_PAUSE': 0x1, 'NEXT_SONG': 0x2, 'NONE': 0x3, 'VOICE_ASSISTANT': 0x4, 'SWITCH_ANC_MODE': 0x5 } },{ id: 'r_single', name: 'Right Single Tap', type: 'enum_nibble', values: { 'PLAY_PAUSE': 0x0, 'NONE': 0x1 } },{ id: 'r_long', name: 'Right Long Press', type: 'enum_nibble', values: { 'VOICE_ASSISTANT': 0x0, 'NONE': 0x1, 'VOLUME_UP': 0x2, 'VOLUME_DOWN': 0x3 } },{ id: 'r_double', name: 'Right Double Tap', type: 'enum_nibble', values: { 'NEXT_SONG': 0x0, 'PLAY_PAUSE': 0x1, 'PREVIOUS_SONG': 0x2, 'NONE': 0x3, 'VOICE_ASSISTANT': 0x4, 'SWITCH_ANC_MODE': 0x5 } },{ id: 'r_triple', name: 'Right Triple Tap', type: 'enum_nibble', values: { 'PREVIOUS_SONG': 0x0, 'PLAY_PAUSE': 0x1, 'NEXT_SONG': 0x2, 'NONE': 0x3, 'VOICE_ASSISTANT': 0x4, 'SWITCH_ANC_MODE': 0x5 } }]},
    '0x5C': { name: '0x5C Set Prompt Language', payload: [{ id: 'prompt_lang', name: 'Prompt Language', type: 'enum', values: { 'CHINESE': 0x01, 'ENGLISH': 0x02, 'GERMAN': 0x03 } }] },
    '0x5F': { name: '0x5F Set Prompt Sound State', payload: [{ id: 'prompt_state', name: 'Prompt Sound', type: 'enum', values: { 'ON': 0x00, 'OFF': 0x01 } }] },
    '0x67': { name: '0x67 Set Enabled Voice Prompts', type: 'bitfield_prompt', payload: [ { id: 'prompt_id', name: 'Prompt Type', type: 'enum', values: { 'POWER_OFF':0,'POWER_ON':1,'BATTERY_LOW':2,'ANC_ON':3,'PASS_THROUGH':4,'ANC_OFF':5,'PAIRING':6,'CONNECTED':7,'VOLUME_UP_MAX':8,'VOLUME_DOWN_MIN':9,'RINGTONE':10,'SINGLE_TAP':11,'DOUBLE_TAP':12,'TRIPLE_TAP':13,'EAR_CONNECTED':14,'DOUBLE_PRESS_AND_HOLD':15,'EAR_DISCONNECTED':16,'FOUR_TAP':17 } },{ id: 'prompt_status', name: 'Status', type: 'enum', values: { 'ON': 0, 'OFF': 1 } }]},
    '0x58': { name: '0x58 Set Voice Prompts Volume Level', payload: [{ id: 'volume', name: 'Volume Level', type: 'uint8' }] },
    '0x61': { name: '0x61 Set ANC Mode', payload: [{ id: 'anc_mode', name: 'ANC Mode', type: 'enum', values: { 'OFF': 0x00, 'TRANSPARENCY': 0x01, 'ON': 0x02 } }] },
    '0x31': { name: '0x31 Set Non-Adaptive ANC Level', payload: [{ id: 'anc_level', name: 'ANC Level', type: 'uint8' }] },
    '0x33': { name: '0x33 Set ANC Transparency Gain', payload: [{ id: 'anc_gain', name: 'Transparency Gain', type: 'uint8' }] },
    '0x35': { name: '0x35 Set ANC Wind Noise Detection Mode', payload: [{ id: 'wind_mode', name: 'Wind Noise Detection', type: 'enum', values: { 'OFF': 0, 'ON': 1 } }] },
    '0x38': { name: '0x38 Set ANC On Mode', payload: [{ id: 'anc_on_mode', name: 'ANC On Mode', type: 'enum', values: { 'MODE_1': 0, 'MODE_2': 1 } }] },
    '0x63': { name: '0x63 Set Low Latency Mode', payload: [{ id: 'll_mode', name: 'Low Latency Mode', type: 'enum', values: { 'OFF': 0, 'ON': 1 } }] },
    '0x65': { name: '0x65 Set Wearing Detection Configuration', payload: [{ id: 'wear_detect', name: 'Wearing Detection', type: 'enum', values: { 'OFF': 0, 'ON': 1 } }] },
    '0x69': { name: '0x69 Set LED Brightness', payload: [{ id: 'brightness', name: 'LED Brightness', type: 'uint8' }] },
    '0x71': { name: '0x71 Set Sidetone Mode', payload: [{ id: 'sidetone_mode', name: 'Sidetone Mode', type: 'enum', values: { 'OFF': 0, 'ON': 1 } }] },
    '0x73': { name: '0x73 Set Sidetone Gain', payload: [{ id: 'sidetone_gain', name: 'Sidetone Gain', type: 'uint8' }] },
    '0x7D': { name: '0x7D Set Dolby Atmos Config', payload: [{ id: 'dolby_config', name: 'Dolby Atmos', type: 'enum', values: { 'OFF': 0, 'ON': 1 } }] },
    '0x7F': { name: '0x7F Set Audio Codecs Configurations', type: 'bitmask', payload: [ { id: 'sbc', name: 'SBC', type: 'bool', bit: 0},{ id: 'aac', name: 'AAC', type: 'bool', bit: 1},{ id: 'aptx', name: 'aptX', type: 'bool', bit: 2},{ id: 'aptx_hd', name: 'aptX HD', type: 'bool', bit: 3}]}
};

// --- ASYNC HELPERS ---
function dbRun(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

function dbGet(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// --- MIGRATION LOGIC ---
async function migrate() {
    console.log('Starting migration...');

    // 1. Schema setup
    await dbRun(`ALTER TABLE commands ADD COLUMN hex_id TEXT`).catch(err => {
        if (!err.message.includes('duplicate column name')) console.error('Failed to alter commands table:', err.message);
    });
    console.log("Column 'hex_id' ensured in 'commands' table.");

    await dbRun(`CREATE TABLE IF NOT EXISTS packet_types (id INTEGER PRIMARY KEY AUTOINCREMENT, command_id INTEGER NOT NULL, name TEXT NOT NULL, FOREIGN KEY (command_id) REFERENCES commands (id) ON DELETE CASCADE)`);
    await dbRun(`CREATE TABLE IF NOT EXISTS payload_fields (id INTEGER PRIMARY KEY AUTOINCREMENT, packet_type_id INTEGER NOT NULL, field_name TEXT NOT NULL, display_name TEXT NOT NULL, type TEXT NOT NULL, default_value TEXT, is_readonly BOOLEAN DEFAULT 0, bit_position INTEGER, max_length INTEGER, display_order INTEGER, FOREIGN KEY (packet_type_id) REFERENCES packet_types (id) ON DELETE CASCADE)`);
    await dbRun(`CREATE TABLE IF NOT EXISTS enum_values (id INTEGER PRIMARY KEY AUTOINCREMENT, field_id INTEGER NOT NULL, name TEXT NOT NULL, value TEXT NOT NULL, display_order INTEGER, FOREIGN KEY (field_id) REFERENCES payload_fields (id) ON DELETE CASCADE)`);
    console.log("New tables created or already exist.");

    // Clear existing data to prevent duplicates on re-run
    await dbRun(`DELETE FROM enum_values`);
    await dbRun(`DELETE FROM payload_fields`);
    await dbRun(`DELETE FROM packet_types`);
    console.log("Cleared existing command structure data.");

    // 2. Data migration
    for (const [hexId, commandDef] of Object.entries(commandDefs)) {
        const command = await dbGet(`SELECT id FROM commands WHERE name_en = ?`, [commandDef.name]);
        if (!command) {
            console.warn(`Command "${commandDef.name}" not found in DB. Skipping.`);
            continue;
        }
        const commandId = command.id;

        await dbRun(`UPDATE commands SET hex_id = ? WHERE id = ?`, [hexId, commandId]);

        const packetTypeNames = commandPacketTypes[hexId] || [];
        for (const packetTypeName of packetTypeNames) {
            const packetTypeResult = await dbRun(`INSERT INTO packet_types (command_id, name) VALUES (?, ?)`, [commandId, packetTypeName]);
            const packetTypeId = packetTypeResult.lastID;

            let payloadDef;
            if (commandDef.payloads) {
                const def = commandDef.payloads[packetTypeName.toUpperCase()];
                if (def === 'same_as_response') payloadDef = commandDef.payloads['RESPONSE'];
                else if (def === 'same_as_command') payloadDef = commandDef.payloads['COMMAND'];
                else payloadDef = def;
            } else if (packetTypeName.toUpperCase() === 'COMMAND' && commandDef.payload) {
                payloadDef = commandDef.payload;
            } else if (packetTypeName.toUpperCase() === 'ERROR' && !commandDef.payloads) {
                 payloadDef = errorPayloadDef;
            }

            if (!payloadDef || payloadDef.length === 0) continue;

            for (const [index, field] of payloadDef.entries()) {
                const fieldResult = await dbRun(`INSERT INTO payload_fields (packet_type_id, field_name, display_name, type, default_value, is_readonly, bit_position, max_length, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [packetTypeId, field.id, field.name, commandDef.type || field.type, field.defaultValue, field.readonly ? 1 : 0, field.bit, field.maxLength, index]
                );
                const fieldId = fieldResult.lastID;

                if ((field.type === 'enum' || field.type === 'enum_nibble') && field.values) {
                    for (const [enumIndex, [enumName, enumValue]] of Object.entries(field.values).entries()) {
                        await dbRun(`INSERT INTO enum_values (field_id, name, value, display_order) VALUES (?, ?, ?, ?)`, [fieldId, enumName, enumValue, enumIndex]);
                    }
                }
            }
        }
    }
    console.log('Data migration completed successfully.');
}

// Execute migration
db.serialize(() => {
    migrate().catch(console.error).finally(() => db.close(() => console.log('Database connection closed.')));
});
