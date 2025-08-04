/**
 * Command 0x15 - Get Earbuds Color
 * Handles earbuds color queries and responses
 */
class Command15 extends BaseCommand {
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
                    id: 'earbudsColor',
                    name: 'Earbuds Color',
                    options: [
                        { value: '0x00', label: 'Color1' },
                        { value: '0x01', label: 'Color2' },
                        { value: '0x02', label: 'Color3' },
                        { value: '0x03', label: 'Color4' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                },
                {
                    id: 'onlineStatus',
                    name: 'Online Status',
                    options: [
                        { value: '0x01', label: 'Left online, Right offline' },
                        { value: '0x02', label: 'Right online, Left offline' },
                        { value: '0x03', label: 'Both earbuds online' }
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
        console.log('Command15 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command15 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x15`;
            const groupId = `field-group-${field.id}-0x15`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            // Generate options HTML with localized labels
            const optionsHtml = field.options.map(option => {
                let label = option.label;
                // Localize labels
                if (isZh) {
                    if (label === 'Color1') label = '颜色1';
                    else if (label === 'Color2') label = '颜色2';
                    else if (label === 'Color3') label = '颜色3';
                    else if (label === 'Color4') label = '颜色4';
                    else if (label === 'Left online, Right offline') label = '左耳机在线，右耳机离线';
                    else if (label === 'Right online, Left offline') label = '右耳机在线，左耳机离线';
                    else if (label === 'Both earbuds online') label = '两个耳机都在线';
                }
                return `<option value="${option.value}">${label}</option>`;
            }).join('');

            let fieldName = field.name;
            if (isZh) {
                if (fieldName === 'Earbuds Color') fieldName = '耳机颜色';
                else if (fieldName === 'Online Status') fieldName = '在线状态';
            }

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
        const packetTypeField = document.getElementById('field-packetType-0x15');
        if (packetTypeField) {
            packetTypeField.value = '2';
            packetTypeField.dispatchEvent(new Event('change'));
        }

        // Set online status to both earbuds online by default
        const onlineStatusField = document.getElementById('field-onlineStatus-0x15');
        if (onlineStatusField) {
            onlineStatusField.value = '0x03';
            onlineStatusField.dispatchEvent(new Event('change'));
        }

        // Set initial visibility for conditional fields
        this.updateFieldVisibility();
    }

    updateFieldVisibility() {
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x15`;
                const targetGroupId = `field-group-${field.id}-0x15`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Show when packetType is not '0'
                    if (triggerElement.value !== '0') {
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x15`;
                const targetGroupId = `field-group-${field.id}-0x15`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Show when packetType is not '0'
                        if (e.target.value !== '0') {
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
            const fieldId = `field-${field.id}-0x15`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const colorElement = document.getElementById('field-earbudsColor-0x15');
        const onlineStatusElement = document.getElementById('field-onlineStatus-0x15');

        if (!colorElement || !onlineStatusElement) return [];

        const color = parseInt(colorElement.value, 16);
        const onlineStatus = parseInt(onlineStatusElement.value, 16);

        return [color, onlineStatus];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x15');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
    
}

// Register the command class globally
window.Command15 = Command15;