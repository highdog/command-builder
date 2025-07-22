/**
 * Command 0x4E - Get Selected Voice Assistant Mode
 * 获取选定的语音助手模式
 */
class Command4E extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 语音助手类型定义
        this.assistantTypes = {
            'DISABLED': 0x00,
            'SIRI': 0x01,
            'GOOGLE_ASSISTANT': 0x02,
            'ALEXA': 0x03,
            'BIXBY': 0x04,
            'CORTANA': 0x05,
            'CUSTOM': 0xFF
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4e">数据包类型:</label>
                <select id="field-packet-type-0x4e" class="payload-input">
                    <option value="0">COMMAND (get assistant)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x4e">
                <div class="form-group">
                    <label for="field-assistant-type-0x4e">语音助手类型:</label>
                    <select id="field-assistant-type-0x4e" class="payload-input">
                        <option value="0x00">DISABLED (禁用)</option>
                        <option value="0x01">SIRI (苹果Siri)</option>
                        <option value="0x02" selected>GOOGLE_ASSISTANT (谷歌助手)</option>
                        <option value="0x03">ALEXA (亚马逊Alexa)</option>
                        <option value="0x04">BIXBY (三星Bixby)</option>
                        <option value="0x05">CORTANA (微软Cortana)</option>
                        <option value="0xFF">CUSTOM (自定义)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-wake-word-enabled-0x4e" checked>
                        唤醒词启用
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-push-to-talk-0x4e">
                        按键通话模式
                    </label>
                </div>
                <div class="form-group">
                    <label for="field-sensitivity-0x4e">语音识别灵敏度 (1-10):</label>
                    <input type="number" id="field-sensitivity-0x4e" min="1" max="10" value="5" style="width: 80px;">
                </div>
                <div class="form-group">
                    <label for="field-language-code-0x4e">语言代码:</label>
                    <select id="field-language-code-0x4e" class="payload-input">
                        <option value="0x00">English (US)</option>
                        <option value="0x01">English (UK)</option>
                        <option value="0x02">Chinese (Simplified)</option>
                        <option value="0x03">Chinese (Traditional)</option>
                        <option value="0x04">Japanese</option>
                        <option value="0x05">Korean</option>
                        <option value="0x06">German</option>
                        <option value="0x07">French</option>
                        <option value="0x08">Spanish</option>
                        <option value="0x09">Italian</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4e', 'change', (e) => {
            document.getElementById('response-options-0x4e').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回语音助手配置
        const assistantType = parseInt(document.getElementById('field-assistant-type-0x4e').value, 16);
        const wakeWordEnabled = document.getElementById('field-wake-word-enabled-0x4e').checked;
        const pushToTalk = document.getElementById('field-push-to-talk-0x4e').checked;
        const sensitivity = parseInt(document.getElementById('field-sensitivity-0x4e').value) || 5;
        const languageCode = parseInt(document.getElementById('field-language-code-0x4e').value, 16);
        
        // 构建配置标志字节
        let configFlags = 0x00;
        if (wakeWordEnabled) configFlags |= 0x01;
        if (pushToTalk) configFlags |= 0x02;
        
        return [
            assistantType,    // 语音助手类型 (1字节)
            configFlags,      // 配置标志 (1字节)
            sensitivity,      // 灵敏度 (1字节)
            languageCode      // 语言代码 (1字节)
        ];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4e').value, 10);
    }
}

// Register the command class globally
window.Command4E = Command4E;
