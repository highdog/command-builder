/**
 * Command 0x4F - Set Selected Voice Assistant Mode
 * 设置选定的语音助手模式
 */
class Command4F extends BaseCommand {
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
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'UNSUPPORTED_ASSISTANT': 0x02,
            'INVALID_CONFIGURATION': 0x03
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4f">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x4f" class="payload-input">
                    <option value="0" selected>COMMAND (set assistant)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x4f">
                <div class="form-group">
                    <label for="field-assistant-type-0x4f">${isZh ? '语音助手类型:' : 'Voice Assistant Type:'}</label>
                    <select id="field-assistant-type-0x4f" class="payload-input">
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
                        <input type="checkbox" id="field-wake-word-enabled-0x4f" checked>
                        ${isZh ? '唤醒词启用' : 'Wake Word Enabled'}
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-push-to-talk-0x4f">
                        ${isZh ? '按键通话模式' : 'Push to Talk Mode'}
                    </label>
                </div>
                <div class="form-group">
                    <label for="field-sensitivity-0x4f">${isZh ? '语音识别灵敏度 (1-10):' : 'Voice Recognition Sensitivity (1-10):'}</label>
                    <input type="number" id="field-sensitivity-0x4f" min="1" max="10" value="5" style="width: 80px;">
                </div>
                <div class="form-group">
                    <label for="field-language-code-0x4f">${isZh ? '语言代码:' : 'Language Code:'}</label>
                    <select id="field-language-code-0x4f" class="payload-input">
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
            <div id="response-options-0x4f" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x4f">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x4f" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'UNSUPPORTED_ASSISTANT (不支持的助手)' : 'UNSUPPORTED_ASSISTANT'}</option>
                        <option value="0x03">${isZh ? 'INVALID_CONFIGURATION (配置无效)' : 'INVALID_CONFIGURATION'}</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4f', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x4f').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x4f').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const assistantType = parseInt(document.getElementById('field-assistant-type-0x4f').value, 16);
            const wakeWordEnabled = document.getElementById('field-wake-word-enabled-0x4f').checked;
            const pushToTalk = document.getElementById('field-push-to-talk-0x4f').checked;
            const sensitivity = parseInt(document.getElementById('field-sensitivity-0x4f').value) || 5;
            const languageCode = parseInt(document.getElementById('field-language-code-0x4f').value, 16);
            
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
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x4f').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4f').value, 10);
    }
}

// Register the command class globally
window.Command4F = Command4F;
