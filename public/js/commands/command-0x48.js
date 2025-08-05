/**
 * Command 0x48 - Trigger Media Button
 * Handles media button trigger commands and responses
 */
class Command48 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (trigger button)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'mediaButton',
                    name: 'Media Button',
                    options: [
                        { value: '0x00', label: 'PLAY_PAUSE' },
                        { value: '0x01', label: 'NEXT_TRACK' },
                        { value: '0x02', label: 'PREVIOUS_TRACK' },
                        { value: '0x03', label: 'VOLUME_UP' },
                        { value: '0x04', label: 'VOLUME_DOWN' },
                        { value: '0x05', label: 'STOP' },
                        { value: '0x06', label: 'FAST_FORWARD' },
                        { value: '0x07', label: 'REWIND' },
                        { value: '0x08', label: 'MUTE' },
                        { value: '0x09', label: 'VOICE_ASSISTANT' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'pressDuration',
                    name: 'Press Duration',
                    type: 'number',
                    min: 0,
                    max: 65535,
                    defaultValue: 100,
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
                        { value: '0x02', label: 'INVALID_BUTTON' },
                        { value: '0x03', label: 'NOT_CONNECTED' }
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
        console.log('Command48 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command48 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x48`;
            const groupId = `field-group-${field.id}-0x48`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Media Button') fieldName = '媒体按钮';
                else if (fieldName === 'Press Duration') fieldName = '按压持续时间';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                const unit = isZh ? '毫秒 (0-65535)' : 'milliseconds (0-65535)';
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (ms):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 0}"
                               max="${field.max || 65535}"
                               value="${field.defaultValue || 0}"
                               style="width: 100px;">
                        <span>${unit}</span>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    // Localize media button labels
                    if (isZh) {
                        const buttonTranslations = {
                            'PLAY_PAUSE': 'PLAY_PAUSE (播放/暂停)',
                            'NEXT_TRACK': 'NEXT_TRACK (下一曲)',
                            'PREVIOUS_TRACK': 'PREVIOUS_TRACK (上一曲)',
                            'VOLUME_UP': 'VOLUME_UP (音量+)',
                            'VOLUME_DOWN': 'VOLUME_DOWN (音量-)',
                            'STOP': 'STOP (停止)',
                            'FAST_FORWARD': 'FAST_FORWARD (快进)',
                            'REWIND': 'REWIND (快退)',
                            'MUTE': 'MUTE (静音)',
                            'VOICE_ASSISTANT': 'VOICE_ASSISTANT (语音助手)'
                        };
                        // Status translations
                        const statusTranslations = {
                            'SUCCESS': 'SUCCESS (成功)',
                            'FAILED': 'FAILED (失败)',
                            'INVALID_BUTTON': 'INVALID_BUTTON (按钮无效)',
                            'NOT_CONNECTED': 'NOT_CONNECTED (未连接)'
                        };
                        label = buttonTranslations[label] || statusTranslations[label] || label;
                    }
                    return `<option value="${option.value}">${label}</option>`;
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
        // Set packet type to COMMAND by default (this is a trigger command)
        const packetTypeField = document.getElementById('field-packetType-0x48');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x48`;
                const targetGroupId = `field-group-${field.id}-0x48`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x48`;
                const targetGroupId = `field-group-${field.id}-0x48`;

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
            const fieldId = `field-${field.id}-0x48`;
            this.addListener(fieldId, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: media button + press duration
            const mediaButtonElement = document.getElementById('field-mediaButton-0x48');
            const pressDurationElement = document.getElementById('field-pressDuration-0x48');

            if (!mediaButtonElement || !pressDurationElement) return [];

            const button = parseInt(mediaButtonElement.value, 16);
            const duration = parseInt(pressDurationElement.value) || 100;

            // 按钮ID (1字节) + 持续时间 (2字节，小端序)
            return [
                button,
                duration & 0xFF,        // 低字节
                (duration >> 8) & 0xFF  // 高字节
            ];
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x48');
            if (!executionStatusElement) return [];
            const status = parseInt(executionStatusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x48');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command48 = Command48;
