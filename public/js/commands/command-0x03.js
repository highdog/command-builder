/**
 * Command 0x03 - Feature Version Query/Response
 * Handles feature version information queries and responses
 */
class Command03 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'featureVersion',
                    name: 'Feature Version',
                    type: 'number',
                    min: 0,
                    max: 255,
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
        console.log('Command03 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command03 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x03`;
            const groupId = `field-group-${field.id}-0x03`;

            let fieldHtml = '';

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                // For conditional fields, start hidden and let setDefaultValues show them if needed
                initialStyle = 'style="display: none;"';
            }

            if (field.type === 'number') {
                // Number input field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${field.name} (${field.min}-${field.max}):</label>
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
                        <label for="${fieldId}">${field.name}:</label>
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
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x03');
        if (packetTypeField) {
            packetTypeField.value = '2';
            // Trigger change event to show response options
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x03`;
                const targetGroupId = `field-group-${field.id}-0x03`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Check if condition is met and show/hide accordingly
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x03`;
                const targetGroupId = `field-group-${field.id}-0x03`;

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
            const fieldId = `field-${field.id}-0x03`;
            this.addListener(fieldId, 'change');
            if (field.type === 'number') {
                this.addListener(fieldId, 'input');
            }
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const featureVersionElement = document.getElementById('field-featureVersion-0x03');
        if (!featureVersionElement) return [];

        const featureVersion = parseInt(featureVersionElement.value) || 0;
        return [featureVersion];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x03');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command03 = Command03;
