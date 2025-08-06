/**
 * Command 0x70 - Get Sidetone Mode
 * Handles sidetone mode queries and responses
 */
class Command70 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get mode)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
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
                        value: '2'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command70 render called');
        if (!this.config) this.config = this.getDefaultConfig();

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x70`;
            const groupId = `field-group-${field.id}-0x70`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh && fieldName === 'Sidetone Mode') fieldName = '侧音模式';

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    const sidetoneTranslations = {
                        'OFF': 'OFF (关闭)',
                        'ON': 'ON (开启)',
                        'AUTO': 'AUTO (自动)'
                    };
                    label = sidetoneTranslations[label] || label;
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
            const packetTypeField = document.getElementById('field-packetType-0x70');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x70`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x70`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x70`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x70`, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        const sidetoneElement = document.getElementById('field-sidetoneMode-0x70');
        return sidetoneElement ? [parseInt(sidetoneElement.value, 16)] : [];
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x70');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command70 = Command70;