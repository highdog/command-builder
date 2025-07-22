/**
 * Command 0x58 - Set Voice Prompts Volume Level
 * 设置语音提示音量等级
 */
class Command58 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_VOLUME': 0x02,
            'INVALID_MODE': 0x03
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x58">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x58" class="payload-input">
                    <option value="0" selected>COMMAND (set volume)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x58">
                <div class="form-group">
                    <label for="field-voice-volume-0x58">${isZh ? '语音提示音量 (0-100):' : 'Voice Prompt Volume (0-100):'}</label>
                    <input type="number" id="field-voice-volume-0x58" min="0" max="100" value="70" style="width: 80px;">
                    <span>%</span>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-voice-muted-0x58">
                        ${isZh ? '语音提示静音' : 'Voice Prompt Muted'}
                    </label>
                </div>
                <div class="form-group">
                    <label for="field-voice-volume-mode-0x58">${isZh ? '音量模式:' : 'Volume Mode:'}</label>
                    <select id="field-voice-volume-mode-0x58" class="payload-input">
                        <option value="0">${isZh ? 'ABSOLUTE (绝对音量)' : 'ABSOLUTE'}</option>
                        <option value="1" selected>${isZh ? 'RELATIVE (相对音量)' : 'RELATIVE'}</option>
                        <option value="2">${isZh ? 'ADAPTIVE (自适应音量)' : 'ADAPTIVE'}</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x58" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x58">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x58" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'INVALID_VOLUME (音量无效)' : 'INVALID_VOLUME'}</option>
                        <option value="0x03">${isZh ? 'INVALID_MODE (模式无效)' : 'INVALID_MODE'}</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x58', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x58').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x58').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const voiceVolume = parseInt(document.getElementById('field-voice-volume-0x58').value) || 0;
            const voiceMuted = document.getElementById('field-voice-muted-0x58').checked;
            const volumeMode = parseInt(document.getElementById('field-voice-volume-mode-0x58').value);
            
            // 构建状态标志字节
            let statusFlags = 0x00;
            if (voiceMuted) statusFlags |= 0x01;
            
            return [
                voiceVolume,    // 音量等级 (1字节, 0-100)
                volumeMode,     // 音量模式 (1字节)
                statusFlags     // 状态标志 (1字节)
            ];
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x58').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x58').value, 10);
    }
}

// Register the command class globally
window.Command58 = Command58;
