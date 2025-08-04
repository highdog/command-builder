/**
 * Command 0x20 - Get Usage Statistics
 * Handles usage statistics queries and responses
 */
class Command20 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        this.statisticsTypes = {
            '0x00': 'Total Runtime',
            '0x01': 'Power On Events',
            '0x02': 'Music Playback Time',
            '0x03': 'Voice Call Time',
            '0x04': 'Error Counter Total',
            '0x05': 'Accepted Calls Counter',
            '0x06': 'Button Presses Counter',
            '0x07': 'Volume Level Lifetime Average',
            '0x08': 'Time Multipoint Mode Used',
            '0x09': 'Time ANC Mode Used',
            '0x0A': 'Time Low Latency Mode Used',
            '0x0B': 'Error Information'
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
                        { value: '0', label: 'COMMAND (get)' },
                        { value: '2', label: 'RESPONSE (device reply)' }
                    ]
                },
                {
                    id: 'index',
                    name: 'Index',
                    type: 'number',
                    min: 0,
                    max: 255,
                    defaultValue: 0,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command20 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command20 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate basic fields
        const packetTypeField = this.config.fields.find(f => f.id === 'packetType');
        const indexField = this.config.fields.find(f => f.id === 'index');

        const packetTypeHtml = packetTypeField ? `
            <div class="form-group" id="field-group-packetType-0x20">
                <label for="field-packetType-0x20">${packetTypeField.name}:</label>
                <select id="field-packetType-0x20" class="payload-input">
                    ${packetTypeField.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            </div>
        ` : '';

        const indexHtml = indexField ? `
            <div class="form-group" id="field-group-index-0x20" style="display: none;">
                <label for="field-index-0x20">${indexField.name} (${indexField.min}-${indexField.max}):</label>
                <input type="number" id="field-index-0x20" class="payload-input"
                       min="${indexField.min}" max="${indexField.max}"
                       value="${indexField.defaultValue}" style="width: 90%;">
            </div>
        ` : '';

        // Statistics management section
        const statisticsSectionHtml = `
            <div id="response-options-0x20" style="display: none;">
                <div class="form-group">
                    <label>${isZh ? '统计项目:' : 'Statistics Items:'}</label>
                    <div id="statistics-container-0x20"></div>
                    <button type="button" id="add-statistics-btn-0x20" class="button" style="width: 100%; margin-top: 1rem;">${isZh ? '+ 添加统计项' : '+ Add Statistics Item'}</button>
                </div>
            </div>
        `;

        const html = `<div class="dynamic-fields">
                ${packetTypeHtml}
                ${indexHtml}
                ${statisticsSectionHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        // Use setTimeout to ensure DOM is fully rendered before setting defaults
        setTimeout(() => {
            this.setDefaultValues();
            this.addStatisticsItem(); // Add one item by default
        }, 0);

        this.attachListeners();
    }

    setDefaultValues() {
        // Set packet type to RESPONSE by default
        const packetTypeField = document.getElementById('field-packetType-0x20');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        const packetTypeField = document.getElementById('field-packetType-0x20');
        const indexGroup = document.getElementById('field-group-index-0x20');
        const responseOptions = document.getElementById('response-options-0x20');

        if (packetTypeField) {
            const isCommand = packetTypeField.value === '0';

            if (indexGroup) {
                indexGroup.style.display = isCommand ? 'block' : 'none';
            }

            if (responseOptions) {
                responseOptions.style.display = isCommand ? 'none' : 'block';
            }
        }
    }

    

        addStatisticsItem(type = '0x00', value = 0) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            const container = document.getElementById('statistics-container-0x20');
            const itemIndex = container.children.length;

            const fieldset = document.createElement('fieldset');
            fieldset.className = 'statistics-item';
            fieldset.innerHTML = `
                <legend>${isZh ? '统计项目' : 'Statistics Item'} #${itemIndex + 1}</legend>
                <div class="form-group">
                    <label>${isZh ? '类型:' : 'Type:'}</label>
                    <select class="statistics-type">
                        ${Object.entries(this.statisticsTypes).map(([value, name]) =>
                            `<option value="${value}" ${value === type ? 'selected' : ''}>${value} - ${name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="statistics-content">
                    ${this.renderStatisticsContent(type, value)}
                </div>
                <button type="button" class="remove-statistics-btn button-danger">${isZh ? '移除' : 'Remove'}</button>
            `;
            container.appendChild(fieldset);
            
            // Add listener for type change
            fieldset.querySelector('.statistics-type').addEventListener('change', (e) => {
                const contentDiv = fieldset.querySelector('.statistics-content');
                contentDiv.innerHTML = this.renderStatisticsContent(e.target.value, 0);
                generateOutput();
            });
            
            generateOutput();
    }

    

        renderStatisticsContent(type, value) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            switch(type) {
                case '0x07': // Volume Level Lifetime Average (1 byte)
                    return `<div class="form-group">
                        <label>${isZh ? '音量级别 (0-32):' : 'Volume Level (0-32):'}</label>
                        <input type="number" class="statistics-value" min="0" max="32" value="${value}" style="width: 90%;">
                    </div>`;
                case '0x0B': // Error Information (variable length)
                    return `<div class="form-group">
                        <label>${isZh ? '错误数据 (十六进制字节，空格分隔):' : 'Error Data (hex bytes, space separated):'}</label>
                        <input type="text" class="statistics-value" placeholder="01 02 03 04" value="${value}" style="width: 90%;">
                    </div>`;
                default: // Most statistics are 4-byte uint32 values
                    return `<div class="form-group">
                        <label>${isZh ? '数值 (uint32):' : 'Value (uint32):'}</label>
                        <input type="number" class="statistics-value" min="0" max="4294967295" value="${value}" style="width: 90%;">
                    </div>`;
            }
        }

    

    attachListeners() {
        // Add listener for packet type changes
        const packetTypeField = document.getElementById('field-packetType-0x20');
        if (packetTypeField) {
            packetTypeField.addEventListener('change', (e) => {
                this.updateFieldVisibility();
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listener for index field
        const indexField = document.getElementById('field-index-0x20');
        if (indexField) {
            indexField.addEventListener('input', () => {
                if (typeof generateOutput === 'function') generateOutput();
            });
        }

        // Add listener for add statistics button
        const addBtn = document.getElementById('add-statistics-btn-0x20');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addStatisticsItem());
        }

        // Add listener for remove statistics buttons
        const container = document.getElementById('statistics-container-0x20');
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-statistics-btn')) {
                    e.target.closest('.statistics-item').remove();
                    if (typeof generateOutput === 'function') generateOutput();
                }
            });

            // Add listeners for statistics value changes
            container.addEventListener('input', (e) => {
                if (e.target && e.target.classList.contains('statistics-value')) {
                    if (typeof generateOutput === 'function') generateOutput();
                }
            });
        }

        // Add listeners for main fields
        this.addListener('field-packetType-0x20', 'change');
        this.addListener('field-index-0x20', 'input');
    }

    

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) { // COMMAND
            const indexElement = document.getElementById('field-index-0x20');
            if (!indexElement) return [];
            const index = parseInt(indexElement.value) || 0;
            return [index];
        } else { // RESPONSE
            const payload = [];
            const items = document.querySelectorAll('#statistics-container-0x20 .statistics-item');

            items.forEach(item => {
                const typeSelect = item.querySelector('.statistics-type');
                const valueInput = item.querySelector('.statistics-value');

                if (!typeSelect || !valueInput) return;

                const type = parseInt(typeSelect.value, 16);
                const typeHex = typeSelect.value;

                let content = [];

                switch(typeHex) {
                    case '0x07': // Volume Level (1 byte)
                        content = [parseInt(valueInput.value) || 0];
                        break;
                    case '0x0B': // Error Information (variable)
                        const hexString = valueInput.value.trim();
                        if (hexString) {
                            content = hexString.split(/\s+/).map(hex => parseInt(hex, 16) || 0);
                        }
                        break;
                    default: // uint32 values (4 bytes, little endian)
                        const value = parseInt(valueInput.value) || 0;
                        content = [
                            value & 0xFF,
                            (value >> 8) & 0xFF,
                            (value >> 16) & 0xFF,
                            (value >> 24) & 0xFF
                        ];
                        break;
                }

                // Add: type (1 byte) + length (1 byte) + content
                payload.push(type);
                payload.push(content.length);
                payload.push(...content);
            });

            return payload;
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x20');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command20 = Command20;