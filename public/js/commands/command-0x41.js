/**
 * Command 0x41 - Get Remaining Battery Time
 * Handles remaining battery time queries and responses
 */
class Command41 extends BaseCommand {
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
                    type: 'info',
                    content: {
                        en: 'RESPONSE only (battery time data)',
                        zh: '仅RESPONSE模式（电池时间数据）'
                    }
                },
                {
                    id: 'productType',
                    name: 'Product Type',
                    options: [
                        { value: 'earbuds', label: 'Earbuds' },
                        { value: 'headset', label: 'Headset' }
                    ]
                }
            ]
        };
    }

    render(container) {
        console.log('Command41 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command41 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate basic fields
        const basicFieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x41`;
            const groupId = `field-group-${field.id}-0x41`;

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Product Type') fieldName = '产品类型';
            }

            if (field.type === 'info') {
                // Info field
                const content = isZh ? field.content.zh : field.content.en;
                return `
                    <div class="form-group" id="${groupId}">
                        <div class="info-field">
                            <h5>${fieldName}:</h5>
                            <p style="color: #6c757d; font-style: italic;">${content}</p>
                        </div>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    if (isZh) {
                        if (label === 'Earbuds') label = '耳机';
                        else if (label === 'Headset') label = '头戴式耳机';
                    }
                    return `<option value="${option.value}">${label}</option>`;
                }).join('');

                return `
                    <div class="form-group" id="${groupId}">
                        <label for="${fieldId}">${fieldName}:</label>
                        <select id="${fieldId}" class="payload-input">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            }
        }).join('');

        // Custom battery time fields (keep original complex logic for now)
        const batteryTimeFieldsHtml = `
            <div id="earbuds-options-0x41">
                <fieldset>
                    <legend>${isZh ? '左耳机' : 'Left Earbud'}</legend>
                    <input type="checkbox" id="left-offline">
                    <label for="left-offline">${isZh ? '离线 (0xFF)' : 'Offline (0xFF)'}</label><br>
                    <label for="left-hours">${isZh ? '小时:' : 'Hours:'}</label>
                    <input type="number" id="left-hours" min="0" max="254" value="7" style="width: 60px;">
                    <label for="left-minutes">${isZh ? '分钟:' : 'Minutes:'}</label>
                    <input type="number" id="left-minutes" min="0" max="59" value="30" style="width: 60px;">
                </fieldset>
                <fieldset>
                    <legend>${isZh ? '右耳机' : 'Right Earbud'}</legend>
                    <input type="checkbox" id="right-offline">
                    <label for="right-offline">${isZh ? '离线 (0xFF)' : 'Offline (0xFF)'}</label><br>
                    <label for="right-hours">${isZh ? '小时:' : 'Hours:'}</label>
                    <input type="number" id="right-hours" min="0" max="254" value="7" style="width: 60px;">
                    <label for="right-minutes">${isZh ? '分钟:' : 'Minutes:'}</label>
                    <input type="number" id="right-minutes" min="0" max="59" value="0" style="width: 60px;">
                </fieldset>
            </div>
            <div id="headset-options-0x41" style="display:none;">
                <fieldset>
                    <legend>${isZh ? '头戴式耳机' : 'Headset'}</legend>
                    <label for="headset-hours">${isZh ? '小时:' : 'Hours:'}</label>
                    <input type="number" id="headset-hours" min="0" max="254" value="10" style="width: 60px;">
                    <label for="headset-minutes">${isZh ? '分钟:' : 'Minutes:'}</label>
                    <input type="number" id="headset-minutes" min="0" max="59" value="0" style="width: 60px;">
                </fieldset>
            </div>
        `;

        const html = `<div class="dynamic-fields">
                ${basicFieldsHtml}
                ${batteryTimeFieldsHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        this.attachListeners();
    }
    attachListeners() {
        // Add listeners for product type change
        const productTypeField = document.getElementById('field-productType-0x41');
        if (productTypeField) {
            productTypeField.addEventListener('change', (e) => {
                const earbudsOptions = document.getElementById('earbuds-options-0x41');
                const headsetOptions = document.getElementById('headset-options-0x41');

                if (earbudsOptions && headsetOptions) {
                    if (e.target.value === 'earbuds') {
                        earbudsOptions.style.display = 'block';
                        headsetOptions.style.display = 'none';
                    } else {
                        earbudsOptions.style.display = 'none';
                        headsetOptions.style.display = 'block';
                    }
                }

                if (typeof generateOutput === 'function') generateOutput();
            });

            // Add to base listener system
            this.addListener('field-productType-0x41', 'change');
        }

        // Add listeners for offline checkboxes
        ['left', 'right'].forEach(side => {
            const offlineCheckbox = document.getElementById(`${side}-offline`);
            const hoursInput = document.getElementById(`${side}-hours`);
            const minutesInput = document.getElementById(`${side}-minutes`);

            if (offlineCheckbox && hoursInput && minutesInput) {
                offlineCheckbox.addEventListener('change', (e) => {
                    hoursInput.disabled = e.target.checked;
                    minutesInput.disabled = e.target.checked;
                    if (typeof generateOutput === 'function') generateOutput();
                });
            }
        });

        // Add listeners for time inputs
        ['left-hours', 'left-minutes', 'right-hours', 'right-minutes', 'headset-hours', 'headset-minutes'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    if (typeof generateOutput === 'function') generateOutput();
                });
            }
        });
    }

    getPayload() {
        const payload = [];
        const productTypeElement = document.getElementById('field-productType-0x41');
        if (!productTypeElement) return [];

        const productType = productTypeElement.value;

        if (productType === 'earbuds') {
            ['left', 'right'].forEach(side => {
                const offlineCheckbox = document.getElementById(`${side}-offline`);
                const hoursInput = document.getElementById(`${side}-hours`);
                const minutesInput = document.getElementById(`${side}-minutes`);

                if (offlineCheckbox && offlineCheckbox.checked) {
                    payload.push(0xFF, 0xFF);
                } else {
                    const hours = hoursInput ? parseInt(hoursInput.value) || 0 : 0;
                    const minutes = minutesInput ? parseInt(minutesInput.value) || 0 : 0;
                    payload.push(hours, minutes);
                }
            });
        } else {
            const hoursInput = document.getElementById('headset-hours');
            const minutesInput = document.getElementById('headset-minutes');
            const hours = hoursInput ? parseInt(hoursInput.value) || 0 : 0;
            const minutes = minutesInput ? parseInt(minutesInput.value) || 0 : 0;
            payload.push(hours, minutes);
        }

        return payload;
    }

    getPacketType() {
        return 2; // Always RESPONSE for battery time
    }
    
}

// Register the command class globally
window.Command41 = Command41;