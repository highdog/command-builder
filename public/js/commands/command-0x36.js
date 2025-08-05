/**
 * Command 0x36 - Get Adaptive ANC Level
 * Handles adaptive ANC level queries, responses and notifications
 */
class Command36 extends BaseCommand {
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
                    id: 'adaptiveAncLevel',
                    name: 'Adaptive ANC Level',
                    options: [
                        { value: '0x00', label: 'HIGH' },
                        { value: '0x01', label: 'MIDDLE' },
                        { value: '0x02', label: 'LOW' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command36 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command36 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x36`;
            const groupId = `field-group-${field.id}-0x36`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Adaptive ANC Level') fieldName = '自适应ANC级别';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize common labels
                if (isZh) {
                    if (label === 'HIGH') label = '高';
                    else if (label === 'MIDDLE') label = '中';
                    else if (label === 'LOW') label = '低';
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
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x36');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set adaptive ANC level to MIDDLE by default
        const adaptiveAncLevelField = document.getElementById('field-adaptiveAncLevel-0x36');
        if (adaptiveAncLevelField) {
            adaptiveAncLevelField.value = '0x01';
            adaptiveAncLevelField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x36`;
                const targetGroupId = `field-group-${field.id}-0x36`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Show when packetType is not '0' (COMMAND)
                    if (triggerElement.value !== '0') {
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x36`;
                const targetGroupId = `field-group-${field.id}-0x36`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Show when packetType is not '0' (COMMAND)
                        if (e.target.value !== '0') {
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
            const fieldId = `field-${field.id}-0x36`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const adaptiveAncLevelElement = document.getElementById('field-adaptiveAncLevel-0x36');
        if (!adaptiveAncLevelElement) return [];

        const adaptiveAncLevel = parseInt(adaptiveAncLevelElement.value, 16);
        return [adaptiveAncLevel];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x36');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command36 = Command36;