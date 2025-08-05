/**
 * Command 0x4B - Set Device Name
 * Handles setting device name
 */
class Command4B extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set name)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'newDeviceName',
                    name: 'New Device Name',
                    type: 'text',
                    maxLength: 64,
                    defaultValue: 'My AVENTHO 300',
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'nameEncoding',
                    name: 'Encoding Format',
                    options: [
                        { value: '0', label: 'UTF-8' },
                        { value: '1', label: 'ASCII' },
                        { value: '2', label: 'UTF-16' }
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
                        { value: '0x02', label: 'NAME_TOO_LONG' },
                        { value: '0x03', label: 'INVALID_ENCODING' },
                        { value: '0x04', label: 'INVALID_CHARACTERS' }
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
        console.log('Command4B render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command4B render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x4B`;
            const groupId = `field-group-${field.id}-0x4B`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'New Device Name') fieldName = '新设备名称';
                else if (fieldName === 'Encoding Format') fieldName = '编码格式';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            let fieldHtml = '';

            if (field.type === 'text') {
                // Text input field
                const maxLengthText = isZh ? `最大${field.maxLength}字符` : `Max ${field.maxLength} characters`;
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName}:</label>
                        <input type="text" id="${fieldId}" class="payload-input"
                               maxlength="${field.maxLength || 64}"
                               value="${field.defaultValue || ''}"
                               style="width: 90%;">
                        <small>${maxLengthText}</small>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    // Localize status labels
                    if (isZh) {
                        const statusTranslations = {
                            'SUCCESS': 'SUCCESS (成功)',
                            'FAILED': 'FAILED (失败)',
                            'NAME_TOO_LONG': 'NAME_TOO_LONG (名称过长)',
                            'INVALID_ENCODING': 'INVALID_ENCODING (编码无效)',
                            'INVALID_CHARACTERS': 'INVALID_CHARACTERS (字符无效)'
                        };
                        label = statusTranslations[label] || label;
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
        // Set packet type to COMMAND by default (this is a set command)
        const packetTypeField = document.getElementById('field-packetType-0x4B');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4B`;
                const targetGroupId = `field-group-${field.id}-0x4B`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4B`;
                const targetGroupId = `field-group-${field.id}-0x4B`;

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
            const fieldId = `field-${field.id}-0x4B`;
            this.addListener(fieldId, field.type === 'text' ? 'input' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: new device name + encoding
            const newDeviceNameElement = document.getElementById('field-newDeviceName-0x4B');
            const nameEncodingElement = document.getElementById('field-nameEncoding-0x4B');

            if (!newDeviceNameElement || !nameEncodingElement) return [];

            const deviceName = newDeviceNameElement.value;
            const encoding = parseInt(nameEncodingElement.value);

            const payload = [];

            // 编码格式 (1字节)
            payload.push(encoding);

            // 名称长度 (1字节)
            const nameBytes = this.stringToPaddedBytes(deviceName, deviceName.length);
            payload.push(nameBytes.length);

            // 设备名称 (变长，根据编码格式)
            payload.push(...nameBytes);

            return payload;
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x4B');
            if (!executionStatusElement) return [];
            const status = parseInt(executionStatusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x4B');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command4B = Command4B;
