/**
 * Command 0x45 - Set Equalizer Mode
 * Handles setting equalizer mode
 */
class Command45 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (set mode)' },
                        { value: '2', label: 'RESPONSE (result status)' }
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
                        value: '0'
                    }
                },
                {
                    id: 'executionStatus',
                    name: 'Execution Status',
                    options: [
                        { value: '0x00', label: 'SUCCESS' },
                        { value: '0x01', label: 'FAILED' },
                        { value: '0x02', label: 'INVALID_MODE' }
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
        console.log('Command45 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command45 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x45`;
            const groupId = `field-group-${field.id}-0x45`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Equalizer Mode') fieldName = '均衡器模式';
                else if (fieldName === 'Execution Status') fieldName = '执行状态';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize labels
                if (isZh) {
                    // Equalizer mode translations
                    const eqTranslations = {
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
                    // Status translations
                    const statusTranslations = {
                        'SUCCESS': 'SUCCESS (成功)',
                        'FAILED': 'FAILED (失败)',
                        'INVALID_MODE': 'INVALID_MODE (模式无效)'
                    };
                    label = eqTranslations[label] || statusTranslations[label] || label;
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
        // Set packet type to COMMAND by default (this is a set command)
        const packetTypeField = document.getElementById('field-packetType-0x45');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x45`;
                const targetGroupId = `field-group-${field.id}-0x45`;

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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x45`;
                const targetGroupId = `field-group-${field.id}-0x45`;

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
            const fieldId = `field-${field.id}-0x45`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: get equalizer mode to set
            const equalizerModeElement = document.getElementById('field-equalizerMode-0x45');
            if (!equalizerModeElement) return [];
            const equalizerMode = parseInt(equalizerModeElement.value, 16);
            return [equalizerMode];
        } else {
            // RESPONSE: execution status
            const executionStatusElement = document.getElementById('field-executionStatus-0x45');
            if (!executionStatusElement) return [];
            const executionStatus = parseInt(executionStatusElement.value, 16);
            return [executionStatus];
        }
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x45');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command45 = Command45;
