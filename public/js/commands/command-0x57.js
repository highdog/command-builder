/**
 * Command 0x57 - Get Voice Prompts Volume Level
 * 获取语音提示音量等级
 */
class Command57 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x57">数据包类型:</label>
                <select id="field-packet-type-0x57" class="payload-input">
                    <option value="0">COMMAND (get volume)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x57">
                <div class="form-group">
                    <label for="field-voice-volume-0x57">语音提示音量 (0-100):</label>
                    <input type="number" id="field-voice-volume-0x57" min="0" max="100" value="70" style="width: 80px;">
                    <span>%</span>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-voice-muted-0x57">
                        语音提示静音
                    </label>
                </div>
                <div class="form-group">
                    <label for="field-voice-volume-mode-0x57">音量模式:</label>
                    <select id="field-voice-volume-mode-0x57" class="payload-input">
                        <option value="0">ABSOLUTE (绝对音量)</option>
                        <option value="1" selected>RELATIVE (相对音量)</option>
                        <option value="2">ADAPTIVE (自适应音量)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x57', 'change', (e) => {
            document.getElementById('response-options-0x57').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回语音提示音量信息
        const voiceVolume = parseInt(document.getElementById('field-voice-volume-0x57').value) || 0;
        const voiceMuted = document.getElementById('field-voice-muted-0x57').checked;
        const volumeMode = parseInt(document.getElementById('field-voice-volume-mode-0x57').value);
        
        // 构建状态标志字节
        let statusFlags = 0x00;
        if (voiceMuted) statusFlags |= 0x01;
        
        return [
            voiceVolume,    // 音量等级 (1字节, 0-100)
            volumeMode,     // 音量模式 (1字节)
            statusFlags     // 状态标志 (1字节)
        ];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x57').value, 10);
    }
}

// Register the command class globally
window.Command57 = Command57;
