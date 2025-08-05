/**
 * Command 0x58 - Set Voice Prompts Volume Level
 * Handles setting voice prompts volume level
 */
class Command58 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set volume)' },
                        { value: '2', label: 'RESPONSE (result status)' }
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
                        value: '0'
                    }
                },
                {
                    id: 'voiceMuted',
                    name: 'Voice Prompt Muted',
                    type: 'checkbox',
                    defaultValue: false,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
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
                        value: '0'
                    }
                },
                {
                    id: 'executionStatus',
                    name: 'Execution Status',
                    options: [
                        { value: '0x00', label: 'SUCCESS' },
                        { value: '0x01', label: 'FAILED' },
                        { value: '0x02', label: 'INVALID_VOLUME' },
                        { value: '0x03', label: 'INVALID_MODE' }
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
        console.log('Command58 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command58 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration (similar to 0x57 but with status field)
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x58`;
            const groupId = `field-group-${field.id}-0x58`;

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
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
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
                    // Localize labels
                    if (isZh) {
                        const volumeModeTranslations = {
                            'ABSOLUTE': 'ABSOLUTE (绝对音量)',
                            'RELATIVE': 'RELATIVE (相对音量)',
                            'ADAPTIVE': 'ADAPTIVE (自适应音量)'
                        };
                        const statusTranslations = {
                            'SUCCESS': 'SUCCESS (成功)',
                            'FAILED': 'FAILED (失败)',
                            'INVALID_VOLUME': 'INVALID_VOLUME (音量无效)',
                            'INVALID_MODE': 'INVALID_MODE (模式无效)'
                        };
                        label = volumeModeTranslations[label] || statusTranslations[label] || label;
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
        // Set packet type to COMMAND by default (this is a set command)
        const packetTypeField = document.getElementById('field-packetType-0x58');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x58`;
                const targetGroupId = `field-group-${field.id}-0x58`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x58`;
                const targetGroupId = `field-group-${field.id}-0x58`;

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
            const fieldId = `field-${field.id}-0x58`;
            const eventType = field.type === 'number' ? 'input' :
                             field.type === 'checkbox' ? 'change' : 'change';
            this.addListener(fieldId, eventType);
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: voice volume settings
            const voiceVolumeElement = document.getElementById('field-voiceVolume-0x58');
            const voiceMutedElement = document.getElementById('field-voiceMuted-0x58');
            const volumeModeElement = document.getElementById('field-volumeMode-0x58');

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
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x58');
            if (!executionStatusElement) return [];
            const status = parseInt(executionStatusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x58');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command58 = Command58;
