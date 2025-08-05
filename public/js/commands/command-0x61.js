/**
 * Command 0x61 - Set ANC Mode
 * Handles setting ANC mode
 */
class Command61 extends BaseCommand {
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
                    id: 'ancMode',
                    name: 'ANC Mode',
                    options: [
                        { value: '0x00', label: 'OFF' },
                        { value: '0x01', label: 'ANC_ON' },
                        { value: '0x02', label: 'TRANSPARENCY' },
                        { value: '0x03', label: 'ADAPTIVE_ANC' },
                        { value: '0x04', label: 'WIND_NOISE_REDUCTION' }
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
            const fieldId = `field-${field.id}-0x61`;
            const groupId = `field-group-${field.id}-0x61`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'ANC Mode') fieldName = 'ANC模式';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    const ancModeTranslations = {
                        'OFF': 'OFF (关闭)',
                        'ANC_ON': 'ANC_ON (主动降噪)',
                        'TRANSPARENCY': 'TRANSPARENCY (透明模式)',
                        'ADAPTIVE_ANC': 'ADAPTIVE_ANC (自适应降噪)',
                        'WIND_NOISE_REDUCTION': 'WIND_NOISE_REDUCTION (风噪抑制)'
                    };
                    const statusTranslations = {
                        'SUCCESS': 'SUCCESS (成功)',
                        'FAILED': 'FAILED (失败)',
                        'UNSUPPORTED_MODE': 'UNSUPPORTED_MODE (不支持的模式)'
                    };
                    label = ancModeTranslations[label] || statusTranslations[label] || label;
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
            const packetTypeField = document.getElementById('field-packetType-0x61');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x61`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x61`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x61`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x61`, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const ancModeElement = document.getElementById('field-ancMode-0x61');
            return ancModeElement ? [parseInt(ancModeElement.value, 16)] : [];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x61');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x61');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command61 = Command61;