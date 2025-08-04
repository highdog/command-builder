/**
 * Command 0x00 - Device Type Query/Response
 * Handles device type information queries and responses
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
            packetTypeOptions: [
                { value: "0", label: "COMMAND (get)" },
                { value: "2", label: "RESPONSE (device reply)" }
            ],
            deviceTypeOptions: [
                { value: "0x00", label: "VERIO_100" },
                { value: "0x01", label: "VERIO_200" },
                { value: "0x02", label: "VERIO_300" },
                { value: "0x03", label: "AVENTHO_300" }
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
                this.config = savedConfig;

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

    render(container) {
        console.log('Command00 render called with container:', container);
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const packetTypeOptions = this.config.packetTypeOptions.map(opt =>
            `<option value="${opt.value}"${opt.value === "2" ? " selected" : ""}>${opt.label}</option>`
        ).join('');

        const deviceTypeOptions = this.config.deviceTypeOptions.map(opt =>
            `<option value="${opt.value}">${opt.label}</option>`
        ).join('');

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x00">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x00" class="payload-input">
                    ${packetTypeOptions}
                </select>
            </div>
            <div id="response-options-0x00">
                <div class="form-group">
                    <label for="field-device-type-0x00">${isZh ? '设备型号:' : 'Device Type:'}</label>
                    <select id="field-device-type-0x00" class="payload-input">
                        ${deviceTypeOptions}
                    </select>
                </div>
            </div>
        `;

        console.log('Setting container innerHTML:', html);
        container.innerHTML = html;

        // Verify elements were created
        setTimeout(() => {
            const packetTypeEl = document.getElementById('field-packet-type-0x00');
            const deviceTypeEl = document.getElementById('field-device-type-0x00');
            console.log('After render - packet type element:', packetTypeEl);
            console.log('After render - device type element:', deviceTypeEl);
        }, 100);

        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x00', 'change', (e) => {
            document.getElementById('response-options-0x00').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];

        const deviceTypeElement = document.getElementById('field-device-type-0x00');
        if (!deviceTypeElement) {
            console.warn('Device type element not found, returning empty payload');
            return [];
        }

        return [parseInt(deviceTypeElement.value, 16)];
    }

    getPacketType() {
        const element = document.getElementById('field-packet-type-0x00');
        if (!element) {
            console.warn('Packet type element not found, returning default value 2');
            return 2; // Default to RESPONSE
        }
        return parseInt(element.value, 10);
    }

    // Admin edit functionality
    canEdit() {
        return window.isAdmin || false;
    }

    renderEditMode(container) {
        if (!this.canEdit()) return;

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="builder-edit-mode">
                <h5>${isZh ? '编辑 0x00 命令构建器' : 'Edit 0x00 Command Builder'}</h5>

                <div class="option-editor">
                    <h6>${isZh ? '数据包类型选项:' : 'Packet Type Options:'}</h6>
                    <div id="packet-type-options">
                        ${this.config.packetTypeOptions.map((opt, index) => `
                            <div class="option-item">
                                <input type="text" value="${opt.value}" placeholder="值" data-field="value" data-index="${index}">
                                <input type="text" value="${opt.label}" placeholder="标签" data-field="label" data-index="${index}">
                                <button type="button" class="button" onclick="window.currentCommandHandler.removeOption('packetType', ${index})">删除</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="button" onclick="window.currentCommandHandler.addOption('packetType')">添加选项</button>
                </div>

                <div class="option-editor">
                    <h6>${isZh ? '设备型号选项:' : 'Device Type Options:'}</h6>
                    <div id="device-type-options">
                        ${this.config.deviceTypeOptions.map((opt, index) => `
                            <div class="option-item">
                                <input type="text" value="${opt.value}" placeholder="值" data-field="value" data-index="${index}">
                                <input type="text" value="${opt.label}" placeholder="标签" data-field="label" data-index="${index}">
                                <button type="button" class="button" onclick="window.currentCommandHandler.removeOption('deviceType', ${index})">删除</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="button" onclick="window.currentCommandHandler.addOption('deviceType')">添加选项</button>
                </div>


            </div>
        `;

        container.innerHTML = html;
    }

    addOption(type) {
        const containerId = type === 'packetType' ? 'packet-type-options' : 'device-type-options';
        const container = document.getElementById(containerId);
        const index = container.children.length;

        const optionHtml = `
            <div class="option-item">
                <input type="text" value="" placeholder="值" data-field="value" data-index="${index}">
                <input type="text" value="" placeholder="标签" data-field="label" data-index="${index}">
                <button type="button" class="button" onclick="window.currentCommandHandler.removeOption('${type}', ${index})">删除</button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', optionHtml);
    }

    removeOption(type, index) {
        const containerId = type === 'packetType' ? 'packet-type-options' : 'device-type-options';
        const container = document.getElementById(containerId);
        const items = container.querySelectorAll('.option-item');
        if (items[index]) {
            items[index].remove();
        }
    }



    collectConfig() {
        const packetTypeContainer = document.getElementById('packet-type-options');
        const deviceTypeContainer = document.getElementById('device-type-options');

        const config = {
            packetTypeOptions: [],
            deviceTypeOptions: []
        };

        // Collect packet type options
        packetTypeContainer.querySelectorAll('.option-item').forEach(item => {
            const value = item.querySelector('[data-field="value"]').value;
            const label = item.querySelector('[data-field="label"]').value;
            if (value && label) {
                config.packetTypeOptions.push({ value, label });
            }
        });

        // Collect device type options
        deviceTypeContainer.querySelectorAll('.option-item').forEach(item => {
            const value = item.querySelector('[data-field="value"]').value;
            const label = item.querySelector('[data-field="label"]').value;
            if (value && label) {
                config.deviceTypeOptions.push({ value, label });
            }
        });

        return config;
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
