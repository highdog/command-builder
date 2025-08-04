/**
 * Command 0x09 - Get LE Configurations
 * Handles LE (Low Energy) configuration queries and responses
 */
class Command09 extends BaseCommand {
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
                        { value: '2', label: 'RESPONSE' }
                    ]
                },
                {
                    id: 'googleFastPair',
                    name: 'Google Fast Pair',
                    type: 'checkbox',
                    bitPosition: 0,
                    defaultValue: true, // ON by default
                    invertLogic: true, // 0=ON, 1=OFF
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                },
                {
                    id: 'leAudio',
                    name: 'LE Audio',
                    type: 'checkbox',
                    bitPosition: 1,
                    defaultValue: false, // OFF by default
                    invertLogic: true, // 0=ON, 1=OFF
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                }
            ]
        };
    }


    render(container) {
        console.log('Command09 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command09 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x09`;
            const groupId = `field-group-${field.id}-0x09`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldHtml = '';

            if (field.type === 'checkbox') {
                // Checkbox field with localized labels
                let label = field.name;
                if (isZh) {
                    if (label === 'Google Fast Pair') label = 'Google快速配对';
                    else if (label === 'LE Audio') label = 'LE音频';
                }

                const checked = field.defaultValue ? 'checked' : '';
                const statusText = isZh ? '(开启)' : '(ON)';

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <div class="checkbox-field">
                            <input type="checkbox" id="${fieldId}" ${checked}>
                            <label for="${fieldId}">${label} ${statusText}</label>
                        </div>
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

        // Group checkbox fields in a fieldset
        const checkboxFields = this.config.fields.filter(f => f.type === 'checkbox');
        const selectFields = this.config.fields.filter(f => f.type !== 'checkbox');

        let checkboxGroupHtml = '';
        if (checkboxFields.length > 0) {
            const checkboxFieldsHtml = checkboxFields.map(field => {
                const fieldId = `field-${field.id}-0x09`;
                const groupId = `field-group-${field.id}-0x09`;

                let label = field.name;
                if (isZh) {
                    if (label === 'Google Fast Pair') label = 'Google快速配对';
                    else if (label === 'LE Audio') label = 'LE音频';
                }

                const checked = field.defaultValue ? 'checked' : '';
                const statusText = isZh ? '(开启)' : '(ON)';

                return `
                    <div id="${groupId}" style="display: none;">
                        <div class="checkbox-field">
                            <input type="checkbox" id="${fieldId}" ${checked}>
                            <label for="${fieldId}">${label} ${statusText}</label>
                        </div>
                    </div>
                `;
            }).join('');

            checkboxGroupHtml = `
                <div id="le-configs-group-0x09" style="display: none;">
                    <fieldset>
                        <legend>${isZh ? 'LE配置 (0=开启, 1=关闭)' : 'LE Configurations (0=ON, 1=OFF)'}</legend>
                        ${checkboxFieldsHtml}
                    </fieldset>
                </div>
            `;
        }

        const selectFieldsHtml = selectFields.map(field => {
            const fieldId = `field-${field.id}-0x09`;
            const groupId = `field-group-${field.id}-0x09`;

            const optionsHtml = field.options.map(option =>
                `<option value="${option.value}">${option.label}</option>`
            ).join('');

            return `
                <div class="form-group" id="${groupId}">
                    <label for="${fieldId}">${field.name}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        }).join('');

        const html = `<div class="dynamic-fields">
                ${selectFieldsHtml}
                ${checkboxGroupHtml}
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
        const packetTypeField = document.getElementById('field-packetType-0x09');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        // Handle checkbox group visibility
        const packetTypeField = document.getElementById('field-packetType-0x09');
        const leConfigsGroup = document.getElementById('le-configs-group-0x09');

        if (packetTypeField && leConfigsGroup) {
            if (packetTypeField.value !== '0') {
                leConfigsGroup.style.display = 'block';
                // Show individual checkbox fields
                this.config.fields.forEach(field => {
                    if (field.type === 'checkbox') {
                        const groupId = `field-group-${field.id}-0x09`;
                        const targetGroup = document.getElementById(groupId);
                        if (targetGroup) {
                            targetGroup.style.display = 'block';
                        }
                    }
                });
            } else {
                leConfigsGroup.style.display = 'none';
                // Hide individual checkbox fields
                this.config.fields.forEach(field => {
                    if (field.type === 'checkbox') {
                        const groupId = `field-group-${field.id}-0x09`;
                        const targetGroup = document.getElementById(groupId);
                        if (targetGroup) {
                            targetGroup.style.display = 'none';
                        }
                    }
                });
            }
        }
    }
    attachListeners() {
        // Add listener for packet type changes
        const packetTypeField = document.getElementById('field-packetType-0x09');
        if (packetTypeField) {
            packetTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listeners for checkbox fields
        this.config.fields.forEach(field => {
            if (field.type === 'checkbox') {
                const fieldId = `field-${field.id}-0x09`;
                const checkboxElement = document.getElementById(fieldId);
                if (checkboxElement) {
                    checkboxElement.addEventListener('change', () => {
                        if (typeof generateOutput === 'function') generateOutput();
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x09`;
            if (field.type !== 'checkbox') {
                this.addListener(fieldId, 'change');
            }
        });
    }
    getPayload() {
        if (this.getPacketType() === 0) return [];

        let payloadByte = 0b00000000;

        // Process checkbox fields with bit operations
        this.config.fields.forEach(field => {
            if (field.type === 'checkbox' && typeof field.bitPosition === 'number') {
                const fieldId = `field-${field.id}-0x09`;
                const checkboxElement = document.getElementById(fieldId);

                if (checkboxElement) {
                    const isChecked = checkboxElement.checked;

                    // Handle inverted logic (0=ON, 1=OFF)
                    if (field.invertLogic) {
                        if (!isChecked) {
                            payloadByte |= (1 << field.bitPosition);
                        }
                    } else {
                        if (isChecked) {
                            payloadByte |= (1 << field.bitPosition);
                        }
                    }
                }
            }
        });

        return [payloadByte];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x09');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command09 = Command09;