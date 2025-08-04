// 0x01 Register Notification Listeners (注册通知监听器)
class Command01 extends BaseCommand {
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
                }
            ]
        };
    }

    render(container) {
        console.log('Command01 render called with container:', container);
        console.log('Current config:', this.config);
        console.log('CommandEditorMixin available:', typeof CommandEditorMixin);
        console.log('BaseCommand prototype:', Object.getPrototypeOf(this));

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command01 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x01`;
            const groupId = `field-group-${field.id}-0x01`;

            // Generate options HTML
            const optionsHtml = field.options.map(option =>
                `<option value="${option.value}">${option.label}</option>`
            ).join('');

            // Determine initial visibility
            let isVisible = true;
            let style = '';

            if (field.showWhen) {
                isVisible = false;
                style = 'style="display: none;"';
            }

            return `
                <div class="form-group" id="${groupId}" ${style}>
                    <label for="${fieldId}">${field.name}:</label>
                    <select id="${fieldId}" class="payload-input">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        }).join('');

        const html = `<div class="dynamic-fields">
                ${fieldsHtml}
            </div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        this.attachListeners();
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            if (field.showWhen) {
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x01`;
                const targetGroupId = `field-group-${field.id}-0x01`;

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
            const fieldId = `field-${field.id}-0x01`;
            this.addListener(fieldId, 'change');
        });
    }

    getPayload() {
        const packetType = this.getPacketType();

        if (packetType === 0) {
            // COMMAND: Register listeners request payload: constant 0x11
            return [0x11];
        } else {
            // RESPONSE: Empty payload
            return [];
        }
    }

    getPacketType() {
        // Get packet type from first field if it exists
        const firstField = this.config.fields[0];
        if (firstField) {
            const fieldId = `field-${firstField.id}-0x01`;
            const element = document.getElementById(fieldId);
            if (element) {
                return parseInt(element.value, 10);
            }
        }
        return 0; // Default to COMMAND
    }
}

// 注册命令
window.Command01 = Command01;
