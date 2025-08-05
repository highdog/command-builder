/**
 * Command 0x59 - Get Custom Keys
 * Handles custom key mapping queries and responses
 */
class Command59 extends BaseCommand {
    constructor(commandId) {
        super(commandId);

        // Constants for button mapping
        this.locations = {
            earbuds: { 'LEFT': 0, 'RIGHT': 1 },
            headset: { 'MFB': 0, 'Volume+': 1, 'Volume-': 2 }
        };

        this.triggers = {
            'SINGLE_TAP': 0,
            'DOUBLE_TAP': 1,
            'TRIPLE_TAP': 2,
            'LONG_PRESS': 3,
            'SINGLE_THEN_LONG_PRESS': 4,
            'DOUBLE_THEN_LONG_PRESS': 5,
            'FOUR_TAP': 6
        };

        this.actions = {
            'NONE': 0,
            'PLAY_PAUSE': 1,
            'NEXT_SONG': 2,
            'PREVIOUS_SONG': 3,
            'VOICE_ASSISTANT': 4,
            'VOLUME_UP': 5,
            'VOLUME_DOWN': 6,
            'SWITCH_ANC_MODE': 7,
            'SWITCH_TRANSPARENCY_MODE': 8,
            'SWITCH_GAMING_MODE': 9
        };
    }

    // Get default configuration
    getDefaultConfig() {
        return {
            fields: [
                {
                    id: 'packetType',
                    name: 'Packet Type',
                    options: [
                        { value: '0', label: 'COMMAND (get keys)' },
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
                }
            ]
        };
    }

    render(container) {
        console.log('Command59 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command59 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate basic fields
        const basicFieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x59`;
            const groupId = `field-group-${field.id}-0x59`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Product Type') fieldName = '产品类型';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    if (label === 'Earbuds') label = '耳机';
                    else if (label === 'Headset') label = '头戴式耳机';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            return `
                <div class="form-group" id="${groupId}" ${initialStyle}>
                    <label for="${fieldId}">${fieldName}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        }).join('');

        // Custom button mapping container (keep original complex logic)
        const buttonMappingHtml = `
            <div id="mappings-container-0x59" style="display: none;"></div>
            <button type="button" id="add-mapping-btn-0x59" class="button" style="width: 100%; margin-top: 1rem; display: none;">${isZh ? '+ 添加按键映射' : '+ Add Button Mapping'}</button>
        `;

        const html = `<div class="dynamic-fields">
                ${basicFieldsHtml}
                ${buttonMappingHtml}
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
        const packetTypeField = document.getElementById('field-packetType-0x59');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();

        // Add one mapping row by default when in response mode
        setTimeout(() => {
            this.addMappingRow();
        }, 100);
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x59`;
                const targetGroupId = `field-group-${field.id}-0x59`;

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

        // Show/hide button mapping container based on packet type
        const packetTypeElement = document.getElementById('field-packetType-0x59');
        const mappingsContainer = document.getElementById('mappings-container-0x59');
        const addMappingBtn = document.getElementById('add-mapping-btn-0x59');

        if (packetTypeElement && mappingsContainer && addMappingBtn) {
            if (packetTypeElement.value === '2') {
                mappingsContainer.style.display = 'block';
                addMappingBtn.style.display = 'block';
            } else {
                mappingsContainer.style.display = 'none';
                addMappingBtn.style.display = 'none';
            }
        }
    }

    addMappingRow(location = 0, trigger = 0, action = 0) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const container = document.getElementById('mappings-container-0x59');
        const productTypeElement = document.getElementById('field-productType-0x59');

        if (!container || !productTypeElement) return;

        const productType = productTypeElement.value;
        const locationOptions = this.locations[productType];

        const fieldset = document.createElement('fieldset');
        fieldset.className = 'mapping-row';
        fieldset.innerHTML = `
            <legend>${isZh ? '映射' : 'Mapping'} #${container.children.length + 1}</legend>
            <div class="form-group">
                <label>${isZh ? '位置:' : 'Location:'}</label>
                <select class="mapping-location">${this.createSelect(locationOptions, location)}</select>
            </div>
            <div class="form-group">
                <label>${isZh ? '触发方式:' : 'Trigger:'}</label>
                <select class="mapping-trigger">${this.createSelect(this.triggers, trigger)}</select>
            </div>
            <div class="form-group">
                <label>${isZh ? '动作:' : 'Action:'}</label>
                <select class="mapping-action">${this.createSelect(this.actions, action)}</select>
            </div>
            <button type="button" class="remove-mapping-btn button-danger">${isZh ? '移除' : 'Remove'}</button>
        `;
        container.appendChild(fieldset);
        if (typeof generateOutput === 'function') generateOutput();
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x59`;
                const targetGroupId = `field-group-${field.id}-0x59`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        if (e.target.value === field.showWhen.value) {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }

                        // Update button mapping visibility
                        this.updateFieldVisibility();
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x59`;
            this.addListener(fieldId, 'change');
        });

        // Add listener for add mapping button
        const addMappingBtn = document.getElementById('add-mapping-btn-0x59');
        if (addMappingBtn) {
            addMappingBtn.addEventListener('click', () => {
                this.addMappingRow();
            });
        }

        // Add listener for remove mapping buttons
        const mappingsContainer = document.getElementById('mappings-container-0x59');
        if (mappingsContainer) {
            mappingsContainer.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-mapping-btn')) {
                    e.target.closest('.mapping-row').remove();
                    if (typeof generateOutput === 'function') generateOutput();
                }
            });
        }

        // Add listener for product type change to update mappings
        const productTypeField = document.getElementById('field-productType-0x59');
        if (productTypeField) {
            productTypeField.addEventListener('change', () => {
                const mappingsContainer = document.getElementById('mappings-container-0x59');
                if (mappingsContainer) {
                    mappingsContainer.innerHTML = '';
                    this.addMappingRow();
                }
            });
        }
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        
        const payload = [];
        const rows = document.querySelectorAll('#mappings-container-0x59 .mapping-row');
        
        rows.forEach(row => {
            const location = parseInt(row.querySelector('.mapping-location').value, 10);
            const trigger = parseInt(row.querySelector('.mapping-trigger').value, 10);
            const action = parseInt(row.querySelector('.mapping-action').value, 10);

            const combined = (action << 8) | (trigger << 3) | location;

            payload.push((combined >> 8) & 0xFF);
            payload.push(combined & 0xFF);
        });
        
        return payload;
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x59');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command59 = Command59;
