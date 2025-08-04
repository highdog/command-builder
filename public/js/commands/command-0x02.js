/**
 * Command 0x02 - Serial Number Query/Response
 * Handles device serial number information queries and responses
 */
class Command02 extends BaseCommand {
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
                    id: 'productType',
                    name: 'Product Type',
                    options: [
                        { value: 'earbuds', label: 'Earbuds' },
                        { value: 'headset', label: 'Headset' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                },
                {
                    id: 'leftEarbudSerial',
                    name: 'Left Earbud Serial',
                    type: 'text',
                    maxLength: 16,
                    defaultValue: 'L_SERIAL_12345',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'rightEarbudSerial',
                    name: 'Right Earbud Serial',
                    type: 'text',
                    maxLength: 16,
                    defaultValue: 'R_SERIAL_67890',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'headsetSerial',
                    name: 'Headset Serial',
                    type: 'text',
                    maxLength: 16,
                    defaultValue: 'H_SERIAL_ABCDE',
                    showWhen: {
                        fieldId: 'productType',
                        value: 'headset'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command02 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command02 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x02`;
            const groupId = `field-group-${field.id}-0x02`;

            let fieldHtml = '';

            if (field.type === 'text') {
                // Text input field with optional offline checkbox
                const offlineCheckboxId = `${field.id}-offline-0x02`;
                const offlineCheckbox = field.hasOfflineOption ? `
                    <div style="margin-bottom: 0.5rem;">
                        <input type="checkbox" id="${offlineCheckboxId}">
                        <label for="${offlineCheckboxId}">${isZh ? '离线 (零值)' : 'Offline (zeros)'}</label>
                    </div>
                ` : '';

                fieldHtml = `
                    <div class="form-group" id="${groupId}" style="display: none;">
                        <fieldset>
                            <legend>${field.name}:</legend>
                            ${offlineCheckbox}
                            <label for="${fieldId}">${isZh ? '序列号 (最多16位):' : 'Serial (max 16):'}</label>
                            <input type="text" id="${fieldId}" class="payload-input"
                                   maxlength="${field.maxLength || 16}"
                                   value="${field.defaultValue || ''}"
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
                    <div class="form-group" id="${groupId}">
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

        // Set default values and visibility
        this.setDefaultValues();
        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x02');
        if (packetTypeField) {
            packetTypeField.value = '2';
            // Trigger change event to show response options
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set product type to earbuds by default
        const productTypeField = document.getElementById('field-productType-0x02');
        if (productTypeField) {
            productTypeField.value = 'earbuds';
            // Trigger change event to show earbud options
            productTypeField.dispatchEvent(new Event('change'));
        }
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x02`;
                const targetGroupId = `field-group-${field.id}-0x02`;

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

        // Add listeners for offline checkboxes
        this.config.fields.forEach(field => {
            if (field.hasOfflineOption) {
                const offlineCheckboxId = `${field.id}-offline-0x02`;
                const fieldId = `field-${field.id}-0x02`;

                const offlineCheckbox = document.getElementById(offlineCheckboxId);
                const textInput = document.getElementById(fieldId);

                if (offlineCheckbox && textInput) {
                    offlineCheckbox.addEventListener('change', (e) => {
                        textInput.disabled = e.target.checked;
                        if (e.target.checked) {
                            textInput.value = '';
                        } else {
                            textInput.value = field.defaultValue || '';
                        }
                        if (typeof generateOutput === 'function') generateOutput();
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x02`;
            this.addListener(fieldId, 'change');
            if (field.type === 'text') {
                this.addListener(fieldId, 'input');
            }
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const productTypeElement = document.getElementById('field-productType-0x02');
        if (!productTypeElement) return [];

        const productType = productTypeElement.value;

        if (productType === 'earbuds') {
            // Get left earbud serial
            const leftOfflineCheckbox = document.getElementById('leftEarbudSerial-offline-0x02');
            const leftSerialInput = document.getElementById('field-leftEarbudSerial-0x02');
            const leftSn = (leftOfflineCheckbox && leftOfflineCheckbox.checked) ?
                '' : (leftSerialInput ? leftSerialInput.value : '');

            // Get right earbud serial
            const rightOfflineCheckbox = document.getElementById('rightEarbudSerial-offline-0x02');
            const rightSerialInput = document.getElementById('field-rightEarbudSerial-0x02');
            const rightSn = (rightOfflineCheckbox && rightOfflineCheckbox.checked) ?
                '' : (rightSerialInput ? rightSerialInput.value : '');

            return [
                ...this.stringToPaddedBytes(leftSn, 16),
                ...this.stringToPaddedBytes(rightSn, 16)
            ];
        } else if (productType === 'headset') {
            const headsetSerialInput = document.getElementById('field-headsetSerial-0x02');
            const headsetSn = headsetSerialInput ? headsetSerialInput.value : '';
            return this.stringToPaddedBytes(headsetSn, 16);
        }

        return [];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x02');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command02 = Command02;
