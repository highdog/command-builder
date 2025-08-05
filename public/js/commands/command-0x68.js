/**
 * Command 0x68 - Get LED Brightness
 * Handles LED brightness queries and responses
 */
class Command68 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get brightness)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'ledBrightness',
                    name: 'LED Brightness',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 50,
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
            const fieldId = `field-${field.id}-0x68`;
            const groupId = `field-group-${field.id}-0x68`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'LED Brightness') fieldName = 'LED亮度';

            if (field.type === 'number') {
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min}" max="${field.max}"
                               value="${field.defaultValue}" style="width: 80px;">
                        <span>%</span>
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
            const packetTypeField = document.getElementById('field-packetType-0x68');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x68`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x68`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x68`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x68`, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        const brightnessElement = document.getElementById('field-ledBrightness-0x68');
        return brightnessElement ? [parseInt(brightnessElement.value) || 0] : [];
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x68');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command68 = Command68;