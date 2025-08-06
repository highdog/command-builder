/**
 * Command 0x73 - Set Sidetone Gain
 * Handles setting sidetone gain
 */
class Command73 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set gain)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'sidetoneGain',
                    name: 'Sidetone Gain',
                    type: 'number',
                    min: -20,
                    max: 20,
                    defaultValue: 0,
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
                        { value: '0x02', label: 'INVALID_GAIN' }
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
            const fieldId = `field-${field.id}-0x73`;
            const groupId = `field-group-${field.id}-0x73`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Sidetone Gain') fieldName = '侧音增益';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            if (field.type === 'number') {
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min} to ${field.max} dB):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min}" max="${field.max}"
                               value="${field.defaultValue}" style="width: 80px;">
                        <span>dB</span>
                    </div>
                `;
            } else {
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    if (isZh) {
                        if (label === 'SUCCESS') label = 'SUCCESS (成功)';
                        else if (label === 'FAILED') label = 'FAILED (失败)';
                        else if (label === 'INVALID_GAIN') label = 'INVALID_GAIN (增益无效)';
                    }
                    return `<option value="${option.value}">${label}</option>`;
                }).join('');
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName}:</label>
                        <select id="${fieldId}" class="payload-input">${optionsHtml}</select>
                    </div>
                `;
            }
        }).join('');

        container.innerHTML = `<div class="dynamic-fields">${fieldsHtml}</div>`;
        setTimeout(() => {
            const packetTypeField = document.getElementById('field-packetType-0x73');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x73`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x73`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x73`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x73`, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const gainElement = document.getElementById('field-sidetoneGain-0x73');
            if (!gainElement) return [];

            // Convert dB value to signed byte (-20 to +20 dB range)
            const gainValue = parseInt(gainElement.value) || 0;
            const byteValue = gainValue < 0 ? 256 + gainValue : gainValue;
            return [byteValue];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x73');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x73');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command73 = Command73;