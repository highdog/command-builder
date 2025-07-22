/**
 * Command 0x48 - Trigger Media Button
 * 触发媒体按钮
 */
class Command48 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 媒体按钮定义
        this.mediaButtons = {
            'PLAY_PAUSE': 0x00,
            'NEXT_TRACK': 0x01,
            'PREVIOUS_TRACK': 0x02,
            'VOLUME_UP': 0x03,
            'VOLUME_DOWN': 0x04,
            'STOP': 0x05,
            'FAST_FORWARD': 0x06,
            'REWIND': 0x07,
            'MUTE': 0x08,
            'VOICE_ASSISTANT': 0x09
        };
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_BUTTON': 0x02,
            'NOT_CONNECTED': 0x03
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x48">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x48" class="payload-input">
                    <option value="0" selected>COMMAND (trigger button)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x48">
                <div class="form-group">
                    <label for="field-media-button-0x48">${isZh ? '媒体按钮:' : 'Media Button:'}</label>
                    <select id="field-media-button-0x48" class="payload-input">
                        <option value="0x00">${isZh ? 'PLAY_PAUSE (播放/暂停)' : 'PLAY_PAUSE'}</option>
                        <option value="0x01">${isZh ? 'NEXT_TRACK (下一曲)' : 'NEXT_TRACK'}</option>
                        <option value="0x02">${isZh ? 'PREVIOUS_TRACK (上一曲)' : 'PREVIOUS_TRACK'}</option>
                        <option value="0x03">${isZh ? 'VOLUME_UP (音量+)' : 'VOLUME_UP'}</option>
                        <option value="0x04">${isZh ? 'VOLUME_DOWN (音量-)' : 'VOLUME_DOWN'}</option>
                        <option value="0x05">${isZh ? 'STOP (停止)' : 'STOP'}</option>
                        <option value="0x06">${isZh ? 'FAST_FORWARD (快进)' : 'FAST_FORWARD'}</option>
                        <option value="0x07">${isZh ? 'REWIND (快退)' : 'REWIND'}</option>
                        <option value="0x08">${isZh ? 'MUTE (静音)' : 'MUTE'}</option>
                        <option value="0x09">${isZh ? 'VOICE_ASSISTANT (语音助手)' : 'VOICE_ASSISTANT'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-press-duration-0x48">${isZh ? '按压持续时间 (ms):' : 'Press Duration (ms):'}</label>
                    <input type="number" id="field-press-duration-0x48" min="0" max="65535" value="100" style="width: 100px;">
                    <span>${isZh ? '毫秒 (0-65535)' : 'milliseconds (0-65535)'}</span>
                </div>
            </div>
            <div id="response-options-0x48" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x48">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x48" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'INVALID_BUTTON (按钮无效)' : 'INVALID_BUTTON'}</option>
                        <option value="0x03">${isZh ? 'NOT_CONNECTED (未连接)' : 'NOT_CONNECTED'}</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x48', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x48').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x48').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const button = parseInt(document.getElementById('field-media-button-0x48').value, 16);
            const duration = parseInt(document.getElementById('field-press-duration-0x48').value) || 100;
            
            // 按钮ID (1字节) + 持续时间 (2字节，小端序)
            return [
                button,
                duration & 0xFF,        // 低字节
                (duration >> 8) & 0xFF  // 高字节
            ];
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x48').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x48').value, 10);
    }
}

// Register the command class globally
window.Command48 = Command48;
