/**
 * Command 0x4D - Set Auto Shutdown Time
 * Handles setting auto shutdown time
 */
class Command4D extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set time)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'shutdownTime',
                    name: 'Auto Shutdown Time',
                    options: [
                        { value: '0', label: 'DISABLED' },
                        { value: '5', label: '5 minutes' },
                        { value: '10', label: '10 minutes' },
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '120', label: '2 hours' },
                        { value: '180', label: '3 hours' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'customTime',
                    name: 'Custom Time',
                    type: 'number',
                    min: 0,
                    max: 65535,
                    defaultValue: 15,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'useCustom',
                    name: 'Use Custom Time',
                    type: 'checkbox',
                    defaultValue: false,
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
                        { value: '0x02', label: 'INVALID_TIME' },
                        { value: '0x03', label: 'TIME_OUT_OF_RANGE' }
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
        console.log('Command4D render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command4D render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration (similar to 0x4C but with status field)
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x4D`;
            const groupId = `field-group-${field.id}-0x4D`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Auto Shutdown Time') fieldName = '自动关机时间';
                else if (fieldName === 'Custom Time') fieldName = '自定义时间';
                else if (fieldName === 'Use Custom Time') fieldName = '使用自定义时间';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                const helpText = isZh ? '0=禁用，1-65535分钟' : '0=disabled, 1-65535 minutes';
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${isZh ? '分钟' : 'minutes'}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 0}"
                               max="${field.max || 65535}"
                               value="${field.defaultValue || 0}"
                               style="width: 100px;">
                        <small>${helpText}</small>
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
                        const timeTranslations = {
                            'DISABLED': 'DISABLED (禁用)',
                            '5 minutes': '5分钟',
                            '10 minutes': '10分钟',
                            '15 minutes': '15分钟',
                            '30 minutes': '30分钟',
                            '1 hour': '1小时',
                            '2 hours': '2小时',
                            '3 hours': '3小时'
                        };
                        const statusTranslations = {
                            'SUCCESS': 'SUCCESS (成功)',
                            'FAILED': 'FAILED (失败)',
                            'INVALID_TIME': 'INVALID_TIME (时间无效)',
                            'TIME_OUT_OF_RANGE': 'TIME_OUT_OF_RANGE (时间超出范围)'
                        };
                        label = timeTranslations[label] || statusTranslations[label] || label;
                    }
                    // Set default selection for 15 minutes
                    const selected = (field.id === 'shutdownTime' && option.value === '15') ? 'selected' : '';
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
        const packetTypeField = document.getElementById('field-packetType-0x4D');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();

        // Set initial state for custom time checkbox
        this.updateCustomTimeState();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4D`;
                const targetGroupId = `field-group-${field.id}-0x4D`;

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

    updateCustomTimeState() {
        const useCustomElement = document.getElementById('field-useCustom-0x4D');
        const customTimeElement = document.getElementById('field-customTime-0x4D');
        const shutdownTimeElement = document.getElementById('field-shutdownTime-0x4D');

        if (useCustomElement && customTimeElement && shutdownTimeElement) {
            if (useCustomElement.checked) {
                customTimeElement.disabled = false;
                shutdownTimeElement.disabled = true;
            } else {
                customTimeElement.disabled = true;
                shutdownTimeElement.disabled = false;
            }
        }
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x4D`;
                const targetGroupId = `field-group-${field.id}-0x4D`;

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

        // Add special listener for custom time checkbox
        const useCustomElement = document.getElementById('field-useCustom-0x4D');
        if (useCustomElement) {
            useCustomElement.addEventListener('change', (e) => {
                this.updateCustomTimeState();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x4D`;
            const eventType = field.type === 'number' ? 'input' :
                             field.type === 'checkbox' ? 'change' : 'change';
            this.addListener(fieldId, eventType);
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: shutdown time setting
            const useCustomElement = document.getElementById('field-useCustom-0x4D');
            const customTimeElement = document.getElementById('field-customTime-0x4D');
            const shutdownTimeElement = document.getElementById('field-shutdownTime-0x4D');

            let shutdownTime = 0;

            if (useCustomElement && useCustomElement.checked && customTimeElement) {
                shutdownTime = parseInt(customTimeElement.value) || 0;
            } else if (shutdownTimeElement) {
                shutdownTime = parseInt(shutdownTimeElement.value) || 0;
            }

            // 时间以分钟为单位，使用2字节表示 (小端序)
            return [
                shutdownTime & 0xFF,        // 低字节
                (shutdownTime >> 8) & 0xFF  // 高字节
            ];
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x4D');
            if (!executionStatusElement) return [];
            const status = parseInt(executionStatusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x4D');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command4D = Command4D;
