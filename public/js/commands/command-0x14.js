/**
 * Command 0x14 - Get Firmware Version
 * Handles firmware version queries and responses
 */
class Command14 extends BaseCommand {
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
                    id: 'leftEarbudVersion',
                    name: 'Left Earbud Version',
                    type: 'version',
                    defaultValue: '1.6.1',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'rightEarbudVersion',
                    name: 'Right Earbud Version',
                    type: 'version',
                    defaultValue: '1.6.2',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'chargingCaseVersion',
                    name: 'Charging Case Version',
                    type: 'version',
                    defaultValue: '1.0.0',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'earbuds'
                    }
                },
                {
                    id: 'headsetVersion',
                    name: 'Headset Version',
                    type: 'version',
                    defaultValue: '2.0.0',
                    hasOfflineOption: true,
                    showWhen: {
                        fieldId: 'productType',
                        value: 'headset'
                    }
                }
            ]
        };
    }


    render(container) {
        console.log('Command14 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command14 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // For now, use simplified rendering with select fields for product type and packet type
        // Version fields will be rendered as custom HTML until full version field support is implemented

        const packetTypeField = this.config.fields.find(f => f.id === 'packetType');
        const productTypeField = this.config.fields.find(f => f.id === 'productType');

        const packetTypeHtml = packetTypeField ? `
            <div class="form-group" id="field-group-packetType-0x14">
                <label for="field-packetType-0x14">${packetTypeField.name}:</label>
                <select id="field-packetType-0x14" class="payload-input">
                    ${packetTypeField.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            </div>
        ` : '';

        const productTypeHtml = productTypeField ? `
            <div class="form-group" id="field-group-productType-0x14" style="display: none;">
                <label for="field-productType-0x14">${productTypeField.name}:</label>
                <select id="field-productType-0x14" class="payload-input">
                    ${productTypeField.options.map(opt => {
                        let label = opt.label;
                        if (isZh) {
                            if (label === 'Earbuds') label = '耳机';
                            else if (label === 'Headset') label = '头戴式耳机';
                        }
                        return `<option value="${opt.value}">${label}</option>`;
                    }).join('')}
                </select>
            </div>
        ` : '';

        // Version fields with custom HTML
        const versionFieldsHtml = `
            <div id="earbuds-options-0x14" style="display: none;">
                ${this.createVersionFields('left', isZh ? '左耳机' : 'Left Earbud', '1.6.1', isZh)}
                ${this.createVersionFields('right', isZh ? '右耳机' : 'Right Earbud', '1.6.2', isZh)}
                ${this.createVersionFields('case', isZh ? '充电盒' : 'Charging Case', '1.0.0', isZh)}
            </div>
            <div id="headset-options-0x14" style="display: none;">
                ${this.createVersionFields('headset', isZh ? '头戴式耳机' : 'Headset', '2.0.0', isZh)}
            </div>
        `;

        const html = `<div class="dynamic-fields">
                ${packetTypeHtml}
                ${productTypeHtml}
                ${versionFieldsHtml}
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
        const packetTypeField = document.getElementById('field-packetType-0x14');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set product type to earbuds by default
        const productTypeField = document.getElementById('field-productType-0x14');
        if (productTypeField) {
            productTypeField.value = 'earbuds';
            productTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        const packetTypeField = document.getElementById('field-packetType-0x14');
        const productTypeField = document.getElementById('field-productType-0x14');
        const productTypeGroup = document.getElementById('field-group-productType-0x14');
        const earbudsOptions = document.getElementById('earbuds-options-0x14');
        const headsetOptions = document.getElementById('headset-options-0x14');

        if (packetTypeField && productTypeGroup) {
            if (packetTypeField.value !== '0') {
                productTypeGroup.style.display = 'block';

                if (productTypeField) {
                    if (productTypeField.value === 'earbuds') {
                        if (earbudsOptions) earbudsOptions.style.display = 'block';
                        if (headsetOptions) headsetOptions.style.display = 'none';
                    } else if (productTypeField.value === 'headset') {
                        if (earbudsOptions) earbudsOptions.style.display = 'none';
                        if (headsetOptions) headsetOptions.style.display = 'block';
                    }
                }
            } else {
                productTypeGroup.style.display = 'none';
                if (earbudsOptions) earbudsOptions.style.display = 'none';
                if (headsetOptions) headsetOptions.style.display = 'none';
            }
        }
    }
    createVersionFields(idPrefix, legend, defaultVersion, isZh = false) {
        const [maj, min, pat] = defaultVersion.split('.');
        return `
            <fieldset>
                <legend>${legend}</legend>
                <input type="checkbox" id="${idPrefix}-fw-offline"> <label for="${idPrefix}-fw-offline">${isZh ? '离线 (零值)' : 'Offline (zeros)'}</label><br>
                <label>${isZh ? '版本:' : 'Ver:'}</label>
                <input type="number" id="${idPrefix}-fw-major" min="0" max="255" value="${maj}" style="width: 50px;">.
                <input type="number" id="${idPrefix}-fw-minor" min="0" max="255" value="${min}" style="width: 50px;">.
                <input type="number" id="${idPrefix}-fw-patch" min="0" max="255" value="${pat}" style="width: 50px;">
            </fieldset>
        `;
    }
    attachListeners() {
        // Add listener for packet type changes
        const packetTypeField = document.getElementById('field-packetType-0x14');
        if (packetTypeField) {
            packetTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listener for product type changes
        const productTypeField = document.getElementById('field-productType-0x14');
        if (productTypeField) {
            productTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listeners for version fields
        ['left', 'right', 'case', 'headset'].forEach(idPrefix => {
            const offlineCheckbox = document.getElementById(`${idPrefix}-fw-offline`);
            if (offlineCheckbox) {
                offlineCheckbox.addEventListener('change', (e) => {
                    const isOffline = e.target.checked;
                    const majorInput = document.getElementById(`${idPrefix}-fw-major`);
                    const minorInput = document.getElementById(`${idPrefix}-fw-minor`);
                    const patchInput = document.getElementById(`${idPrefix}-fw-patch`);

                    if (majorInput) majorInput.disabled = isOffline;
                    if (minorInput) minorInput.disabled = isOffline;
                    if (patchInput) patchInput.disabled = isOffline;

                    if (typeof generateOutput === 'function') generateOutput();
                });

                // Add listeners for version number inputs
                ['major', 'minor', 'patch'].forEach(part => {
                    const input = document.getElementById(`${idPrefix}-fw-${part}`);
                    if (input) {
                        input.addEventListener('input', () => {
                            if (typeof generateOutput === 'function') generateOutput();
                        });
                    }
                });
            }
        });

        // Add listeners for main fields
        this.addListener('field-packetType-0x14', 'change');
        this.addListener('field-productType-0x14', 'change');
    }
    getPayload() {
        if (this.getPacketType() === 0) return [];

        const getVersionBytes = (idPrefix) => {
            const offlineCheckbox = document.getElementById(`${idPrefix}-fw-offline`);
            if (offlineCheckbox && offlineCheckbox.checked) {
                return [0, 0, 0];
            }

            const majorInput = document.getElementById(`${idPrefix}-fw-major`);
            const minorInput = document.getElementById(`${idPrefix}-fw-minor`);
            const patchInput = document.getElementById(`${idPrefix}-fw-patch`);

            const maj = majorInput ? (parseInt(majorInput.value) || 0) : 0;
            const min = minorInput ? (parseInt(minorInput.value) || 0) : 0;
            const pat = patchInput ? (parseInt(patchInput.value) || 0) : 0;

            return [maj, min, pat];
        };

        const productTypeElement = document.getElementById('field-productType-0x14');
        if (!productTypeElement) return [];

        const productType = productTypeElement.value;
        if (productType === 'earbuds') {
            return [
                ...getVersionBytes('left'),
                ...getVersionBytes('right'),
                ...getVersionBytes('case')
            ];
        } else { // headset
            return getVersionBytes('headset');
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x14');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command14 = Command14;