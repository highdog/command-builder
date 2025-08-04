/**
 * Command 0x16 - Set Earbuds Color
 * Handles setting earbuds color
 */
class Command16 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set color)' },
                        { value: '2', label: 'RESPONSE (result status)' }
                    ]
                },
                {
                    id: 'earbudsColor',
                    name: 'Earbuds Color',
                    options: [
                        { value: '0x00', label: 'Color1' },
                        { value: '0x01', label: 'Color2' },
                        { value: '0x02', label: 'Color3' },
                        { value: '0x03', label: 'Color4' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'resultStatus',
                    name: 'Result Status',
                    options: [
                        { value: '0x00', label: 'FAILED' },
                        { value: '0x01', label: 'LEFT successful' },
                        { value: '0x02', label: 'RIGHT successful' },
                        { value: '0x03', label: 'BOTH successful' }
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
        console.log('Command16 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command16 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x16`;
            const groupId = `field-group-${field.id}-0x16`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize labels
                if (isZh) {
                    if (label === 'Color1') label = '颜色1';
                    else if (label === 'Color2') label = '颜色2';
                    else if (label === 'Color3') label = '颜色3';
                    else if (label === 'Color4') label = '颜色4';
                    else if (label === 'FAILED') label = '失败';
                    else if (label === 'LEFT successful') label = '左耳机成功';
                    else if (label === 'RIGHT successful') label = '右耳机成功';
                    else if (label === 'BOTH successful') label = '两个耳机都成功';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Earbuds Color') fieldName = '耳机颜色';
                else if (fieldName === 'Result Status') fieldName = '结果状态';
            }

            const fieldHtml = `
                <div class="form-group" id="${groupId}" ${initialStyle}>
                    <label for="${fieldId}">${fieldName}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;

            return fieldHtml;
        }).join('');

        const html = `<div class="dynamic-fields">
                ${fieldsHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        // Use setTimeout to ensure DOM is fully rendered before setting defaults
        setTimeout(() => {
            this.setDefaultValues();
        }, 0);

        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to COMMAND by default (this is a set command)
        const packetTypeField = document.getElementById('field-packetType-0x16');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x16`;
                const targetGroupId = `field-group-${field.id}-0x16`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    if (triggerElement.value === field.showWhen.value) {
                        targetGroup.style.display = 'block';
                    } else {
                        targetGroup.style.display = 'none';
                    }
                }
            }
        });
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x16`;
                const targetGroupId = `field-group-${field.id}-0x16`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        if (e.target.value === field.showWhen.value) {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x16`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) { // COMMAND
            const colorElement = document.getElementById('field-earbudsColor-0x16');
            if (!colorElement) return [];
            const color = parseInt(colorElement.value, 16);
            return [color];
        } else { // RESPONSE
            const statusElement = document.getElementById('field-resultStatus-0x16');
            if (!statusElement) return [];
            const status = parseInt(statusElement.value, 16);
            return [status];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x16');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command16 = Command16;