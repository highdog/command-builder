/**
 * Command 0x4D - Set Auto Shutdown Time
 * 设置自动关机时间
 */
class Command4D extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_TIME': 0x02,
            'TIME_OUT_OF_RANGE': 0x03
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4d">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x4d" class="payload-input">
                    <option value="0" selected>COMMAND (set time)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x4d">
                <div class="form-group">
                    <label for="field-shutdown-time-0x4d">${isZh ? '自动关机时间:' : 'Auto Shutdown Time:'}</label>
                    <select id="field-shutdown-time-0x4d" class="payload-input">
                        <option value="0">${isZh ? 'DISABLED (禁用)' : 'DISABLED'}</option>
                        <option value="5">${isZh ? '5分钟' : '5 minutes'}</option>
                        <option value="10">${isZh ? '10分钟' : '10 minutes'}</option>
                        <option value="15" selected>${isZh ? '15分钟' : '15 minutes'}</option>
                        <option value="30">${isZh ? '30分钟' : '30 minutes'}</option>
                        <option value="60">${isZh ? '1小时' : '1 hour'}</option>
                        <option value="120">${isZh ? '2小时' : '2 hours'}</option>
                        <option value="180">${isZh ? '3小时' : '3 hours'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-custom-time-0x4d">${isZh ? '自定义时间 (分钟):' : 'Custom Time (minutes):'}</label>
                    <input type="number" id="field-custom-time-0x4d" min="0" max="65535" value="15" style="width: 100px;">
                    <small>${isZh ? '0=禁用，1-65535分钟' : '0=disabled, 1-65535 minutes'}</small>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-use-custom-0x4d">
                        ${isZh ? '使用自定义时间' : 'Use Custom Time'}
                    </label>
                </div>
            </div>
            <div id="response-options-0x4d" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x4d">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x4d" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'INVALID_TIME (时间无效)' : 'INVALID_TIME'}</option>
                        <option value="0x03">${isZh ? 'TIME_OUT_OF_RANGE (时间超出范围)' : 'TIME_OUT_OF_RANGE'}</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4d', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x4d').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x4d').style.display = 
                isCommand ? 'none' : 'block';
        });

        this.addListener('field-use-custom-0x4d', 'change', (e) => {
            const customInput = document.getElementById('field-custom-time-0x4d');
            const presetSelect = document.getElementById('field-shutdown-time-0x4d');
            
            if (e.target.checked) {
                customInput.disabled = false;
                presetSelect.disabled = true;
            } else {
                customInput.disabled = true;
                presetSelect.disabled = false;
            }
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            let shutdownTime;
            
            if (document.getElementById('field-use-custom-0x4d').checked) {
                shutdownTime = parseInt(document.getElementById('field-custom-time-0x4d').value) || 0;
            } else {
                shutdownTime = parseInt(document.getElementById('field-shutdown-time-0x4d').value) || 0;
            }
            
            // 时间以分钟为单位，使用2字节表示 (小端序)
            return [
                shutdownTime & 0xFF,        // 低字节
                (shutdownTime >> 8) & 0xFF  // 高字节
            ];
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x4d').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4d').value, 10);
    }
}

// Register the command class globally
window.Command4D = Command4D;
