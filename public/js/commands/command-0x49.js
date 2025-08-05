/**
 * Command 0x49 - Play Status
 * Handles play status queries, responses and notifications
 */
class Command49 extends BaseCommand {
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
                        { value: '0', label: 'COMMAND (get status)' },
                        { value: '2', label: 'RESPONSE (device reply)' },
                        { value: '1', label: 'NOTIFICATION (status change)' }
                    ]
                },
                {
                    id: 'playState',
                    name: 'Play State',
                    options: [
                        { value: '0x00', label: 'STOPPED' },
                        { value: '0x01', label: 'PLAYING' },
                        { value: '0x02', label: 'PAUSED' },
                        { value: '0x03', label: 'FAST_FORWARD' },
                        { value: '0x04', label: 'REWIND' },
                        { value: '0xFF', label: 'UNKNOWN' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'audioSource',
                    name: 'Audio Source',
                    options: [
                        { value: '0x00', label: 'BLUETOOTH' },
                        { value: '0x01', label: 'AUX' },
                        { value: '0x02', label: 'USB' },
                        { value: '0x03', label: 'SD_CARD' },
                        { value: '0x04', label: 'FM_RADIO' },
                        { value: '0x05', label: 'INTERNAL' },
                        { value: '0xFF', label: 'UNKNOWN' }
                    ],
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'volumeLevel',
                    name: 'Volume Level',
                    type: 'number',
                    min: 0,
                    max: 100,
                    defaultValue: 50,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'trackPosition',
                    name: 'Track Position',
                    type: 'number',
                    min: 0,
                    max: 65535,
                    defaultValue: 0,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'trackDuration',
                    name: 'Track Duration',
                    type: 'number',
                    min: 0,
                    max: 65535,
                    defaultValue: 180,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'shuffleEnabled',
                    name: 'Shuffle Enabled',
                    type: 'checkbox',
                    defaultValue: false,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                },
                {
                    id: 'repeatEnabled',
                    name: 'Repeat Enabled',
                    type: 'checkbox',
                    defaultValue: false,
                    showWhen: {
                        fieldId: 'packetType',
                        value: '2' // Show when not COMMAND
                    }
                }
            ]
        };
    }

    render(container) {
        console.log('Command49 render called with container:', container);
        console.log('Current config:', this.config);

        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        // Safety check for config
        if (!this.config || !this.config.fields || !Array.isArray(this.config.fields)) {
            console.error('Invalid config in Command49 render, using defaults');
            this.config = this.getDefaultConfig();
        }

        // Generate dynamic fields based on configuration
        const fieldsHtml = this.config.fields.map(field => {
            const fieldId = `field-${field.id}-0x49`;
            const groupId = `field-group-${field.id}-0x49`;

            // Determine initial visibility for conditional fields
            let initialStyle = '';
            if (field.showWhen) {
                initialStyle = 'style="display: none;"';
            }

            let fieldName = field.name;
            if (isZh) {
                const translations = {
                    'Play State': '播放状态',
                    'Audio Source': '音频源',
                    'Volume Level': '音量等级',
                    'Track Position': '播放位置',
                    'Track Duration': '曲目总长度',
                    'Shuffle Enabled': '随机播放',
                    'Repeat Enabled': '重复播放'
                };
                fieldName = translations[fieldName] || fieldName;
            }

            let fieldHtml = '';

            if (field.type === 'number') {
                // Number input field
                let unit = '';
                if (field.id === 'volumeLevel') {
                    unit = '%';
                } else if (field.id === 'trackPosition' || field.id === 'trackDuration') {
                    unit = isZh ? `秒 (${field.min}-${field.max})` : `seconds (${field.min}-${field.max})`;
                }

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName} (${field.min}-${field.max}):</label>
                        <input type="number" id="${fieldId}" class="payload-input"
                               min="${field.min || 0}"
                               max="${field.max || 100}"
                               value="${field.defaultValue || 0}"
                               style="width: ${field.id === 'volumeLevel' ? '80px' : '100px'};">
                        <span>${unit}</span>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                // Checkbox field
                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label>
                            <input type="checkbox" id="${fieldId}" class="payload-input"
                                   ${field.defaultValue ? 'checked' : ''}>
                            ${fieldName}
                        </label>
                    </div>
                `;
            } else {
                // Select field
                const optionsHtml = field.options.map(option => {
                    let label = option.label;
                    // Localize labels
                    if (isZh) {
                        const playStateTranslations = {
                            'STOPPED': 'STOPPED (停止)',
                            'PLAYING': 'PLAYING (播放中)',
                            'PAUSED': 'PAUSED (暂停)',
                            'FAST_FORWARD': 'FAST_FORWARD (快进)',
                            'REWIND': 'REWIND (快退)',
                            'UNKNOWN': 'UNKNOWN (未知)'
                        };
                        const audioSourceTranslations = {
                            'BLUETOOTH': 'BLUETOOTH (蓝牙)',
                            'AUX': 'AUX (辅助输入)',
                            'USB': 'USB (USB)',
                            'SD_CARD': 'SD_CARD (SD卡)',
                            'FM_RADIO': 'FM_RADIO (FM收音机)',
                            'INTERNAL': 'INTERNAL (内部存储)',
                            'UNKNOWN': 'UNKNOWN (未知)'
                        };
                        label = playStateTranslations[label] || audioSourceTranslations[label] || label;
                    }
                    return `<option value="${option.value}">${label}</option>`;
                }).join('');

                fieldHtml = `
                    <div class="form-group" id="${groupId}" ${initialStyle}>
                        <label for="${fieldId}">${fieldName}:</label>
                        <select id="${fieldId}" class="payload-input">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            }

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
        const packetTypeField = document.getElementById('field-packetType-0x49');
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x49`;
                const targetGroupId = `field-group-${field.id}-0x49`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    // Show when packetType is not '0' (COMMAND)
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
                const triggerFieldId = `field-${field.showWhen.fieldId}-0x49`;
                const targetGroupId = `field-group-${field.id}-0x49`;

                const triggerElement = document.getElementById(triggerFieldId);
                const targetGroup = document.getElementById(targetGroupId);

                if (triggerElement && targetGroup) {
                    triggerElement.addEventListener('change', (e) => {
                        // Show when packetType is not '0' (COMMAND)
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
            const fieldId = `field-${field.id}-0x49`;
            const eventType = field.type === 'number' ? 'input' :
                             field.type === 'checkbox' ? 'change' : 'change';
            this.addListener(fieldId, eventType);
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - empty payload

        // RESPONSE/NOTIFICATION - return play status information
        const playStateElement = document.getElementById('field-playState-0x49');
        const audioSourceElement = document.getElementById('field-audioSource-0x49');
        const volumeLevelElement = document.getElementById('field-volumeLevel-0x49');
        const trackPositionElement = document.getElementById('field-trackPosition-0x49');
        const trackDurationElement = document.getElementById('field-trackDuration-0x49');
        const shuffleEnabledElement = document.getElementById('field-shuffleEnabled-0x49');
        const repeatEnabledElement = document.getElementById('field-repeatEnabled-0x49');

        const playState = playStateElement ? parseInt(playStateElement.value, 16) : 0x00;
        const audioSource = audioSourceElement ? parseInt(audioSourceElement.value, 16) : 0x00;
        const volumeLevel = volumeLevelElement ? parseInt(volumeLevelElement.value) || 0 : 0;
        const trackPosition = trackPositionElement ? parseInt(trackPositionElement.value) || 0 : 0;
        const trackDuration = trackDurationElement ? parseInt(trackDurationElement.value) || 0 : 0;
        const shuffleEnabled = shuffleEnabledElement ? shuffleEnabledElement.checked : false;
        const repeatEnabled = repeatEnabledElement ? repeatEnabledElement.checked : false;

        // 构建标志字节
        let flags = 0x00;
        if (shuffleEnabled) flags |= 0x01;
        if (repeatEnabled) flags |= 0x02;

        return [
            playState,                      // 播放状态 (1字节)
            audioSource,                    // 音频源 (1字节)
            volumeLevel,                    // 音量等级 (1字节)
            trackPosition & 0xFF,           // 播放位置低字节
            (trackPosition >> 8) & 0xFF,    // 播放位置高字节
            trackDuration & 0xFF,           // 曲目长度低字节
            (trackDuration >> 8) & 0xFF,    // 曲目长度高字节
            flags                           // 标志字节 (1字节)
        ];
    }

    getPacketType() {
        const packetTypeElement = document.getElementById('field-packetType-0x49');
        return packetTypeElement ? parseInt(packetTypeElement.value, 10) : 0;
    }
}

// Register the command class globally
window.Command49 = Command49;
