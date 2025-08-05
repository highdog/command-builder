/**
 * Command 0x5B - Get Prompt Language
 * Handles prompt language queries and responses
 */
class Command5B extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get language)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'promptLanguage',
                    name: 'Prompt Language',
                    options: [
                        { value: '0x00', label: 'English' },
                        { value: '0x01', label: 'Chinese (Simplified)' },
                        { value: '0x02', label: 'Chinese (Traditional)' },
                        { value: '0x03', label: 'Japanese' },
                        { value: '0x04', label: 'Korean' },
                        { value: '0x05', label: 'German' },
                        { value: '0x06', label: 'French' },
                        { value: '0x07', label: 'Spanish' },
                        { value: '0x08', label: 'Italian' },
                        { value: '0x09', label: 'Portuguese' },
                        { value: '0x0A', label: 'Russian' },
                        { value: '0x0B', label: 'Dutch' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command5B render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command5B render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x5B`;
            const groupId = `field-group-${field.id}-0x5B`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Prompt Language') fieldName = '提示语言';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    const languageTranslations = {
                        'English': '英语',
                        'Chinese (Simplified)': '中文 (简体)',
                        'Chinese (Traditional)': '中文 (繁体)',
                        'Japanese': '日语',
                        'Korean': '韩语',
                        'German': '德语',
                        'French': '法语',
                        'Spanish': '西班牙语',
                        'Italian': '意大利语',
                        'Portuguese': '葡萄牙语',
                        'Russian': '俄语',
                        'Dutch': '荷兰语'
                    };
                    label = languageTranslations[label] || label;
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            return `
                <div class="form-group" id="${groupId}" ${initialStyle}>
                    <label for="${fieldId}">${fieldName}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        }).join('');

        const html = `<div class="dynamic-fields">
                ${fieldsHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        // Use setTimeout to ensure DOM is fully rendered before setting defaults
        setTimeout(() => {
            this.setDefaultValues();
        }, 0);

        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x5B');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x5B`;
                const targetGroupId = `field-group-${field.id}-0x5B`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    if (triggerElement.value === field.showWhen.value) {
                        targetGroup.style.display = 'block';
                    } else {
                        targetGroup.style.display = 'none';
                    }
                }
            }
        });
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x5B`;
                const targetGroupId = `field-group-${field.id}-0x5B`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        if (e.target.value === field.showWhen.value) {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x5B`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - empty payload

        // RESPONSE - return prompt language
        const promptLanguageElement = document.getElementById('field-promptLanguage-0x5B');
        if (!promptLanguageElement) return [];

        const language = parseInt(promptLanguageElement.value, 16);
        return [language];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x5B');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command5B = Command5B;