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
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4d">数据包类型:</label>
                <select id="field-packet-type-0x4d" class="payload-input">
                    <option value="0" selected>COMMAND (set time)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x4d">
                <div class="form-group">
                    <label for="field-shutdown-time-0x4d">自动关机时间:</label>
                    <select id="field-shutdown-time-0x4d" class="payload-input">
                        <option value="0">DISABLED (禁用)</option>
                        <option value="5">5分钟</option>
                        <option value="10">10分钟</option>
                        <option value="15" selected>15分钟</option>
                        <option value="30">30分钟</option>
                        <option value="60">1小时</option>
                        <option value="120">2小时</option>
                        <option value="180">3小时</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-custom-time-0x4d">自定义时间 (分钟):</label>
                    <input type="number" id="field-custom-time-0x4d" min="0" max="65535" value="15" style="width: 100px;">
                    <small>0=禁用，1-65535分钟</small>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-use-custom-0x4d">
                        使用自定义时间
                    </label>
                </div>
            </div>
            <div id="response-options-0x4d" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x4d">执行状态:</label>
                    <select id="field-status-0x4d" class="payload-input">
                        <option value="0x00">SUCCESS (成功)</option>
                        <option value="0x01">FAILED (失败)</option>
                        <option value="0x02">INVALID_TIME (时间无效)</option>
                        <option value="0x03">TIME_OUT_OF_RANGE (时间超出范围)</option>
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
