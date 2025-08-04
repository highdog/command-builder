/**
 * Command 0x08 - Set Bluetooth LED Configurations
 * Handles setting Bluetooth LED configurations
 */
class Command08 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND' },
                        { value: '2', label: 'RESPONSE' }
                    ]
                },
                {
                    id: 'ledConfig',
                    name: 'LED Configuration',
                    options: [
                        { value: '0', label: 'On' },
                        { value: '1', label: 'Off' }
                    ]
                }
            ]
        };
    }

    render(container) {
        console.log('Command08 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command08 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x08`;
            const groupId = `field-group-${field.id}-0x08`;

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
        // Set packet type to COMMAND by default (this is a set command)
        const packetTypeField = document.getElementById('field-packetType-0x08');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set LED config to On by default
        const ledConfigField = document.getElementById('field-ledConfig-0x08');
        if (ledConfigField) {
            ledConfigField.value = '0';
            ledConfigField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x08`;
                const targetGroupId = `field-group-${field.id}-0x08`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Check condition and show/hide accordingly
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x08`;
                const targetGroupId = `field-group-${field.id}-0x08`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Check condition and show/hide accordingly
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
            const fieldId = `field-${field.id}-0x08`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const ledConfigElement = document.getElementById('field-ledConfig-0x08');
        if (!ledConfigElement) return [];

        const ledConfig = parseInt(ledConfigElement.value) || 0;

        // Both COMMAND and RESPONSE have the same payload format
        return [ledConfig];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x08');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// 注册命令
window.Command08 = Command08;
