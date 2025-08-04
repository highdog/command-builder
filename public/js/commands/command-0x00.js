/**
 * Command 0x00 - Device Type Query/Response
 * Handles device type information queries and responses
 * Version: 2.0 - Added conditional fields and dynamic field management
 */
class Command00 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        this.config = this.getDefaultConfig();
        this.loadConfigFromServer();
    }

    // Get default configuration
    getDefaultConfig() {
        return {
            fields: [
                {
                    id: 'packetType',
                    name: 'Packet Type',
                    options: [
                        { value: "0", label: "COMMAND (get)" },
                        { value: "2", label: "RESPONSE (device reply)" }
                    ]
                },
                {
                    id: 'deviceType',
                    name: 'Device Type',
                    options: [
                        { value: "0x00", label: "VERIO_100" },
                        { value: "0x01", label: "VERIO_200" },
                        { value: "0x02", label: "VERIO_300" },
                        { value: "0x03", label: "AVENTHO_300" }
                    ],
                    // 显示条件：当packetType字段的值为"2"时显示
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2'
                    }
                }
            ]
        };
    }

    // Load configuration from server
    async loadConfigFromServer() {
        try {
            const response = await fetch('/api/commands/0x00/builder-config');
            if (response.ok) {
                const savedConfig = await response.json();
                console.log('Loaded saved config from server:', savedConfig);

                // Convert old format to new format if needed
                this.config = this.migrateConfig(savedConfig);
                console.log('Config after migration:', this.config);

                // Re-render only if this command is currently active
                const container = document.getElementById('payload-builder-container');
                if (container && container.innerHTML.trim() !== '' && window.currentCommand && window.currentCommand.hex_id === '0x00') {
                    console.log('Re-rendering 0x00 with loaded config');
                    this.render(container);
                } else {
                    console.log('Not re-rendering 0x00 - either no content or different command active');
                }
            } else if (response.status === 404) {
                console.log('No saved config found, using defaults');
            } else {
                console.error('Failed to load config:', response.status);
            }
        } catch (error) {
            console.error('Error loading config from server:', error);
        }
    }

    // Migrate old config format to new format
    migrateConfig(config) {
        // If it's already in new format, return as is
        if (config.fields && Array.isArray(config.fields)) {
            return config;
        }

        // Convert old format to new format
        const fields = [];

        if (config.packetTypeOptions && Array.isArray(config.packetTypeOptions)) {
            fields.push({
                id: 'packetType',
                name: 'Packet Type',
                options: config.packetTypeOptions
            });
        }

        if (config.deviceTypeOptions && Array.isArray(config.deviceTypeOptions)) {
            fields.push({
                id: 'deviceType',
                name: 'Device Type',
                options: config.deviceTypeOptions,
                // 添加默认的显示条件
                showWhen: {
                    fieldId: 'packetType',
                    value: '2'
                }
            });
        }

        // If no valid fields found, use defaults
        if (fields.length === 0) {
            return this.getDefaultConfig();
        }

        return { fields };
    }

    render(container) {
        console.log('Command00 render called with container:', container);
        console.log('Current config:', this.config);

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config structure, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate HTML for all fields
        const fieldsHtml = this.config.fields.map(field => {
            // Safety check for field structure
            if (!field || !field.options || !Array.isArray(field.options)) {
                console.warn('Invalid field structure:', field);
                return '';
            }

            const options = field.options.map(opt =>
                `<option value="${opt.value || ''}">${opt.label || 'Unknown'}</option>`
            ).join('');

            // Check if field has display condition
            let displayStyle = '';
            if (field.showWhen) {
                // Initially hide conditional fields
                displayStyle = ' style="display: none;"';
            }

            return `
                <div class="form-group" id="field-group-${field.id}-0x00"${displayStyle}>
                    <label for="field-${field.id}-0x00">${field.name || 'Unknown Field'}:</label>
                    <select id="field-${field.id}-0x00" class="payload-input">
                        ${options}
                    </select>
                </div>
            `;
        }).filter(html => html !== '').join('');

        const html = `<div class="dynamic-fields">${fieldsHtml}</div>`;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        this.attachListeners();
    }

    attachListeners() {
        // Add listeners for conditional field display
        this.config.fields.forEach(field => {
            const element = document.getElementById(`field-${field.id}-0x00`);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.updateConditionalFields(field.id, e.target.value);
                });
            }
        });

        // Initialize conditional field visibility
        this.updateAllConditionalFields();
    }

    // Update visibility of fields that depend on the changed field
    updateConditionalFields(changedFieldId, newValue) {
        this.config.fields.forEach(field => {
            if (field.showWhen && field.showWhen.fieldId === changedFieldId) {
                const fieldGroup = document.getElementById(`field-group-${field.id}-0x00`);
                if (fieldGroup) {
                    const shouldShow = field.showWhen.value === newValue;
                    fieldGroup.style.display = shouldShow ? 'block' : 'none';
                }
            }
        });
    }

    // Update all conditional fields based on current values
    updateAllConditionalFields() {
        this.config.fields.forEach(controlField => {
            const controlElement = document.getElementById(`field-${controlField.id}-0x00`);
            if (controlElement) {
                this.updateConditionalFields(controlField.id, controlElement.value);
            }
        });
    }

    getPayload() {
        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.warn('Invalid config in getPayload, returning empty payload');
            return [];
        }

        // Find packet type field
        const packetTypeField = this.config.fields.find(f => f && f.id === 'packetType');
        if (packetTypeField) {
            const packetTypeElement = document.getElementById(`field-${packetTypeField.id}-0x00`);
            if (packetTypeElement && parseInt(packetTypeElement.value, 10) === 0) {
                return [];
            }
        }

        // Collect values from all fields except packet type
        const payload = [];
        this.config.fields.forEach(field => {
            if (field && field.id && field.id !== 'packetType') {
                const element = document.getElementById(`field-${field.id}-0x00`);
                if (element && element.value) {
                    // Try to parse as hex first, then as decimal
                    const value = element.value.startsWith('0x') ?
                        parseInt(element.value, 16) :
                        parseInt(element.value, 10);
                    if (!isNaN(value)) {
                        payload.push(value);
                    }
                }
            }
        });

        return payload;
    }

    getPacketType() {
        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.warn('Invalid config in getPacketType, returning default value 2');
            return 2;
        }

        const packetTypeField = this.config.fields.find(f => f && f.id === 'packetType');
        if (packetTypeField) {
            const element = document.getElementById(`field-${packetTypeField.id}-0x00`);
            if (element) {
                return parseInt(element.value, 10);
            }
        }

        console.warn('Packet type field not found, returning default value 2');
        return 2; // Default to RESPONSE
    }

    // Admin edit functionality
    canEdit() {
        return window.isAdmin || false;
    }

    renderEditMode(container) {
        if (!this.canEdit()) return;

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in renderEditMode, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate field editors
        const fieldEditorsHtml = this.config.fields.map((field, fieldIndex) => {
            // Safety check for field structure
            if (!field || !field.options || !Array.isArray(field.options)) {
                console.warn('Invalid field structure in renderEditMode:', field);
                return '';
            }

            // Generate condition editor
            const conditionEditor = field.showWhen ? `
                <div class="condition-editor">
                    <h6>${isZh ? '显示条件:' : 'Show Condition:'}</h6>
                    <div class="condition-controls">
                        <label>${isZh ? '当字段' : 'When field'}</label>
                        <select class="condition-field" data-field-index="${fieldIndex}">
                            <option value="">${isZh ? '无条件' : 'No condition'}</option>
                            ${this.config.fields.map((f, idx) =>
                                idx !== fieldIndex ? `<option value="${f.id}" ${field.showWhen.fieldId === f.id ? 'selected' : ''}>${f.name}</option>` : ''
                            ).join('')}
                        </select>
                        <label>${isZh ? '的值为' : 'equals'}</label>
                        <input type="text" class="condition-value" value="${field.showWhen.value || ''}"
                               placeholder="${isZh ? '值' : 'Value'}" data-field-index="${fieldIndex}">
                        <label>${isZh ? '时显示' : 'then show'}</label>
                    </div>
                </div>
            ` : `
                <div class="condition-editor">
                    <h6>${isZh ? '显示条件:' : 'Show Condition:'}</h6>
                    <div class="condition-controls">
                        <label>${isZh ? '当字段' : 'When field'}</label>
                        <select class="condition-field" data-field-index="${fieldIndex}">
                            <option value="">${isZh ? '无条件' : 'No condition'}</option>
                            ${this.config.fields.map((f, idx) =>
                                idx !== fieldIndex ? `<option value="${f.id}">${f.name}</option>` : ''
                            ).join('')}
                        </select>
                        <label>${isZh ? '的值为' : 'equals'}</label>
                        <input type="text" class="condition-value" value=""
                               placeholder="${isZh ? '值' : 'Value'}" data-field-index="${fieldIndex}">
                        <label>${isZh ? '时显示' : 'then show'}</label>
                    </div>
                </div>
            `;

            return `
            <div class="field-editor" data-field-index="${fieldIndex}">
                <div class="field-header">
                    <input type="text" value="${field.name || ''}" placeholder="${isZh ? '字段名称' : 'Field Name'}"
                           class="field-name-input" data-field-index="${fieldIndex}">
                    <button type="button" class="cancel-btn" onclick="window.currentCommandHandler.removeField(${fieldIndex})">${isZh ? '删除字段' : 'Delete Field'}</button>
                </div>

                ${conditionEditor}

                <div class="option-editor">
                    <h6>${isZh ? '选项:' : 'Options:'}</h6>
                    <div class="field-options" data-field-index="${fieldIndex}">
                        ${field.options.map((opt, optIndex) => `
                            <div class="option-item">
                                <input type="text" value="${opt.value || ''}" placeholder="${isZh ? '值' : 'Value'}" data-field="value" data-option-index="${optIndex}">
                                <input type="text" value="${opt.label || ''}" placeholder="${isZh ? '标签' : 'Label'}" data-field="label" data-option-index="${optIndex}">
                                <button type="button" class="button" onclick="window.currentCommandHandler.removeOption(${fieldIndex}, ${optIndex})">${isZh ? '删除' : 'Delete'}</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="button" onclick="window.currentCommandHandler.addOption(${fieldIndex})">${isZh ? '添加选项' : 'Add Option'}</button>
                </div>
            </div>
            `;
        }).filter(html => html !== '').join('');

        const html = `
            <div class="builder-edit-mode">
                <h5>${isZh ? '编辑 0x00 命令构建器' : 'Edit 0x00 Command Builder'}</h5>

                <div class="fields-container">
                    ${fieldEditorsHtml}
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
                    <button type="button" class="button" onclick="window.currentCommandHandler.addField()">${isZh ? '添加新字段' : 'Add New Field'}</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Add new field
    addField() {
        const newField = {
            id: `field_${Date.now()}`,
            name: 'New Field',
            options: [
                { value: '0', label: 'Option 1' }
            ]
        };

        this.config.fields.push(newField);

        // Re-render edit mode
        const container = document.getElementById('payload-builder-container');
        this.renderEditMode(container);
    }

    // Remove field
    removeField(fieldIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            this.config.fields.splice(fieldIndex, 1);

            // Re-render edit mode
            const container = document.getElementById('payload-builder-container');
            this.renderEditMode(container);
        }
    }

    // Add option to field
    addOption(fieldIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            const newOption = {
                value: '',
                label: 'New Option'
            };

            this.config.fields[fieldIndex].options.push(newOption);

            // Re-render edit mode
            const container = document.getElementById('payload-builder-container');
            this.renderEditMode(container);
        }
    }

    // Remove option from field
    removeOption(fieldIndex, optionIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            const field = this.config.fields[fieldIndex];
            if (optionIndex >= 0 && optionIndex < field.options.length) {
                field.options.splice(optionIndex, 1);

                // Re-render edit mode
                const container = document.getElementById('payload-builder-container');
                this.renderEditMode(container);
            }
        }
    }



    collectConfig() {
        const fields = [];

        // Collect field names
        const fieldNameInputs = document.querySelectorAll('.field-name-input');
        fieldNameInputs.forEach((nameInput, fieldIndex) => {
            const fieldName = nameInput.value || `Field ${fieldIndex + 1}`;
            const fieldId = this.config.fields[fieldIndex] ? this.config.fields[fieldIndex].id : `field_${fieldIndex}`;

            // Collect options for this field
            const options = [];
            const fieldOptionsContainer = document.querySelector(`.field-options[data-field-index="${fieldIndex}"]`);
            if (fieldOptionsContainer) {
                const optionItems = fieldOptionsContainer.querySelectorAll('.option-item');
                optionItems.forEach(item => {
                    const value = item.querySelector('[data-field="value"]').value;
                    const label = item.querySelector('[data-field="label"]').value;
                    if (value && label) {
                        options.push({ value, label });
                    }
                });
            }

            // Collect condition configuration
            const conditionField = document.querySelector(`.condition-field[data-field-index="${fieldIndex}"]`);
            const conditionValue = document.querySelector(`.condition-value[data-field-index="${fieldIndex}"]`);

            const field = {
                id: fieldId,
                name: fieldName,
                options: options
            };

            // Add condition if specified
            if (conditionField && conditionValue && conditionField.value && conditionValue.value) {
                field.showWhen = {
                    fieldId: conditionField.value,
                    value: conditionValue.value
                };
            }

            fields.push(field);
        });

        return { fields };
    }

    async saveChanges() {
        const config = this.collectConfig();
        console.log('Saving config:', config);

        try {
            const url = '/api/commands/0x00/builder-config';
            console.log('Posting to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                // Update the configuration
                this.config = config;
                console.log('Configuration saved and updated:', config);
                this.showNotification('构建器配置已保存', 'success');
                this.exitEditMode();
            } else {
                this.showNotification('保存失败: ' + (data.error || '未知错误'), 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('保存失败: ' + error.message, 'error');
        }
    }

    cancelEdit() {
        console.log('Canceling edit mode');
        this.exitEditMode();
    }

    exitEditMode() {
        // Reset the global edit mode flag
        window.builderEditMode = false;

        // Restore original header
        const builderHeader = document.querySelector('.payload-builder-header');
        if (builderHeader) {
            builderHeader.innerHTML = `
                <button id="edit-builder-btn" class="edit-btn" style="display: inline-block;" onclick="toggleBuilderEditMode()">
                    <span data-i18n="admin.editBuilder">Edit</span>
                </button>
            `;
        }

        const container = document.getElementById('payload-builder-container');
        this.render(container);
    }

    showNotification(message, type = 'info') {
        // Use the global notification function if available
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Register the command class globally
window.Command00 = Command00;
