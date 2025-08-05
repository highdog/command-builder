/**
 * Command 0x66 - Get Enabled Voice Prompts
 * Handles enabled voice prompts queries and responses
 */
class Command66 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get prompts)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'voicePromptsEnabled',
                    name: 'Voice Prompts Enabled',
                    type: 'checkbox',
                    defaultValue: true,
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
            const fieldId = `field-${field.id}-0x66`;
            const groupId = `field-group-${field.id}-0x66`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'Voice Prompts Enabled') fieldName = '语音提示启用';

            if (field.type === 'checkbox') {
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label>
                            <input type="checkbox" id="${fieldId}" class="payload-input"
                                   ${field.defaultValue ? 'checked' : ''}>
                            ${fieldName}
                        </label>
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
            const packetTypeField = document.getElementById('field-packetType-0x66');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x66`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x66`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x66`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x66`, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        const enabledElement = document.getElementById('field-voicePromptsEnabled-0x66');
        return enabledElement ? [enabledElement.checked ? 0x01 : 0x00] : [];
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x66');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command66 = Command66;