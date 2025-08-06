/**
 * Command 0x7F - Set Audio Codecs Configurations
 * Handles setting audio codec configurations
 */
class Command7F extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    getDefaultConfig() {
        return {
            fields: [
                {
                    id: 'packetType',
                    name: 'Packet Type',
                    options: [
                        { value: '0', label: 'COMMAND (set config)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'ldacStatus',
                    name: 'LDAC Status',
                    options: [
                        { value: '0', label: 'ON' },
                        { value: '1', label: 'OFF' }
                    ],
                    showWhen: { fieldId: 'packetType', value: '0' }
                },
                {
                    id: 'executionStatus',
                    name: 'Execution Status',
                    options: [
                        { value: '0x00', label: 'SUCCESS' },
                        { value: '0x01', label: 'FAILED' }
                    ],
                    showWhen: { fieldId: 'packetType', value: '2' }
                }
            ]
        };
    }

    render(container) {
        if (!this.config) this.config = this.getDefaultConfig();
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x7F`;
            const groupId = `field-group-${field.id}-0x7F`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'LDAC Status') fieldName = 'LDAC状态';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    if (label === 'ON') label = '开启 (ON)';
                    else if (label === 'OFF') label = '关闭 (OFF)';
                    else if (label === 'SUCCESS') label = 'SUCCESS (成功)';
                    else if (label === 'FAILED') label = 'FAILED (失败)';
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
            const packetTypeField = document.getElementById('field-packetType-0x7F');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7F`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x7F`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7F`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x7F`, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: set codec configuration
            const ldacStatusEl = document.getElementById('field-ldacStatus-0x7F');
            const ldacStatus = ldacStatusEl ? parseInt(ldacStatusEl.value) || 0 : 0;

            // Build byte according to specification (same format as 0x7E)
            let codecByte = 0;
            codecByte |= (0x00 & 0x3F); // Bits 0-5: LDAC codec type (0x00)
            codecByte |= ((ldacStatus & 0x03) << 6); // Bits 6-7: Status

            return [codecByte];
        } else {
            // RESPONSE: execution status
            const statusElement = document.getElementById('field-executionStatus-0x7F');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packetType-0x7F');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7F = Command7F;
