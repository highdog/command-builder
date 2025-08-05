/**
 * Command 0x35 - Set ANC Wind Noise Detection Mode
 * Handles setting ANC wind noise detection mode
 */
class Command35 extends BaseCommand {
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
                    id: 'windDetection',
                    name: 'Wind Noise Detection',
                    options: [
                        { value: '0x00', label: 'ON' },
                        { value: '0x01', label: 'OFF' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'appliedWindDetection',
                    name: 'Applied Wind Detection',
                    options: [
                        { value: '0x00', label: 'ON' },
                        { value: '0x01', label: 'OFF' }
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
        console.log('Command35 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command35 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x35`;
            const groupId = `field-group-${field.id}-0x35`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Wind Noise Detection') fieldName = '风噪检测';
                else if (fieldName === 'Applied Wind Detection') fieldName = '应用的风噪检测';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize common labels
                if (isZh) {
                    if (label === 'ON') label = '开启';
                    else if (label === 'OFF') label = '关闭';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

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
        const packetTypeField = document.getElementById('field-packetType-0x35');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x35`;
                const targetGroupId = `field-group-${field.id}-0x35`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x35`;
                const targetGroupId = `field-group-${field.id}-0x35`;

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
            const fieldId = `field-${field.id}-0x35`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: get wind detection setting to set
            const windDetectionElement = document.getElementById('field-windDetection-0x35');
            if (!windDetectionElement) return [];
            const windDetection = parseInt(windDetectionElement.value, 16);
            return [windDetection];
        } else {
            // RESPONSE: applied wind detection setting
            const appliedWindDetectionElement = document.getElementById('field-appliedWindDetection-0x35');
            if (!appliedWindDetectionElement) return [];
            const appliedWindDetection = parseInt(appliedWindDetectionElement.value, 16);
            return [appliedWindDetection];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x35');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command35 = Command35;