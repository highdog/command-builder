/**
 * Command Editor Mixin
 * Provides common editing functionality for command builders
 */
class CommandEditorMixin {
    /**
     * Show edit modal with field editor
     */
    showEditModal() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error(`Invalid config in renderEditMode for ${this.commandId}, using defaults`);
            this.config = this.getDefaultConfig();
        }

        // Create modal HTML
        const modalHtml = `
            <div class="modal-overlay" id="edit-modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${isZh ? `编辑 ${this.commandId} 命令构建器` : `Edit ${this.commandId} Command Builder`}</h3>
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
    /**
     * Render field list for modal
     * @param {boolean} isZh - Whether to use Chinese labels
     * @returns {string} HTML string for field list
     */
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

    /**
     * Select a field in the modal
     * @param {number} fieldIndex - Index of field to select
     */
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

    /**
     * Render condition editor for a field
     * @param {Object} field - Field object
     * @param {number} fieldIndex - Index of the field
     * @param {boolean} isZh - Whether to use Chinese labels
     * @returns {string} HTML string for condition editor
     */
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

    /**
     * Update field name
     * @param {number} fieldIndex - Index of field to update
     * @param {string} newName - New field name
     */
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

    /**
     * Update option value or label
     * @param {number} fieldIndex - Index of field
     * @param {number} optionIndex - Index of option
     * @param {string} property - Property to update ('value' or 'label')
     * @param {string} value - New value
     */
    updateOption(fieldIndex, optionIndex, property, value) {
        if (this.config.fields[fieldIndex] && this.config.fields[fieldIndex].options[optionIndex]) {
            this.config.fields[fieldIndex].options[optionIndex][property] = value;
        }
    }

    /**
     * Update field condition
     * @param {number} fieldIndex - Index of field
     * @param {string} property - Property to update ('fieldId' or 'value')
     * @param {string} value - New value
     */
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

    /**
     * Add new field
     */
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

    /**
     * Remove field
     * @param {number} fieldIndex - Index of field to remove
     */
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

    /**
     * Add option to field
     * @param {number} fieldIndex - Index of field
     */
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

    /**
     * Remove option from field
     * @param {number} fieldIndex - Index of field
     * @param {number} optionIndex - Index of option to remove
     */
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

    /**
     * Refresh modal content
     */
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

    /**
     * Close edit modal
     */
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

    /**
     * Save modal changes
     */
    saveModalChanges() {
        this.saveChanges();
        this.closeEditModal();
    }

    /**
     * Save changes to server
     */
    async saveChanges() {
        const config = this.collectConfig ? this.collectConfig() : this.config;
        
        try {
            const response = await fetch(`/api/commands/${this.commandId}/builder-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the configuration
                this.config = config;
                console.log(`Configuration saved and updated for ${this.commandId}:`, config);
                this.showNotification('构建器配置已保存', 'success');
                this.exitEditMode();
            } else {
                this.showNotification('保存失败: ' + (data.error || '未知错误'), 'error');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            this.showNotification('保存失败: 网络错误', 'error');
        }
    }

    /**
     * Exit edit mode
     */
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

    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - Type of notification ('success', 'error', 'info')
     */
    showNotification(message, type = 'info') {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Export for use in other modules
window.CommandEditorMixin = CommandEditorMixin;
