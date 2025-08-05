/**
 * Command 0x5D - Factory Reset
 * Handles factory reset commands and responses
 */
class Command5D extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (execute reset)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'confirmReset',
                    name: 'Confirm Factory Reset',
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
                        { value: '0x02', label: 'NOT_CONFIRMED' }
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
        console.log('Command5D render called');
        if (!this.config) this.config = this.getDefaultConfig();

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x5D`;
            const groupId = `field-group-${field.id}-0x5D`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Confirm Factory Reset') fieldName = '确认恢复出厂设置';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            if (field.type === 'checkbox') {
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label>
                            <input type="checkbox" id="${fieldId}" class="payload-input"
                                   ${field.defaultValue ? 'checked' : ''}>
                            ${fieldName}
                        </label>
                        <small style="color: red;">${isZh ? '⚠️ 此操作将清除所有设备设置！' : '⚠️ This will erase all device settings!'}</small>
                    </div>
                `;
            } else {
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    if (isZh) {
                        if (label === 'SUCCESS') label = 'SUCCESS (成功)';
                        else if (label === 'FAILED') label = 'FAILED (失败)';
                        else if (label === 'NOT_CONFIRMED') label = 'NOT_CONFIRMED (未确认)';
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
            }
        }).join('');

        container.innerHTML = `<div class="dynamic-fields">${fieldsHtml}</div>`;
        setTimeout(() => this.setDefaultValues(), 0);
        this.attachListeners();
    }

    setDefaultValues() {
        const packetTypeField = document.getElementById('field-packetType-0x5D');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x5D`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x5D`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x5D`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            const fieldId = `field-${field.id}-0x5D`;
            this.addListener(fieldId, field.type === 'checkbox' ? 'change' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const confirmElement = document.getElementById('field-confirmReset-0x5D');
            return confirmElement && confirmElement.checked ? [0x01] : [];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x5D');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x5D');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command5D = Command5D;