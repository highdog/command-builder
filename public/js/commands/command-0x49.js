/**
 * Command 0x49 - Play Status
 * 播放状态（支持NOTIFICATION）
 */
class Command49 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 播放状态定义
        this.playStates = {
            'STOPPED': 0x00,
            'PLAYING': 0x01,
            'PAUSED': 0x02,
            'FAST_FORWARD': 0x03,
            'REWIND': 0x04,
            'UNKNOWN': 0xFF
        };
        
        // 音频源定义
        this.audioSources = {
            'BLUETOOTH': 0x00,
            'AUX': 0x01,
            'USB': 0x02,
            'SD_CARD': 0x03,
            'FM_RADIO': 0x04,
            'INTERNAL': 0x05,
            'UNKNOWN': 0xFF
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x49">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x49" class="payload-input">
                    <option value="0">COMMAND (get status)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                    <option value="1">NOTIFICATION (status change)</option>
                </select>
            </div>
            <div id="response-options-0x49">
                <div class="form-group">
                    <label for="field-play-state-0x49">${isZh ? '播放状态:' : 'Play State:'}</label>
                    <select id="field-play-state-0x49" class="payload-input">
                        <option value="0x00">${isZh ? 'STOPPED (停止)' : 'STOPPED'}</option>
                        <option value="0x01">${isZh ? 'PLAYING (播放中)' : 'PLAYING'}</option>
                        <option value="0x02">${isZh ? 'PAUSED (暂停)' : 'PAUSED'}</option>
                        <option value="0x03">${isZh ? 'FAST_FORWARD (快进)' : 'FAST_FORWARD'}</option>
                        <option value="0x04">${isZh ? 'REWIND (快退)' : 'REWIND'}</option>
                        <option value="0xFF">${isZh ? 'UNKNOWN (未知)' : 'UNKNOWN'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-audio-source-0x49">${isZh ? '音频源:' : 'Audio Source:'}</label>
                    <select id="field-audio-source-0x49" class="payload-input">
                        <option value="0x00">${isZh ? 'BLUETOOTH (蓝牙)' : 'BLUETOOTH'}</option>
                        <option value="0x01">${isZh ? 'AUX (辅助输入)' : 'AUX'}</option>
                        <option value="0x02">${isZh ? 'USB (USB)' : 'USB'}</option>
                        <option value="0x03">${isZh ? 'SD_CARD (SD卡)' : 'SD_CARD'}</option>
                        <option value="0x04">${isZh ? 'FM_RADIO (FM收音机)' : 'FM_RADIO'}</option>
                        <option value="0x05">${isZh ? 'INTERNAL (内部存储)' : 'INTERNAL'}</option>
                        <option value="0xFF">${isZh ? 'UNKNOWN (未知)' : 'UNKNOWN'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-volume-level-0x49">${isZh ? '音量等级 (0-100):' : 'Volume Level (0-100):'}</label>
                    <input type="number" id="field-volume-level-0x49" min="0" max="100" value="50" style="width: 80px;">
                    <span>%</span>
                </div>
                <div class="form-group">
                    <label for="field-track-position-0x49">${isZh ? '播放位置 (秒):' : 'Track Position (seconds):'}</label>
                    <input type="number" id="field-track-position-0x49" min="0" max="65535" value="0" style="width: 100px;">
                    <span>${isZh ? '秒 (0-65535)' : 'seconds (0-65535)'}</span>
                </div>
                <div class="form-group">
                    <label for="field-track-duration-0x49">${isZh ? '曲目总长度 (秒):' : 'Track Duration (seconds):'}</label>
                    <input type="number" id="field-track-duration-0x49" min="0" max="65535" value="180" style="width: 100px;">
                    <span>${isZh ? '秒 (0-65535)' : 'seconds (0-65535)'}</span>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-shuffle-enabled-0x49">
                        ${isZh ? '随机播放' : 'Shuffle Enabled'}
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-repeat-enabled-0x49">
                        ${isZh ? '重复播放' : 'Repeat Enabled'}
                    </label>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x49', 'change', (e) => {
            document.getElementById('response-options-0x49').style.display = 
                e.target.value !== '0' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE/NOTIFICATION - 返回播放状态信息
        const playState = parseInt(document.getElementById('field-play-state-0x49').value, 16);
        const audioSource = parseInt(document.getElementById('field-audio-source-0x49').value, 16);
        const volumeLevel = parseInt(document.getElementById('field-volume-level-0x49').value) || 0;
        const trackPosition = parseInt(document.getElementById('field-track-position-0x49').value) || 0;
        const trackDuration = parseInt(document.getElementById('field-track-duration-0x49').value) || 0;
        const shuffleEnabled = document.getElementById('field-shuffle-enabled-0x49').checked;
        const repeatEnabled = document.getElementById('field-repeat-enabled-0x49').checked;
        
        // 构建标志字节
        let flags = 0x00;
        if (shuffleEnabled) flags |= 0x01;
        if (repeatEnabled) flags |= 0x02;
        
        return [
            playState,                      // 播放状态 (1字节)
            audioSource,                    // 音频源 (1字节)
            volumeLevel,                    // 音量等级 (1字节)
            trackPosition & 0xFF,           // 播放位置低字节
            (trackPosition >> 8) & 0xFF,    // 播放位置高字节
            trackDuration & 0xFF,           // 曲目长度低字节
            (trackDuration >> 8) & 0xFF,    // 曲目长度高字节
            flags                           // 标志字节 (1字节)
        ];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x49').value, 10);
    }
}

// Register the command class globally
window.Command49 = Command49;
