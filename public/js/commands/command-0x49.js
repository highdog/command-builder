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
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x49">数据包类型:</label>
                <select id="field-packet-type-0x49" class="payload-input">
                    <option value="0">COMMAND (get status)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                    <option value="1">NOTIFICATION (status change)</option>
                </select>
            </div>
            <div id="response-options-0x49">
                <div class="form-group">
                    <label for="field-play-state-0x49">播放状态:</label>
                    <select id="field-play-state-0x49" class="payload-input">
                        <option value="0x00">STOPPED (停止)</option>
                        <option value="0x01">PLAYING (播放中)</option>
                        <option value="0x02">PAUSED (暂停)</option>
                        <option value="0x03">FAST_FORWARD (快进)</option>
                        <option value="0x04">REWIND (快退)</option>
                        <option value="0xFF">UNKNOWN (未知)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-audio-source-0x49">音频源:</label>
                    <select id="field-audio-source-0x49" class="payload-input">
                        <option value="0x00">BLUETOOTH (蓝牙)</option>
                        <option value="0x01">AUX (辅助输入)</option>
                        <option value="0x02">USB (USB)</option>
                        <option value="0x03">SD_CARD (SD卡)</option>
                        <option value="0x04">FM_RADIO (FM收音机)</option>
                        <option value="0x05">INTERNAL (内部存储)</option>
                        <option value="0xFF">UNKNOWN (未知)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-volume-level-0x49">音量等级 (0-100):</label>
                    <input type="number" id="field-volume-level-0x49" min="0" max="100" value="50" style="width: 80px;">
                    <span>%</span>
                </div>
                <div class="form-group">
                    <label for="field-track-position-0x49">播放位置 (秒):</label>
                    <input type="number" id="field-track-position-0x49" min="0" max="65535" value="0" style="width: 100px;">
                    <span>秒 (0-65535)</span>
                </div>
                <div class="form-group">
                    <label for="field-track-duration-0x49">曲目总长度 (秒):</label>
                    <input type="number" id="field-track-duration-0x49" min="0" max="65535" value="180" style="width: 100px;">
                    <span>秒 (0-65535)</span>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-shuffle-enabled-0x49">
                        随机播放
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-repeat-enabled-0x49">
                        重复播放
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
