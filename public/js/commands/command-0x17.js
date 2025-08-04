/**
 * Command 0x17 - Get Peripheral States
 * Handles peripheral states queries and responses
 */
class Command17 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        this.types = { 'DONGLE': 0 };
        this.states = { 'DISCONNECTED': 0, 'CONNECTED': 1 };
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
                    id: 'peripheralStates',
                    name: 'Peripheral States',
                    type: 'dynamic_group',
                    itemTemplate: {
                        type: {
                            name: 'Peripheral Type',
                            options: [
                                { value: '0', label: 'DONGLE' }
                            ]
                        },
                        state: {
                            name: 'Connection State',
                            options: [
                                { value: '0', label: 'DISCONNECTED' },
                                { value: '1', label: 'CONNECTED' }
                            ]
                        }
                    },
                    defaultItems: [
                        { type: '0', state: '1' } // Default: DONGLE CONNECTED
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
        console.log('Command17 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command17 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate packet type field
        const packetTypeField = this.config.fields.find(f => f.id === 'packetType');
        const packetTypeHtml = packetTypeField ? `
            <div class="form-group" id="field-group-packetType-0x17">
                <label for="field-packetType-0x17">${packetTypeField.name}:</label>
                <select id="field-packetType-0x17" class="payload-input">
                    ${packetTypeField.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            </div>
        ` : '';

        // Peripheral management section
        const peripheralSectionHtml = `
            <div id="response-options-0x17" style="display: none;">
                <div id="peripheral-container-0x17"></div>
                <button type="button" id="add-peripheral-btn-0x17" class="button" style="width: 100%; margin-top: 1rem;">${isZh ? '+ 添加外设状态' : '+ Add Peripheral Status'}</button>
            </div>
        `;

        const html = `<div class="dynamic-fields">
                ${packetTypeHtml}
                ${peripheralSectionHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        // Use setTimeout to ensure DOM is fully rendered before setting defaults
        setTimeout(() => {
            this.setDefaultValues();
            this.addPeripheralRow(); // Add initial peripheral row
        }, 0);

        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x17');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        const packetTypeField = document.getElementById('field-packetType-0x17');
        const responseOptions = document.getElementById('response-options-0x17');

        if (packetTypeField && responseOptions) {
            if (packetTypeField.value !== '0') {
                responseOptions.style.display = 'block';
            } else {
                responseOptions.style.display = 'none';
            }
        }
    }

    addPeripheralRow(type = 0, state = 1) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const container = document.getElementById('peripheral-container-0x17');
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'peripheral-row';
        fieldset.innerHTML = `
            <legend>${isZh ? '外设' : 'Peripheral'} #${container.children.length + 1}</legend>
            <div class="form-group"><label>${isZh ? '类型:' : 'Type:'}</label><select class="peripheral-type">${this.createSelect(this.types, type)}</select></div>
            <div class="form-group"><label>${isZh ? '状态:' : 'State:'}</label><select class="peripheral-state">${this.createSelect(this.states, state)}</select></div>
            <button type="button" class="remove-peripheral-btn button-danger">${isZh ? '移除' : 'Remove'}</button>
        `;
        container.appendChild(fieldset);
        generateOutput();
    }

    attachListeners() {
        // Add listener for packet type changes
        const packetTypeField = document.getElementById('field-packetType-0x17');
        if (packetTypeField) {
            packetTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listener for add peripheral button
        const addBtn = document.getElementById('add-peripheral-btn-0x17');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addPeripheralRow());
        }

        // Add listener for remove peripheral buttons
        const container = document.getElementById('peripheral-container-0x17');
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-peripheral-btn')) {
                    e.target.closest('.peripheral-row').remove();
                    if (typeof generateOutput === 'function') generateOutput();
                }
            });

            // Add listeners for peripheral type/state changes
            container.addEventListener('change', (e) => {
                if (e.target && (e.target.classList.contains('peripheral-type') || e.target.classList.contains('peripheral-state'))) {
                    if (typeof generateOutput === 'function') generateOutput();
                }
            });
        }

        // Add listener for main field
        this.addListener('field-packetType-0x17', 'change');
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const payload = [];
        const rows = document.querySelectorAll('#peripheral-container-0x17 .peripheral-row');

        rows.forEach(row => {
            const typeSelect = row.querySelector('.peripheral-type');
            const stateSelect = row.querySelector('.peripheral-state');

            if (typeSelect && stateSelect) {
                const type = parseInt(typeSelect.value, 10);
                const state = parseInt(stateSelect.value, 10);
                // Bits 0-5 for type, Bits 6-7 for state
                const combined = (type & 0x3F) | ((state & 0x03) << 6);
                payload.push(combined);
            }
        });

        return payload;
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x17');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }

    createSelect(options, selectedValue = 0) {
        return Object.entries(options).map(([key, value]) =>
            `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${key}</option>`
        ).join('');
    }
}

// Register the command class globally
window.Command17 = Command17;