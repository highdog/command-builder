/**
 * Command 0x33 - Set ANC Transparency Gain
 * Handles setting ANC transparency gain
 */
class Command33 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set)' },
                        { value: '2', label: 'RESPONSE' }
                    ]
                },
                {
                    id: 'transparencyGain',
                    name: 'Transparency Gain',
                    type: 'number',
                    min: 0,
                    max: 255,
                    defaultValue: 128,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'appliedTransparencyGain',
                    name: 'Applied Transparency Gain',
                    type: 'number',
                    min: 0,
                    max: 255,
                    defaultValue: 128,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command33 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command33 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x33`;
            const groupId = `field-group-${field.id}-0x33`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Transparency Gain') fieldName = '透明度增益';
                else if (fieldName === 'Applied Transparency Gain') fieldName = '应用的透明度增益';
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 0}"
                               max="${field.max || 255}"
                               value="${field.defaultValue || 0}"
                               style="width: 90%;">
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option =>
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName}:</label>
                        <select id="${fieldId}" class="payload-input">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            }

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
        const packetTypeField = document.getElementById('field-packetType-0x33');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x33`;
                const targetGroupId = `field-group-${field.id}-0x33`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x33`;
                const targetGroupId = `field-group-${field.id}-0x33`;

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
            const fieldId = `field-${field.id}-0x33`;
            this.addListener(fieldId, field.type === 'number' ? 'input' : 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: get transparency gain to set
            const transparencyGainElement = document.getElementById('field-transparencyGain-0x33');
            if (!transparencyGainElement) return [];
            const transparencyGain = parseInt(transparencyGainElement.value) || 0;
            return [transparencyGain];
        } else {
            // RESPONSE: applied transparency gain
            const appliedTransparencyGainElement = document.getElementById('field-appliedTransparencyGain-0x33');
            if (!appliedTransparencyGainElement) return [];
            const appliedTransparencyGain = parseInt(appliedTransparencyGainElement.value) || 0;
            return [appliedTransparencyGain];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x33');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command33 = Command33;