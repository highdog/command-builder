/**
 * Command 0x46 - Get User Equalizer Configuration
 * Handles user equalizer configuration queries and responses
 */
class Command46 extends BaseCommand {
    constructor(commandId) {
        super(commandId);

        // 频段数量定义
        this.bandCounts = {
            1: 5,  // v1: 5频段
            2: 8,  // v2: 8频段
            3: 10  // v3: 10频段
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
                    id: 'requestVersion',
                    name: 'Request Version',
                    options: [
                        { value: '1', label: 'V1 (5 bands)' },
                        { value: '2', label: 'V2 (8 bands)' },
                        { value: '3', label: 'V3 (10 bands)' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '0'
                    }
                },
                {
                    id: 'configVersion',
                    name: 'Config Version',
                    options: [
                        { value: '1', label: 'V1 (5 bands)' },
                        { value: '2', label: 'V2 (8 bands)' },
                        { value: '3', label: 'V3 (10 bands)' }
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
        console.log('Command46 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command46 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate basic fields
        const basicFieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x46`;
            const groupId = `field-group-${field.id}-0x46`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Request Version') fieldName = '请求版本';
                else if (fieldName === 'Config Version') fieldName = '配置版本';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                if (isZh) {
                    if (label.includes('bands')) {
                        label = label.replace('bands', '频段');
                    }
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

        // Custom equalizer bands container (keep original complex logic for now)
        const equalizerBandsHtml = `
            <div id="eq-bands-container-0x46" style="display: none;"></div>
        `;

        const html = `<div class="dynamic-fields">
                ${basicFieldsHtml}
                ${equalizerBandsHtml}
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
        const packetTypeField = document.getElementById('field-packetType-0x46');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();

        // Initialize bands after setting defaults
        setTimeout(() => {
            this.updateBands();
        }, 100);
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x46`;
                const targetGroupId = `field-group-${field.id}-0x46`;

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

        // Show/hide equalizer bands container based on packet type
        const packetTypeElement = document.getElementById('field-packetType-0x46');
        const bandsContainer = document.getElementById('eq-bands-container-0x46');
        if (packetTypeElement && bandsContainer) {
            if (packetTypeElement.value === '2') {
                bandsContainer.style.display = 'block';
            } else {
                bandsContainer.style.display = 'none';
            }
        }
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x46`;
                const targetGroupId = `field-group-${field.id}-0x46`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        if (e.target.value === field.showWhen.value) {
                            targetGroup.style.display = 'block';
                        } else {
                            targetGroup.style.display = 'none';
                        }

                        // Update bands visibility and content
                        this.updateFieldVisibility();
                        if (e.target.value === '2') {
                            this.updateBands();
                        }
                    });
                }
            }
        });

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x46`;
            this.addListener(fieldId, 'change');
        });

        // Add listener for config version change to update bands
        const configVersionField = document.getElementById('field-configVersion-0x46');
        if (configVersionField) {
            configVersionField.addEventListener('change', () => {
                this.updateBands();
            });
        }
    }

    updateBands() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const configVersionElement = document.getElementById('field-configVersion-0x46');
        if (!configVersionElement) return;

        const version = parseInt(configVersionElement.value);
        const bandCount = this.bandCounts[version];
        const container = document.getElementById('eq-bands-container-0x46');

        if (!container) return;

        let html = `<fieldset><legend>${isZh ? '均衡器频段设置 (增益值: -12 到 +12 dB)' : 'Equalizer Band Settings (Gain: -12 to +12 dB)'}</legend>`;

        for (let i = 0; i < bandCount; i++) {
            const frequency = this.getFrequencyLabel(version, i);
            html += `
                <div class="form-group">
                    <label for="band-${i}-0x46">${frequency}:</label>
                    <input type="number" id="band-${i}-0x46" min="-12" max="12" value="0" step="1" style="width: 80px;">
                    <span>dB</span>
                </div>
            `;
        }

        html += '</fieldset>';
        container.innerHTML = html;

        // Add listeners for band inputs
        for (let i = 0; i < bandCount; i++) {
            const bandInput = document.getElementById(`band-${i}-0x46`);
            if (bandInput) {
                bandInput.addEventListener('input', () => {
                    if (typeof generateOutput === 'function') generateOutput();
                });
            }
        }
    }

    getFrequencyLabel(version, bandIndex) {
        const frequencies = {
            1: ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'],
            2: ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz'],
            3: ['31Hz', '62Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz']
        };

        return frequencies[version][bandIndex] || `Band ${bandIndex + 1}`;
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: get request version
            const requestVersionElement = document.getElementById('field-requestVersion-0x46');
            if (!requestVersionElement) return [];
            const version = parseInt(requestVersionElement.value);
            return [version];
        } else {
            // RESPONSE: config version + band gains
            const configVersionElement = document.getElementById('field-configVersion-0x46');
            if (!configVersionElement) return [];

            const version = parseInt(configVersionElement.value);
            const bandCount = this.bandCounts[version];
            const payload = [version];

            // 添加每个频段的增益值 (转换为有符号字节)
            for (let i = 0; i < bandCount; i++) {
                const bandInput = document.getElementById(`band-${i}-0x46`);
                const gain = bandInput ? parseInt(bandInput.value) || 0 : 0;
                // 将 -12 到 +12 的范围转换为 0-24，然后转为有符号字节
                const gainByte = Math.max(0, Math.min(24, gain + 12));
                payload.push(gainByte);
            }

            return payload;
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x46');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command46 = Command46;
