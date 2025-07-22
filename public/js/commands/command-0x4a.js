/**
 * Command 0x4A - Get Device Name
 * 获取设备名称
 */
class Command4A extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4a">数据包类型:</label>
                <select id="field-packet-type-0x4a" class="payload-input">
                    <option value="0">COMMAND (get name)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x4a">
                <div class="form-group">
                    <label for="field-device-name-0x4a">设备名称:</label>
                    <input type="text" id="field-device-name-0x4a" maxlength="64" value="AVENTHO 300" style="width: 90%;">
                    <small>最大64字符</small>
                </div>
                <div class="form-group">
                    <label for="field-name-encoding-0x4a">编码格式:</label>
                    <select id="field-name-encoding-0x4a" class="payload-input">
                        <option value="0">UTF-8</option>
                        <option value="1">ASCII</option>
                        <option value="2">UTF-16</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4a', 'change', (e) => {
            document.getElementById('response-options-0x4a').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回设备名称
        const deviceName = document.getElementById('field-device-name-0x4a').value;
        const encoding = parseInt(document.getElementById('field-name-encoding-0x4a').value);
        
        const payload = [];
        
        // 编码格式 (1字节)
        payload.push(encoding);
        
        // 名称长度 (1字节)
        const nameBytes = this.stringToPaddedBytes(deviceName, deviceName.length);
        payload.push(nameBytes.length);
        
        // 设备名称 (变长，根据编码格式)
        payload.push(...nameBytes);
        
        return payload;
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4a').value, 10);
    }
}

// Register the command class globally
window.Command4A = Command4A;
