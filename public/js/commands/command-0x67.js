/**
 * Command 0x67 - Set Enabled Voice Prompts
 * Handles setting enabled voice prompts
 */
class Command67 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set prompts)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'voicePromptsEnabled',
                    name: 'Voice Prompts Enabled',
                    type: 'checkbox',
                    defaultValue: true,
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
            const fieldId = `field-${field.id}-0x67`;
            const groupId = `field-group-${field.id}-0x67`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Voice Prompts Enabled') fieldName = '语音提示启用';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

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
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    if (isZh) {
                        if (label === 'SUCCESS') label = 'SUCCESS (成功)';
                        else if (label === 'FAILED') label = 'FAILED (失败)';
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
            const packetTypeField = document.getElementById('field-packetType-0x67');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x67`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x67`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x67`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x67`, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const enabledElement = document.getElementById('field-voicePromptsEnabled-0x67');
            return enabledElement ? [enabledElement.checked ? 0x01 : 0x00] : [];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x67');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x67');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command67 = Command67;