/**
 * Command 0x7C - Get Dolby Atmos Config
 * 获取杜比全景声配置
 */
class Command7C extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x7c">数据包类型:</label>
                <select id="field-packet-type-0x7c" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x7c">
                <div class="form-group">
                    <label for="field-stereo-virtualizer-0x7c">立体声虚拟器:</label>
                    <select id="field-stereo-virtualizer-0x7c" class="payload-input">
                        <option value="0">关闭 (OFF)</option>
                        <option value="1">开启 (ON - 非DAX)</option>
                        <option value="2">仅房间模拟 (ON_DAX)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-head-tracker-0x7c">头部跟踪:</label>
                    <select id="field-head-tracker-0x7c" class="payload-input">
                        <option value="0">关闭 (OFF)</option>
                        <option value="1">开启 (ON)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x7c', 'change', (e) => {
            document.getElementById('response-options-0x7c').style.display =
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷

        // RESPONSE - 杜比全景声配置
        const stereoVirtualizerEl = document.getElementById('field-stereo-virtualizer-0x7c');
        const headTrackerEl = document.getElementById('field-head-tracker-0x7c');

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
        const packetTypeEl = document.getElementById('field-packet-type-0x7c');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7C = Command7C;