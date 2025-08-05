/**
 * Command 0x57 - Get Voice Prompts Volume Level
 * Handles voice prompts volume level queries and responses
 */
class Command57 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get volume)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'voiceVolume',
                    name: 'Voice Prompt Volume',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 70,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                },
                {
                    id: 'voiceMuted',
                    name: 'Voice Prompt Muted',
                    type: 'checkbox',
                    defaultValue: false,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                },
                {
                    id: 'volumeMode',
                    name: 'Volume Mode',
                    options: [
                        { value: '0', label: 'ABSOLUTE' },
                        { value: '1', label: 'RELATIVE' },
                        { value: '2', label: 'ADAPTIVE' }
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
        console.log('Command57 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command57 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x57`;
            const groupId = `field-group-${field.id}-0x57`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Voice Prompt Volume') fieldName = '语音提示音量';
                else if (fieldName === 'Voice Prompt Muted') fieldName = '语音提示静音';
                else if (fieldName === 'Volume Mode') fieldName = '音量模式';
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 0}"
                               max="${field.max || 100}"
                               value="${field.defaultValue || 0}"
                               style="width: 80px;">
                        <span>%</span>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                // Checkbox field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label>
                            <input type="checkbox" id="${fieldId}" class="payload-input"
                                   ${field.defaultValue ? 'checked' : ''}>
                            ${fieldName}
                        </label>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    // Localize volume mode labels
                    if (isZh) {
                        const volumeModeTranslations = {
                            'ABSOLUTE': 'ABSOLUTE (绝对音量)',
                            'RELATIVE': 'RELATIVE (相对音量)',
                            'ADAPTIVE': 'ADAPTIVE (自适应音量)'
                        };
                        label = volumeModeTranslations[label] || label;
                    }
                    // Set default selection for RELATIVE
                    const selected = (field.id === 'volumeMode' && option.value === '1') ? 'selected' : '';
                    return `<option value="${option.value}" ${selected}>${label}</option>`;
                }).join('');

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName}:</label>
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

        // Use setTimeout to ensure DOM is fully rendered before setting defaults
        setTimeout(() => {
            this.setDefaultValues();
        }, 0);

        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x57');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x57`;
                const targetGroupId = `field-group-${field.id}-0x57`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x57`;
                const targetGroupId = `field-group-${field.id}-0x57`;

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
            const fieldId = `field-${field.id}-0x57`;
            const eventType = field.type === 'number' ? 'input' :
                             field.type === 'checkbox' ? 'change' : 'change';
            this.addListener(fieldId, eventType);
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - empty payload

        // RESPONSE - return voice prompt volume information
        const voiceVolumeElement = document.getElementById('field-voiceVolume-0x57');
        const voiceMutedElement = document.getElementById('field-voiceMuted-0x57');
        const volumeModeElement = document.getElementById('field-volumeMode-0x57');

        const voiceVolume = voiceVolumeElement ? parseInt(voiceVolumeElement.value) || 0 : 0;
        const voiceMuted = voiceMutedElement ? voiceMutedElement.checked : false;
        const volumeMode = volumeModeElement ? parseInt(volumeModeElement.value) : 0;

        // 构建状态标志字节
        let statusFlags = 0x00;
        if (voiceMuted) statusFlags |= 0x01;

        return [
            voiceVolume,    // 音量等级 (1字节, 0-100)
            volumeMode,     // 音量模式 (1字节)
            statusFlags     // 状态标志 (1字节)
        ];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x57');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command57 = Command57;
