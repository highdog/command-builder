/**
 * Command 0x0A - Set LE Configurations
 * Handles setting LE (Low Energy) configurations
 */
class Command0A extends BaseCommand {
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
                        { value: '0', label: 'COMMAND' },
                        { value: '2', label: 'RESPONSE' }
                    ]
                },
                {
                    id: 'googleFastPair',
                    name: 'Google Fast Pair',
                    options: [
                        { value: '0', label: 'On' },
                        { value: '1', label: 'Off' }
                    ]
                },
                {
                    id: 'leAudio',
                    name: 'LE Audio',
                    options: [
                        { value: '0', label: 'On' },
                        { value: '1', label: 'Off' }
                    ]
                }
            ]
        };
    }

    render(container) {
        console.log('Command0A render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command0A render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x0a`;
            const groupId = `field-group-${field.id}-0x0a`;

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize common labels
                if (isZh) {
                    if (label === 'On') label = '开启 (ON)';
                    else if (label === 'Off') label = '关闭 (OFF)';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            const fieldHtml = `
                <div class="form-group" id="${groupId}">
                    <label for="${fieldId}">${field.name}:</label>
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
        const packetTypeField = document.getElementById('field-packetType-0x0a');
        if (packetTypeField) {
            packetTypeField.value = '0';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set Google Fast Pair to On by default
        const googleFastPairField = document.getElementById('field-googleFastPair-0x0a');
        if (googleFastPairField) {
            googleFastPairField.value = '0';
            googleFastPairField.dispatchEvent(new Event('change'));
        }

        // Set LE Audio to Off by default
        const leAudioField = document.getElementById('field-leAudio-0x0a');
        if (leAudioField) {
            leAudioField.value = '1';
            leAudioField.dispatchEvent(new Event('change'));
        }
    }

    attachListeners() {
        // Add listeners for all fields to trigger output generation
        this.config.fields.forEach(field => {
            const fieldId = `field-${field.id}-0x0a`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const googleFastPairElement = document.getElementById('field-googleFastPair-0x0a');
        const leAudioElement = document.getElementById('field-leAudio-0x0a');

        if (!googleFastPairElement || !leAudioElement) return [];

        const googleFastPair = googleFastPairElement.value || '0';
        const leAudio = leAudioElement.value || '1'; // Default OFF

        // Build the byte according to bit specification
        let configByte = 0;

        // Bit 0: GOOGLE_FAST_PAIR status (0=ON, 1=OFF)
        if (googleFastPair === '1') {
            configByte |= 0x01; // Set bit 0 for OFF
        }
        // Bit 0 remains 0 for ON (default)

        // Bit 1: LE_AUDIO status (0=ON, 1=OFF)
        if (leAudio === '1') {
            configByte |= 0x02; // Set bit 1 for OFF
        }
        // Bit 1 remains 0 for ON

        // Bits 2-7: Placeholder (000000)
        // Already 0 by default

        // Both COMMAND and RESPONSE have the same payload format
        return [configByte];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x0a');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// 注册命令
window.Command0A = Command0A;
