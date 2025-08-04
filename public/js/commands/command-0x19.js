/**
 * Command 0x19 - Get Device MAC Address
 * Handles device MAC address queries and responses
 */
class Command19 extends BaseCommand {
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
                    id: 'leftEarbudMac',
                    name: 'Left Earbud MAC',
                    type: 'mac',
                    defaultValue: '12:34:56:78:9A:BC',
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'rightEarbudMac',
                    name: 'Right Earbud MAC',
                    type: 'mac',
                    defaultValue: '12:34:56:78:9A:BD',
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'headsetMac',
                    name: 'Headset MAC',
                    type: 'mac',
                    defaultValue: '12:34:56:78:9A:BE',
                    showWhen: {
                        fieldId: 'productType',
                        value: 'headset'
                    }
                }
            ]
        };
    }


    render(container) {
        console.log('Command19 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command19 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x19`;
            const groupId = `field-group-${field.id}-0x19`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Product Type') fieldName = '产品类型';
                else if (fieldName === 'Left Earbud MAC') fieldName = '左耳机MAC地址';
                else if (fieldName === 'Right Earbud MAC') fieldName = '右耳机MAC地址';
                else if (fieldName === 'Headset MAC') fieldName = '头戴式耳机MAC地址';
            }

            let fieldHtml = '';

            if (field.type === 'mac') {
                // MAC address input field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <fieldset>
                            <legend>${fieldName}</legend>
                            <label for="${fieldId}">${isZh ? 'MAC地址:' : 'MAC Address:'}</label>
                            <input type="text" id="${fieldId}" class="payload-input"
                                   placeholder="AA:BB:CC:DD:EE:FF"
                                   pattern="[0-9A-Fa-f:]{17}"
                                   value="${field.defaultValue || '12:34:56:78:9A:BC'}"
                                   style="width: 90%;">
                        </fieldset>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    // Localize labels
                    if (isZh) {
                        if (label === 'Earbuds') label = '耳机';
                        else if (label === 'Headset') label = '头戴式耳机';
                    }
                    return `<option value="${option.value}">${label}</option>`;
                }).join('');

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
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x19');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set product type to earbuds by default
        const productTypeField = document.getElementById('field-productType-0x19');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x19`;
                const targetGroupId = `field-group-${field.id}-0x19`;

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
        // Add listener for packet type changes
        const packetTypeField = document.getElementById('field-packetType-0x19');
        if (packetTypeField) {
            packetTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listener for product type changes
        const productTypeField = document.getElementById('field-productType-0x19');
        if (productTypeField) {
            productTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listeners for all fields
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x19`;
            const fieldElement = document.getElementById(fieldId);

            if (fieldElement) {
                if (field.type === 'mac') {
                    // MAC address input
                    fieldElement.addEventListener('input', () => {
                        if (typeof generateOutput === 'function') generateOutput();
                    });
                } else {
                    // Select field
                    fieldElement.addEventListener('change', () => {
                        this.updateFieldVisibility();
                        if (typeof generateOutput === 'function') generateOutput();
                    });
                }

                // Add to base listener system
                this.addListener(fieldId, field.type === 'mac' ? 'input' : 'change');
            }
        });
    }

    macToBytes(macString) {
        // Convert MAC address string "AA:BB:CC:DD:EE:FF" to 6 bytes array
        const cleanMac = macString.replace(/[^0-9A-Fa-f]/g, '');
        if (cleanMac.length !== 12) return [0, 0, 0, 0, 0, 0];

        const bytes = [];
        for (let i = 0; i < 12; i += 2) {
            bytes.push(parseInt(cleanMac.substr(i, 2), 16));
        }
        return bytes;
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const productTypeElement = document.getElementById('field-productType-0x19');
        if (!productTypeElement) return [];

        const productType = productTypeElement.value;
        const payload = [];

        // Collect MAC addresses based on product type and field configuration
        this.config.fields.forEach(field => {
            if (field.type === 'mac') {
                const fieldElement = document.getElementById(`field-${field.id}-0x19`);
                if (fieldElement) {
                    // Check if this MAC field should be included based on product type
                    const shouldInclude = !field.showWhen ||
                        (field.showWhen.fieldId === 'productType' && field.showWhen.value === productType);

                    if (shouldInclude) {
                        const macBytes = this.macToBytes(fieldElement.value);
                        payload.push(...macBytes);
                    }
                }
            }
        });

        return payload;
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x19');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command19 = Command19;