/**
 * Command 0x7E - Get Audio Codecs Configurations
 * 获取音频编解码器配置
 */
class Command7E extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x7e">数据包类型:</label>
                <select id="field-packet-type-0x7e" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x7e">
                <div class="form-group">
                    <label for="field-ldac-status-0x7e">LDAC状态:</label>
                    <select id="field-ldac-status-0x7e" class="payload-input">
                        <option value="0">开启 (ON)</option>
                        <option value="1">关闭 (OFF)</option>
                    </select>
                </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x7e', 'change', (e) => {
            document.getElementById('response-options-0x7e').style.display =
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷

        // RESPONSE - 音频编解码器配置
        const ldacStatusEl = document.getElementById('field-ldac-status-0x7e');
        const ldacStatus = ldacStatusEl ? parseInt(ldacStatusEl.value) || 0 : 0;

        // Build byte according to specification
        let codecByte = 0;
        codecByte |= (0x00 & 0x3F); // Bits 0-5: LDAC codec type (0x00)
        codecByte |= ((ldacStatus & 0x03) << 6); // Bits 6-7: Status

        return [codecByte];
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packet-type-0x7e');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7E = Command7E;
