/**
 * Command 0x4F - Set Selected Voice Assistant Mode
 * Handles setting voice assistant mode
 */
class Command4F extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set assistant)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'assistantType',
                    name: 'Voice Assistant Type',
                    options: [
                        { value: '0x00', label: 'DISABLED' },
                        { value: '0x01', label: 'SIRI' },
                        { value: '0x02', label: 'GOOGLE_ASSISTANT' },
                        { value: '0x03', label: 'ALEXA' },
                        { value: '0x04', label: 'BIXBY' },
                        { value: '0x05', label: 'CORTANA' },
                        { value: '0xFF', label: 'CUSTOM' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'wakeWordEnabled',
                    name: 'Wake Word Enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'pushToTalk',
                    name: 'Push to Talk Mode',
                    type: 'checkbox',
                    defaultValue: false,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'sensitivity',
                    name: 'Voice Recognition Sensitivity',
                    type: 'number',
                    min: 1,
                    max: 10,
                    defaultValue: 5,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'languageCode',
                    name: 'Language Code',
                    options: [
                        { value: '0x00', label: 'English (US)' },
                        { value: '0x01', label: 'English (UK)' },
                        { value: '0x02', label: 'Chinese (Simplified)' },
                        { value: '0x03', label: 'Chinese (Traditional)' },
                        { value: '0x04', label: 'Japanese' },
                        { value: '0x05', label: 'Korean' },
                        { value: '0x06', label: 'German' },
                        { value: '0x07', label: 'French' },
                        { value: '0x08', label: 'Spanish' },
                        { value: '0x09', label: 'Italian' }
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
                        { value: '0x02', label: 'UNSUPPORTED_ASSISTANT' },
                        { value: '0x03', label: 'INVALID_CONFIGURATION' }
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
        console.log('Command4F render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command4F render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration (similar to 0x4E but with status field)
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x4F`;
            const groupId = `field-group-${field.id}-0x4F`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                const translations = {
                    'Voice Assistant Type': '语音助手类型',
                    'Wake Word Enabled': '唤醒词启用',
                    'Push to Talk Mode': '按键通话模式',
                    'Voice Recognition Sensitivity': '语音识别灵敏度',
                    'Language Code': '语言代码',
                    'Execution Status': '执行状态'
                };
                fieldName = translations[fieldName] || fieldName;
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 1}"
                               max="${field.max || 10}"
                               value="${field.defaultValue || 5}"
                               style="width: 80px;">
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
                        const assistantTranslations = {
                            'DISABLED': 'DISABLED (禁用)',
                            'SIRI': 'SIRI (苹果Siri)',
                            'GOOGLE_ASSISTANT': 'GOOGLE_ASSISTANT (谷歌助手)',
                            'ALEXA': 'ALEXA (亚马逊Alexa)',
                            'BIXBY': 'BIXBY (三星Bixby)',
                            'CORTANA': 'CORTANA (微软Cortana)',
                            'CUSTOM': 'CUSTOM (自定义)'
                        };
                        const languageTranslations = {
                            'English (US)': '英语 (美国)',
                            'English (UK)': '英语 (英国)',
                            'Chinese (Simplified)': '中文 (简体)',
                            'Chinese (Traditional)': '中文 (繁体)',
                            'Japanese': '日语',
                            'Korean': '韩语',
                            'German': '德语',
                            'French': '法语',
                            'Spanish': '西班牙语',
                            'Italian': '意大利语'
                        };
                        const statusTranslations = {
                            'SUCCESS': 'SUCCESS (成功)',
                            'FAILED': 'FAILED (失败)',
                            'UNSUPPORTED_ASSISTANT': 'UNSUPPORTED_ASSISTANT (不支持的助手)',
                            'INVALID_CONFIGURATION': 'INVALID_CONFIGURATION (配置无效)'
                        };
                        label = assistantTranslations[label] || languageTranslations[label] || statusTranslations[label] || label;
                    }
                    // Set default selection for GOOGLE_ASSISTANT
                    const selected = (field.id === 'assistantType' && option.value === '0x02') ? 'selected' : '';
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
        const packetTypeField = document.getElementById('field-packetType-0x4F');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4F`;
                const targetGroupId = `field-group-${field.id}-0x4F`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4F`;
                const targetGroupId = `field-group-${field.id}-0x4F`;

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
            const fieldId = `field-${field.id}-0x4F`;
            const eventType = field.type === 'number' ? 'input' :
                             field.type === 'checkbox' ? 'change' : 'change';
            this.addListener(fieldId, eventType);
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: voice assistant configuration
            const assistantTypeElement = document.getElementById('field-assistantType-0x4F');
            const wakeWordEnabledElement = document.getElementById('field-wakeWordEnabled-0x4F');
            const pushToTalkElement = document.getElementById('field-pushToTalk-0x4F');
            const sensitivityElement = document.getElementById('field-sensitivity-0x4F');
            const languageCodeElement = document.getElementById('field-languageCode-0x4F');

            const assistantType = assistantTypeElement ? parseInt(assistantTypeElement.value, 16) : 0x00;
            const wakeWordEnabled = wakeWordEnabledElement ? wakeWordEnabledElement.checked : false;
            const pushToTalk = pushToTalkElement ? pushToTalkElement.checked : false;
            const sensitivity = sensitivityElement ? parseInt(sensitivityElement.value) || 5 : 5;
            const languageCode = languageCodeElement ? parseInt(languageCodeElement.value, 16) : 0x00;

            // 构建配置标志字节
            let configFlags = 0x00;
            if (wakeWordEnabled) configFlags |= 0x01;
            if (pushToTalk) configFlags |= 0x02;

            return [
                assistantType,    // 语音助手类型 (1字节)
                configFlags,      // 配置标志 (1字节)
                sensitivity,      // 灵敏度 (1字节)
                languageCode      // 语言代码 (1字节)
            ];
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x4F');
            if (!executionStatusElement) return [];
            const status = parseInt(executionStatusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x4F');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command4F = Command4F;
