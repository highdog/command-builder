/**
 * Command 0x4B - Set Device Name
 * 设置设备名称
 */
class Command4B extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'NAME_TOO_LONG': 0x02,
            'INVALID_ENCODING': 0x03,
            'INVALID_CHARACTERS': 0x04
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4b">数据包类型:</label>
                <select id="field-packet-type-0x4b" class="payload-input">
                    <option value="0" selected>COMMAND (set name)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x4b">
                <div class="form-group">
                    <label for="field-new-device-name-0x4b">新设备名称:</label>
                    <input type="text" id="field-new-device-name-0x4b" maxlength="64" value="My AVENTHO 300" style="width: 90%;">
                    <small>最大64字符</small>
                </div>
                <div class="form-group">
                    <label for="field-name-encoding-0x4b">编码格式:</label>
                    <select id="field-name-encoding-0x4b" class="payload-input">
                        <option value="0">UTF-8</option>
                        <option value="1">ASCII</option>
                        <option value="2">UTF-16</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x4b" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x4b">执行状态:</label>
                    <select id="field-status-0x4b" class="payload-input">
                        <option value="0x00">SUCCESS (成功)</option>
                        <option value="0x01">FAILED (失败)</option>
                        <option value="0x02">NAME_TOO_LONG (名称过长)</option>
                        <option value="0x03">INVALID_ENCODING (编码无效)</option>
                        <option value="0x04">INVALID_CHARACTERS (字符无效)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4b', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x4b').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x4b').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const deviceName = document.getElementById('field-new-device-name-0x4b').value;
            const encoding = parseInt(document.getElementById('field-name-encoding-0x4b').value);
            
            const payload = [];
            
            // 编码格式 (1字节)
            payload.push(encoding);
            
            // 名称长度 (1字节)
            const nameBytes = this.stringToPaddedBytes(deviceName, deviceName.length);
            payload.push(nameBytes.length);
            
            // 设备名称 (变长，根据编码格式)
            payload.push(...nameBytes);
            
            return payload;
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x4b').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4b').value, 10);
    }
}

// Register the command class globally
window.Command4B = Command4B;
