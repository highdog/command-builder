/**
 * Command 0x4A - Get Device Name
 * Handles device name queries and responses
 */
class Command4A extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get name)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'deviceName',
                    name: 'Device Name',
                    type: 'text',
                    maxLength: 64,
                    defaultValue: 'AVENTHO 300',
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
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
                        value: '2'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command4A render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command4A render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x4A`;
            const groupId = `field-group-${field.id}-0x4A`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Device Name') fieldName = '设备名称';
                else if (fieldName === 'Encoding Format') fieldName = '编码格式';
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
                const optionsHtml = field.options.map(option =>
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');

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
        const packetTypeField = document.getElementById('field-packetType-0x4A');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4A`;
                const targetGroupId = `field-group-${field.id}-0x4A`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4A`;
                const targetGroupId = `field-group-${field.id}-0x4A`;

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
            const fieldId = `field-${field.id}-0x4A`;
            this.addListener(fieldId, field.type === 'text' ? 'input' : 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - empty payload

        // RESPONSE - return device name
        const deviceNameElement = document.getElementById('field-deviceName-0x4A');
        const nameEncodingElement = document.getElementById('field-nameEncoding-0x4A');

        if (!deviceNameElement || !nameEncodingElement) return [];

        const deviceName = deviceNameElement.value;
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
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x4A');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command4A = Command4A;
