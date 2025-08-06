/**
 * Command 0x7D - Set Dolby Atmos Config
 * Handles setting Dolby Atmos configuration
 */
class Command7D extends BaseCommand {
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
                    id: 'stereoVirtualizer',
                    name: 'Stereo Virtualizer',
                    options: [
                        { value: '0', label: 'OFF' },
                        { value: '1', label: 'ON (non-DAX)' },
                        { value: '2', label: 'ON_DAX (room simulation only)' }
                    ],
                    showWhen: { fieldId: 'packetType', value: '0' }
                },
                {
                    id: 'headTracker',
                    name: 'Head Tracker',
                    options: [
                        { value: '0', label: 'OFF' },
                        { value: '1', label: 'ON' }
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
            const fieldId = `field-${field.id}-0x7D`;
            const groupId = `field-group-${field.id}-0x7D`;
            let initialStyle = field.showWhen ? 'style="display: none;"' : '';
            let fieldName = field.name;

            if (isZh) {
                if (fieldName === 'Stereo Virtualizer') fieldName = '立体声虚拟器';
                else if (fieldName === 'Head Tracker') fieldName = '头部跟踪';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    const translations = {
                        'OFF': '关闭 (OFF)',
                        'ON (non-DAX)': '开启 (ON - 非DAX)',
                        'ON_DAX (room simulation only)': '仅房间模拟 (ON_DAX)',
                        'ON': '开启 (ON)',
                        'SUCCESS': 'SUCCESS (成功)',
                        'FAILED': 'FAILED (失败)'
                    };
                    label = translations[label] || label;
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
            const packetTypeField = document.getElementById('field-packetType-0x7D');
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
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7D`);
                const targetGroup = document.getElementById(`field-group-${field.id}-0x7D`);
                if (triggerElement && targetGroup) {
                    targetGroup.style.display = triggerElement.value === field.showWhen.value ? 'block' : 'none';
                }
            }
        });
    }

    attachListeners() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerElement = document.getElementById(`field-${field.showWhen.fieldId}-0x7D`);
                if (triggerElement) {
                    triggerElement.addEventListener('change', () => this.updateFieldVisibility());
                }
            }
            this.addListener(`field-${field.id}-0x7D`, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        if (packetType === 2) {
            const statusElement = document.getElementById('field-executionStatus-0x7D');
            return statusElement ? [parseInt(statusElement.value, 16)] : [];
        }

        const stereoVirtualizerEl = document.getElementById('field-stereoVirtualizer-0x7D');
        const headTrackerEl = document.getElementById('field-headTracker-0x7D');

        const stereoVirtualizer = stereoVirtualizerEl ? parseInt(stereoVirtualizerEl.value) || 0 : 0;
        const headTracker = headTrackerEl ? parseInt(headTrackerEl.value) || 0 : 0;

        // Build the payload according to the bit specification
        const payload = [];

        // First byte: STEREO_VIRTUALIZER (ID=0x00)
        let byte1 = 0;
        byte1 |= (0x00 & 0x3F); // Bits 0-5: Feature ID 0 (STEREO_VIRTUALIZER)
        byte1 |= ((stereoVirtualizer & 0x03) << 6); // Bits 6-7: Status
        payload.push(byte1);

        // Second byte: HEAD_TRACKER (ID=0x01)
        let byte2 = 0;
        byte2 |= (0x01 & 0x3F); // Bits 0-5: Feature ID 1 (HEAD_TRACKER)
        byte2 |= ((headTracker & 0x03) << 6); // Bits 6-7: Status
        payload.push(byte2);

        return payload;
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packetType-0x7D');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7D = Command7D;
