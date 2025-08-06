/**
 * Command 0x7E - Get Audio Codecs Configurations
 * Handles audio codec configuration queries and responses
 */
class Command7E extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get config)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'ldacStatus',
                    name: 'LDAC Status',
                    options: [
                        { value: '0', label: 'ON' },
                        { value: '1', label: 'OFF' }
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
            const fieldId = `field-${field.id}-0x7E`;
            const groupId = `field-group-${field.id}-0x7E`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'LDAC Status') fieldName = 'LDAC状态';

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    if (label === 'ON') label = '开启 (ON)';
                    else if (label === 'OFF') label = '关闭 (OFF)';
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
            const packetTypeField = document.getElementById('field-packetType-0x7E');
            if (packetTypeField) {
                packetTypeField.value = '2';
                packetTypeField.dispatchEvent(new Event('change'));
            }
            this.updateFieldVisibility();
        }, 0);
        this.attachListeners();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7E`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x7E`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7E`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x7E`, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        // RESPONSE - audio codec configuration
        const ldacStatusEl = document.getElementById('field-ldacStatus-0x7E');
        const ldacStatus = ldacStatusEl ? parseInt(ldacStatusEl.value) || 0 : 0;

        // Build byte according to specification
        let codecByte = 0;
        codecByte |= (0x00 & 0x3F); // Bits 0-5: LDAC codec type (0x00)
        codecByte |= ((ldacStatus & 0x03) << 6); // Bits 6-7: Status

        return [codecByte];
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packetType-0x7E');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7E = Command7E;
