/**
 * Command 0x00 - Device Type Query/Response
 * Handles device type information queries and responses
 * Version: 2.0 - Added conditional fields and dynamic field management
 */
class Command00 extends BaseCommand {
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

        // Show modal instead of inline editing
        this.showEditModal();
    }

    showEditModal() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in renderEditMode, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Create modal HTML
        const modalHtml = `
            <div class="modal-overlay" id="edit-modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${isZh ? '编辑 0x00 命令构建器' : 'Edit 0x00 Command Builder'}</h3>
                        <button class="modal-close" onclick="window.currentCommandHandler.closeEditModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-left-panel">
                            <h4>${isZh ? '字段列表' : 'Fields'}</h4>
                            <div id="field-list">
                                ${this.renderFieldList(isZh)}
                            </div>
                            <button type="button" class="button" onclick="window.currentCommandHandler.addField()" style="width: 100%; margin-top: 1rem;">
                                ${isZh ? '添加新字段' : 'Add New Field'}
                            </button>
                        </div>
                        <div class="modal-right-panel">
                            <div id="options-panel">
                                <div class="no-field-selected">
                                    ${isZh ? '请选择左侧的字段来编辑选项' : 'Select a field from the left to edit options'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" onclick="window.currentCommandHandler.closeEditModal()">
                            ${isZh ? '取消' : 'Cancel'}
                        </button>
                        <button type="button" class="button" onclick="window.currentCommandHandler.saveModalChanges()">
                            ${isZh ? '保存' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Initialize with first field selected if available
        if (this.config.fields.length > 0) {
            this.selectField(0);
        }
    }

    renderFieldList(isZh) {
        return this.config.fields.map((field, index) => `
            <div class="field-list-item" data-field-index="${index}" onclick="window.currentCommandHandler.selectField(${index})">
                <div class="field-name">${field.name || 'Unnamed Field'}</div>
                <div class="field-actions">
                    <button class="delete-field-btn" onclick="event.stopPropagation(); window.currentCommandHandler.removeField(${index})">
                        ${isZh ? '删除' : 'Delete'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    selectField(fieldIndex) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Update field list selection
        document.querySelectorAll('.field-list-item').forEach(item => item.classList.remove('active'));
        const selectedItem = document.querySelector(`[data-field-index="${fieldIndex}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Update options panel
        const field = this.config.fields[fieldIndex];
        if (!field) return;

        const optionsPanel = document.getElementById('options-panel');
        const conditionHtml = this.renderConditionEditor(field, fieldIndex, isZh);

        optionsPanel.innerHTML = `
            <div class="field-name-editor">
                <label>${isZh ? '字段名称:' : 'Field Name:'}</label>
                <input type="text" value="${field.name || ''}" placeholder="${isZh ? '输入字段名称' : 'Enter field name'}"
                       onchange="window.currentCommandHandler.updateFieldName(${fieldIndex}, this.value)">
            </div>

            ${conditionHtml}

            <div class="option-list">
                <h5>${isZh ? '选项列表' : 'Options'}</h5>
                <div id="option-items">
                    ${field.options.map((opt, optIndex) => `
                        <div class="option-list-item" data-option-index="${optIndex}">
                            <input type="text" value="${opt.value || ''}" placeholder="${isZh ? '值' : 'Value'}"
                                   onchange="window.currentCommandHandler.updateOption(${fieldIndex}, ${optIndex}, 'value', this.value)">
                            <input type="text" value="${opt.label || ''}" placeholder="${isZh ? '标签' : 'Label'}"
                                   onchange="window.currentCommandHandler.updateOption(${fieldIndex}, ${optIndex}, 'label', this.value)">
                            <button type="button" class="cancel-btn" onclick="window.currentCommandHandler.removeOption(${fieldIndex}, ${optIndex})">
                                ${isZh ? '删除' : 'Delete'}
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="button" onclick="window.currentCommandHandler.addOption(${fieldIndex})" style="width: 100%; margin-top: 0.5rem;">
                    ${isZh ? '添加选项' : 'Add Option'}
                </button>
            </div>
        `;
    }

    renderConditionEditor(field, fieldIndex, isZh) {
        const otherFields = this.config.fields.filter((_, idx) => idx !== fieldIndex);

        return `
            <div class="condition-editor">
                <h5>${isZh ? '显示条件' : 'Show Condition'}</h5>
                <div class="condition-controls">
                    <label>${isZh ? '当字段' : 'When field'}</label>
                    <select onchange="window.currentCommandHandler.updateCondition(${fieldIndex}, 'fieldId', this.value)">
                        <option value="">${isZh ? '无条件' : 'No condition'}</option>
                        ${otherFields.map(f => `
                            <option value="${f.id}" ${field.showWhen && field.showWhen.fieldId === f.id ? 'selected' : ''}>
                                ${f.name}
                            </option>
                        `).join('')}
                    </select>
                    <label>${isZh ? '的值为' : 'equals'}</label>
                    <input type="text" value="${field.showWhen ? field.showWhen.value || '' : ''}"
                           placeholder="${isZh ? '值' : 'Value'}"
                           onchange="window.currentCommandHandler.updateCondition(${fieldIndex}, 'value', this.value)">
                    <label>${isZh ? '时显示' : 'then show'}</label>
                </div>
            </div>
        `;
    }

    editFieldName(fieldIndex) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        const field = this.config.fields[fieldIndex];

        const newName = prompt(isZh ? '请输入字段名称:' : 'Enter field name:', field.name);
        if (newName && newName.trim()) {
            field.name = newName.trim();
            this.refreshModal();
        }
    }

    updateFieldName(fieldIndex, newName) {
        if (this.config.fields[fieldIndex] && newName.trim()) {
            this.config.fields[fieldIndex].name = newName.trim();

            // Update the field list display
            const fieldItem = document.querySelector(`[data-field-index="${fieldIndex}"] .field-name`);
            if (fieldItem) {
                fieldItem.textContent = newName.trim();
            }
        }
    }

    updateOption(fieldIndex, optionIndex, property, value) {
        if (this.config.fields[fieldIndex] && this.config.fields[fieldIndex].options[optionIndex]) {
            this.config.fields[fieldIndex].options[optionIndex][property] = value;
        }
    }

    updateCondition(fieldIndex, property, value) {
        const field = this.config.fields[fieldIndex];
        if (!field) return;

        if (property === 'fieldId' && !value) {
            // Remove condition
            delete field.showWhen;
        } else {
            // Create or update condition
            if (!field.showWhen) {
                field.showWhen = {};
            }
            field.showWhen[property] = value;
        }
    }

    refreshModal() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Update field list
        const fieldList = document.getElementById('field-list');
        if (fieldList) {
            fieldList.innerHTML = this.renderFieldList(isZh);
        }

        // Re-select current field if it still exists
        const activeItem = document.querySelector('.field-list-item.active');
        if (activeItem) {
            const fieldIndex = parseInt(activeItem.dataset.fieldIndex);
            if (fieldIndex < this.config.fields.length) {
                this.selectField(fieldIndex);
            } else if (this.config.fields.length > 0) {
                this.selectField(0);
            }
        }
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal-overlay');
        if (modal) {
            modal.remove();
        }

        // Reset edit mode
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
    }

    saveModalChanges() {
        this.saveChanges();
        this.closeEditModal();
    }

    // Add new field
    addField() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const fieldName = prompt(isZh ? '请输入字段名称:' : 'Enter field name:', isZh ? '新字段' : 'New Field');
        if (!fieldName || !fieldName.trim()) return;

        const newField = {
            id: `field_${Date.now()}`,
            name: fieldName.trim(),
            options: [
                { value: '0', label: isZh ? '选项1' : 'Option 1' }
            ]
        };

        this.config.fields.push(newField);

        // Refresh modal if it's open
        if (document.getElementById('edit-modal-overlay')) {
            this.refreshModal();
            // Select the new field
            this.selectField(this.config.fields.length - 1);
        }
    }

    // Remove field
    removeField(fieldIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';
            const field = this.config.fields[fieldIndex];

            const confirmMessage = isZh ?
                `确定要删除字段 "${field.name}" 吗？` :
                `Are you sure you want to delete field "${field.name}"?`;

            if (confirm(confirmMessage)) {
                this.config.fields.splice(fieldIndex, 1);

                // Refresh modal if it's open
                if (document.getElementById('edit-modal-overlay')) {
                    this.refreshModal();
                }
            }
        }
    }

    // Add option to field
    addOption(fieldIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            const newOption = {
                value: '',
                label: isZh ? '新选项' : 'New Option'
            };

            this.config.fields[fieldIndex].options.push(newOption);

            // Refresh the options panel
            this.selectField(fieldIndex);
        }
    }

    // Remove option from field
    removeOption(fieldIndex, optionIndex) {
        if (fieldIndex >= 0 && fieldIndex < this.config.fields.length) {
            const field = this.config.fields[fieldIndex];
            if (optionIndex >= 0 && optionIndex < field.options.length) {
                field.options.splice(optionIndex, 1);

                // Refresh the options panel
                this.selectField(fieldIndex);
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
