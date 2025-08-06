/**
 * Command 0x72 - Get Sidetone Gain
 * Handles sidetone gain queries and responses
 */
class Command72 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get gain)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
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
            const fieldId = `field-${field.id}-0x72`;
            const groupId = `field-group-${field.id}-0x72`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'Sidetone Gain') fieldName = '侧音增益';

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
                const optionsHtml = field.options.map(option =>
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
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
            const packetTypeField = document.getElementById('field-packetType-0x72');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x72`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x72`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x72`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x72`, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        const gainElement = document.getElementById('field-sidetoneGain-0x72');
        if (!gainElement) return [];

        // Convert dB value to signed byte (-20 to +20 dB range)
        const gainValue = parseInt(gainElement.value) || 0;
        const byteValue = gainValue < 0 ? 256 + gainValue : gainValue;
        return [byteValue];
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x72');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command72 = Command72;