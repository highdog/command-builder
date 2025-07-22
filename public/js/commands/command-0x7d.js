/**
 * Command 0x7D - Set Dolby Atmos Config
 * 设置杜比全景声配置
 */
class Command7D extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x7d">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x7d" class="payload-input">
                    <option value="0" selected>COMMAND (set)</option>
                    <option value="2">RESPONSE (device reply)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="field-stereo-virtualizer-0x7d">${isZh ? '立体声虚拟器:' : 'Stereo Virtualizer:'}</label>
                <select id="field-stereo-virtualizer-0x7d" class="payload-input">
                    <option value="0">${isZh ? '关闭 (OFF)' : 'OFF'}</option>
                    <option value="1">${isZh ? '开启 (ON - 非DAX)' : 'ON (non-DAX)'}</option>
                    <option value="2">${isZh ? '仅房间模拟 (ON_DAX)' : 'ON_DAX (room simulation only)'}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="field-head-tracker-0x7d">${isZh ? '头部跟踪:' : 'Head Tracker:'}</label>
                <select id="field-head-tracker-0x7d" class="payload-input">
                    <option value="0">${isZh ? '关闭 (OFF)' : 'OFF'}</option>
                    <option value="1">${isZh ? '开启 (ON)' : 'ON'}</option>
                </select>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        // No special listeners needed for this command
    }

    getPayload() {
        const stereoVirtualizerEl = document.getElementById('field-stereo-virtualizer-0x7d');
        const headTrackerEl = document.getElementById('field-head-tracker-0x7d');

        const stereoVirtualizer = stereoVirtualizerEl ? parseInt(stereoVirtualizerEl.value) || 0 : 0;
        const headTracker = headTrackerEl ? parseInt(headTrackerEl.value) || 0 : 0;

        // Build the payload according to the bit specification
        const payload = [];

        // First byte: STEREO_VIRTUALIZER (ID=0x00)
        let byte1 = 0;
        byte1 |= (0x00 & 0x3F); // Bits 0-5: Feature ID 0 (STEREO_VIRTUALIZER)
        byte1 |= ((stereoVirtualizer & 0x03) << 6); // Bits 6-7: Status
        payload.push(byte1);

        // Second byte: HEAD_TRACKER (ID=0x01)
        let byte2 = 0;
        byte2 |= (0x01 & 0x3F); // Bits 0-5: Feature ID 1 (HEAD_TRACKER)
        byte2 |= ((headTracker & 0x03) << 6); // Bits 6-7: Status
        payload.push(byte2);

        return payload;
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packet-type-0x7d');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7D = Command7D;
