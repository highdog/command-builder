/**
 * Command 0x44 - Get Equalizer Mode
 * Handles equalizer mode queries and responses
 */
class Command44 extends BaseCommand {
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
                    id: 'equalizerMode',
                    name: 'Equalizer Mode',
                    options: [
                        { value: '0x00', label: 'OFF' },
                        { value: '0x01', label: 'ROCK' },
                        { value: '0x02', label: 'POP' },
                        { value: '0x03', label: 'JAZZ' },
                        { value: '0x04', label: 'CLASSICAL' },
                        { value: '0x05', label: 'ELECTRONIC' },
                        { value: '0x06', label: 'BASS_BOOST' },
                        { value: '0x07', label: 'TREBLE_BOOST' },
                        { value: '0x08', label: 'VOCAL' },
                        { value: '0x09', label: 'CUSTOM' },
                        { value: '0x0A', label: 'FLAT' },
                        { value: '0x0B', label: 'ACOUSTIC' },
                        { value: '0x0C', label: 'LATIN' },
                        { value: '0x0D', label: 'LOUNGE' },
                        { value: '0x0E', label: 'PIANO' },
                        { value: '0x0F', label: 'R_AND_B' }
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
        console.log('Command44 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command44 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x44`;
            const groupId = `field-group-${field.id}-0x44`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Equalizer Mode') fieldName = '均衡器模式';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize equalizer mode labels
                if (isZh) {
                    const translations = {
                        'OFF': 'OFF (关闭)',
                        'ROCK': 'ROCK (摇滚)',
                        'POP': 'POP (流行)',
                        'JAZZ': 'JAZZ (爵士)',
                        'CLASSICAL': 'CLASSICAL (古典)',
                        'ELECTRONIC': 'ELECTRONIC (电子)',
                        'BASS_BOOST': 'BASS_BOOST (低音增强)',
                        'TREBLE_BOOST': 'TREBLE_BOOST (高音增强)',
                        'VOCAL': 'VOCAL (人声)',
                        'CUSTOM': 'CUSTOM (自定义)',
                        'FLAT': 'FLAT (平坦)',
                        'ACOUSTIC': 'ACOUSTIC (原声)',
                        'LATIN': 'LATIN (拉丁)',
                        'LOUNGE': 'LOUNGE (休闲)',
                        'PIANO': 'PIANO (钢琴)',
                        'R_AND_B': 'R_AND_B (R&B)'
                    };
                    label = translations[label] || label;
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            const fieldHtml = `
                <div class="form-group" id="${groupId}" ${initialStyle}>
                    <label for="${fieldId}">${fieldName}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;

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
        const packetTypeField = document.getElementById('field-packetType-0x44');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x44`;
                const targetGroupId = `field-group-${field.id}-0x44`;

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
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x44`;
                const targetGroupId = `field-group-${field.id}-0x44`;

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

        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x44`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - empty payload

        // RESPONSE - return equalizer mode
        const equalizerModeElement = document.getElementById('field-equalizerMode-0x44');
        if (!equalizerModeElement) return [];

        const equalizerMode = parseInt(equalizerModeElement.value, 16);
        return [equalizerMode];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x44');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command44 = Command44;
