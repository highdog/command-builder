/**
 * Command 0x07 - Bluetooth LED Configuration Query/Response/Notification
 * Handles Bluetooth LED configuration queries, responses and notifications
 */
class Command07 extends BaseCommand {
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
                        { value: '2', label: 'RESPONSE' },
                        { value: '1', label: 'NOTIFICATION' }
                    ]
                },
                {
                    id: 'btLedConfig',
                    name: 'Bluetooth LED Config',
                    options: [
                        { value: '0x00', label: 'On' },
                        { value: '0x01', label: 'Off' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND (value !== '0')
                    }
                }
            ]
        };
    }


    render(container) {
        console.log('Command07 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command07 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x07`;
            const groupId = `field-group-${field.id}-0x07`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize common labels
                if (isZh) {
                    if (label === 'On') label = '开启';
                    else if (label === 'Off') label = '关闭';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            const fieldHtml = `
                <div class="form-group" id="${groupId}" ${initialStyle}>
                    <label for="${fieldId}">${field.name}:</label>
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
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x07');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x07`;
                const targetGroupId = `field-group-${field.id}-0x07`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Special handling for btLedConfig field - show when packetType is not '0'
                    if (field.id === 'btLedConfig') {
                        if (triggerElement.value !== '0') {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }
                    } else {
                        // Normal condition check
                        if (triggerElement.value === field.showWhen.value) {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }
                    }
                }
            }
        });
    }
    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x07`;
                const targetGroupId = `field-group-${field.id}-0x07`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Special handling for btLedConfig field
                        if (field.id === 'btLedConfig') {
                            if (e.target.value !== '0') {
                                targetGroup.style.display = 'block';
                            } else {
                                targetGroup.style.display = 'none';
                            }
                        } else {
                            // Normal condition check
                            if (e.target.value === field.showWhen.value) {
                                targetGroup.style.display = 'block';
                            } else {
                                targetGroup.style.display = 'none';
                            }
                        }
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x07`;
            this.addListener(fieldId, 'change');
        });
    }
    getPayload() {
        if (this.getPacketType() === 0) return [];

        const btLedConfigElement = document.getElementById('field-btLedConfig-0x07');
        if (!btLedConfigElement) return [];

        const config = parseInt(btLedConfigElement.value, 16);
        return [config];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x07');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command07 = Command07;