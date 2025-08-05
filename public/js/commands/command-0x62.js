/**
 * Command 0x62 - Get Low Latency Mode
 * Handles low latency mode queries and responses
 */
class Command62 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get mode)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'lowLatencyEnabled',
                    name: 'Low Latency Mode Enabled',
                    type: 'checkbox',
                    defaultValue: false,
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
            const fieldId = `field-${field.id}-0x62`;
            const groupId = `field-group-${field.id}-0x62`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'Low Latency Mode Enabled') fieldName = '低延迟模式启用';

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
            const packetTypeField = document.getElementById('field-packetType-0x62');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x62`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x62`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x62`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x62`, field.type === 'checkbox' ? 'change' : 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        const enabledElement = document.getElementById('field-lowLatencyEnabled-0x62');
        return enabledElement ? [enabledElement.checked ? 0x01 : 0x00] : [];
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x62');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command62 = Command62;