/**
 * Command 0x65 - Set Wearing Detection Configuration
 * Handles setting wearing detection configuration
 */
class Command65 extends BaseCommand {
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
                    id: 'wearingDetectionEnabled',
                    name: 'Wearing Detection Enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    showWhen: { fieldId: 'packetType', value: '0' }
                },
                {
                    id: 'autoPlayPause',
                    name: 'Auto Play/Pause',
                    type: 'checkbox',
                    defaultValue: true,
                    showWhen: { fieldId: 'packetType', value: '0' }
                },
                {
                    id: 'sensitivity',
                    name: 'Detection Sensitivity',
                    type: 'number',
                    min: 1,
                    max: 10,
                    defaultValue: 5,
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
            const fieldId = `field-${field.id}-0x65`;
            const groupId = `field-group-${field.id}-0x65`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Wearing Detection Enabled') fieldName = '佩戴检测启用';
                else if (fieldName === 'Auto Play/Pause') fieldName = '自动播放/暂停';
                else if (fieldName === 'Detection Sensitivity') fieldName = '检测灵敏度';
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
            } else if (field.type === 'number') {
                return `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min}" max="${field.max}"
                               value="${field.defaultValue}" style="width: 80px;">
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
            const packetTypeField = document.getElementById('field-packetType-0x65');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x65`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x65`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x65`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x65`, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 0) {
            const wearingEnabled = document.getElementById('field-wearingDetectionEnabled-0x65');
            const autoPlayPause = document.getElementById('field-autoPlayPause-0x65');
            const sensitivity = document.getElementById('field-sensitivity-0x65');

            let configFlags = 0x00;
            if (wearingEnabled && wearingEnabled.checked) configFlags |= 0x01;
            if (autoPlayPause && autoPlayPause.checked) configFlags |= 0x02;

            const sensitivityValue = sensitivity ? parseInt(sensitivity.value) || 5 : 5;
            return [configFlags, sensitivityValue];
        } else {
            const statusElement = document.getElementById('field-executionStatus-0x65');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }
    }

    getPacketType() {
        const element = document.getElementById('field-packetType-0x65');
        return element ? parseInt(element.value, 10) : 0;
    }
}

// Register the command class globally
window.Command65 = Command65;