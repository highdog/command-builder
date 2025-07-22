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
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4e">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x4e" class="payload-input">
                    <option value="0">COMMAND (get assistant)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x4e">
                <div class="form-group">
                    <label for="field-assistant-type-0x4e">${isZh ? '语音助手类型:' : 'Voice Assistant Type:'}</label>
                    <select id="field-assistant-type-0x4e" class="payload-input">
                        <option value="0x00">${isZh ? 'DISABLED (禁用)' : 'DISABLED'}</option>
                        <option value="0x01">${isZh ? 'SIRI (苹果Siri)' : 'SIRI'}</option>
                        <option value="0x02" selected>${isZh ? 'GOOGLE_ASSISTANT (谷歌助手)' : 'GOOGLE_ASSISTANT'}</option>
                        <option value="0x03">${isZh ? 'ALEXA (亚马逊Alexa)' : 'ALEXA'}</option>
                        <option value="0x04">${isZh ? 'BIXBY (三星Bixby)' : 'BIXBY'}</option>
                        <option value="0x05">${isZh ? 'CORTANA (微软Cortana)' : 'CORTANA'}</option>
                        <option value="0xFF">${isZh ? 'CUSTOM (自定义)' : 'CUSTOM'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-wake-word-enabled-0x4e" checked>
                        ${isZh ? '唤醒词启用' : 'Wake Word Enabled'}
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-push-to-talk-0x4e">
                        ${isZh ? '按键通话模式' : 'Push to Talk Mode'}
                    </label>
                </div>
                <div class="form-group">
                    <label for="field-sensitivity-0x4e">${isZh ? '语音识别灵敏度 (1-10):' : 'Voice Recognition Sensitivity (1-10):'}</label>
                    <input type="number" id="field-sensitivity-0x4e" min="1" max="10" value="5" style="width: 80px;">
                </div>
                <div class="form-group">
                    <label for="field-language-code-0x4e">${isZh ? '语言代码:' : 'Language Code:'}</label>
                    <select id="field-language-code-0x4e" class="payload-input">
                        <option value="0x00">${isZh ? '英语 (美国)' : 'English (US)'}</option>
                        <option value="0x01">${isZh ? '英语 (英国)' : 'English (UK)'}</option>
                        <option value="0x02">${isZh ? '中文 (简体)' : 'Chinese (Simplified)'}</option>
                        <option value="0x03">${isZh ? '中文 (繁体)' : 'Chinese (Traditional)'}</option>
                        <option value="0x04">${isZh ? '日语' : 'Japanese'}</option>
                        <option value="0x05">${isZh ? '韩语' : 'Korean'}</option>
                        <option value="0x06">${isZh ? '德语' : 'German'}</option>
                        <option value="0x07">${isZh ? '法语' : 'French'}</option>
                        <option value="0x08">${isZh ? '西班牙语' : 'Spanish'}</option>
                        <option value="0x09">${isZh ? '意大利语' : 'Italian'}</option>
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
