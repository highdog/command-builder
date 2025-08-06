/**
 * Command 0x71 - Set Sidetone Mode
 * Handles setting sidetone mode
 */
class Command71 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set mode)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'sidetoneMode',
                    name: 'Sidetone Mode',
                    options: [
                        { value: '0x00', label: 'OFF' },
                        { value: '0x01', label: 'ON' },
                        { value: '0x02', label: 'AUTO' }
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
                        { value: '0x02', label: 'UNSUPPORTED_MODE' }
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
        if (!this.config) this.config = this.getDefaultConfig();
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x71`;
            const groupId = `field-group-${field.id}-0x71`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Sidetone Mode') fieldName = '侧音模式';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    const sidetoneTranslations = {
                        'OFF': 'OFF (关闭)',
                        'ON': 'ON (开启)',
                        'AUTO': 'AUTO (自动)'
                    };
                    const statusTranslations = {
                        'SUCCESS': 'SUCCESS (成功)',
                        'FAILED': 'FAILED (失败)',
                        'UNSUPPORTED_MODE': 'UNSUPPORTED_MODE (不支持的模式)'
                    };
                    label = sidetoneTranslations[label] || statusTranslations[label] || label;
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

        container.innerHTML = `<div class="dynamic-fields">${fieldsHtml}</div>`;

        setTimeout(() => {
            const packetTypeField = document.getElementById('field-packetType-0x71');
            if (packetTypeField) {
                packetTypeField.value = '0';
                packetTypeField.dispatchEvent(new Event('change'));
            }
            this.updateFieldVisibility();
        }, 0);

        this.attachListeners();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x71`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x71`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x71`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x71`, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const sidetoneElement = document.getElementById('field-sidetoneMode-0x71');
            return sidetoneElement ? [parseInt(sidetoneElement.value, 16)] : [];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x71');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x71');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command71 = Command71;