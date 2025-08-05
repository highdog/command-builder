/**
 * Command 0x21 - Reset Device Usage Statistics
 * Resets device usage statistics (COMMAND only, empty payload)
 */
class Command21 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    // Get default configuration
    getDefaultConfig() {
        return {
            fields: [
                {
                    id: 'packetType',
                    name: 'Packet Type',
                    options: [
                        { value: '0', label: 'COMMAND (reset statistics)' }
                    ]
                },
                {
                    id: 'description',
                    name: 'Description',
                    type: 'info',
                    content: {
                        en: 'Reset device usage statistics (empty payload)',
                        zh: '重置设备使用统计数据（空载荷）'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command21 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command21 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x21`;
            const groupId = `field-group-${field.id}-0x21`;

            let fieldHtml = '';

            if (field.type === 'info') {
                // Info field - display information only
                const content = isZh ? field.content.zh : field.content.en;
                fieldHtml = `
                    <div class="form-group" id="${groupId}">
                        <div class="info-field">
                            <h5>${field.name}:</h5>
                            <p style="color: #6c757d; font-style: italic;">${content}</p>
                        </div>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option =>
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');

                fieldHtml = `
                    <div class="form-group" id="${groupId}">
                        <label for="${fieldId}">${field.name}:</label>
                        <select id="${fieldId}" class="payload-input">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            }

            return fieldHtml;
        }).join('');

        const html = `<div class="dynamic-fields">
                ${fieldsHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        this.attachListeners();
    }

    attachListeners() {
        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            if (field.type !== 'info') {
                const fieldId = `field-${field.id}-0x21`;
                this.addListener(fieldId, 'change');
            }
        });
    }

    getPayload() {
        // Always empty payload for reset command
        return [];
    }

    getPacketType() {
        // Always COMMAND for reset command
        return 0;
    }
    
}

// Register the command class globally
window.Command21 = Command21;