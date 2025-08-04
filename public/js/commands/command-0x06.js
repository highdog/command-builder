/**
 * Command 0x06 - Battery Level Query/Response/Notification
 * Handles battery level information queries, responses and notifications
 */
class Command06 extends BaseCommand {
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
                    id: 'productType',
                    name: 'Product Type',
                    options: [
                        { value: 'earbuds', label: 'Earbuds' },
                        { value: 'headset', label: 'Headset' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when RESPONSE or NOTIFICATION (value !== '0')
                    }
                },
                {
                    id: 'leftEarbudBattery',
                    name: 'Left Earbud Battery',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 95,
                    hasOfflineOption: true,
                    offlineValue: 0xFF,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'rightEarbudBattery',
                    name: 'Right Earbud Battery',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 98,
                    hasOfflineOption: true,
                    offlineValue: 0xFF,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'chargingCaseBattery',
                    name: 'Charging Case Battery',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 80,
                    hasOfflineOption: true,
                    offlineValue: 0xFF,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'headsetBattery',
                    name: 'Headset Battery',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 90,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'headset'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command06 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command06 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x06`;
            const groupId = `field-group-${field.id}-0x06`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field with optional offline checkbox
                const offlineCheckboxId = `${field.id}-offline-0x06`;
                const offlineCheckbox = field.hasOfflineOption ? `
                    <div style="margin-bottom: 0.5rem;">
                        <input type="checkbox" id="${offlineCheckboxId}">
                        <label for="${offlineCheckboxId}">${isZh ? `离线 (0x${field.offlineValue?.toString(16).toUpperCase() || 'FF'})` : `Offline (0x${field.offlineValue?.toString(16).toUpperCase() || 'FF'})`}</label>
                    </div>
                ` : '';

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <fieldset>
                            <legend>${field.name}:</legend>
                            ${offlineCheckbox}
                            <label for="${fieldId}">${isZh ? `电池 (${field.min}-${field.max}):` : `Battery (${field.min}-${field.max}):`}</label>
                            <input type="number" id="${fieldId}" class="payload-input"
                                   min="${field.min || 0}"
                                   max="${field.max || 100}"
                                   value="${field.defaultValue || 0}"
                                   style="width: 90%;">
                        </fieldset>
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
        const packetTypeField = document.getElementById('field-packetType-0x06');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set product type to earbuds by default
        const productTypeField = document.getElementById('field-productType-0x06');
        if (productTypeField) {
            productTypeField.value = 'earbuds';
            productTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x06`;
                const targetGroupId = `field-group-${field.id}-0x06`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Special handling for productType field - show when packetType is not '0'
                    if (field.id === 'productType') {
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x06`;
                const targetGroupId = `field-group-${field.id}-0x06`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Special handling for productType field
                        if (field.id === 'productType') {
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

        // Add listeners for offline checkboxes
        this.config.fields.forEach(field => {
            if (field.hasOfflineOption) {
                const offlineCheckboxId = `${field.id}-offline-0x06`;
                const fieldId = `field-${field.id}-0x06`;

                const offlineCheckbox = document.getElementById(offlineCheckboxId);
                const numberInput = document.getElementById(fieldId);

                if (offlineCheckbox && numberInput) {
                    offlineCheckbox.addEventListener('change', (e) => {
                        numberInput.disabled = e.target.checked;
                        if (typeof generateOutput === 'function') generateOutput();
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x06`;
            this.addListener(fieldId, 'change');
            if (field.type === 'number') {
                this.addListener(fieldId, 'input');
            }
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const productTypeElement = document.getElementById('field-productType-0x06');
        if (!productTypeElement) return [];

        const productType = productTypeElement.value;

        if (productType === 'earbuds') {
            const batteryFields = ['leftEarbudBattery', 'rightEarbudBattery', 'chargingCaseBattery'];
            return batteryFields.map(fieldId => {
                const offlineCheckbox = document.getElementById(`${fieldId}-offline-0x06`);
                const batteryInput = document.getElementById(`field-${fieldId}-0x06`);

                if (offlineCheckbox && offlineCheckbox.checked) {
                    // Find the field config to get the offline value
                    const fieldConfig = this.config.fields.find(f => f.id === fieldId);
                    return fieldConfig?.offlineValue || 0xFF;
                }

                return batteryInput ? (parseInt(batteryInput.value) || 0) : 0;
            });
        } else if (productType === 'headset') {
            const headsetBatteryInput = document.getElementById('field-headsetBattery-0x06');
            return [headsetBatteryInput ? (parseInt(headsetBatteryInput.value) || 0) : 0];
        }

        return [];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x06');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command06 = Command06;