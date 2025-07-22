/**
 * Command 0x7F - Set Audio Codecs Configurations
 * 设置音频编解码器配置
 */
class Command7F extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x7f">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x7f" class="payload-input">
                    <option value="0" selected>COMMAND (set)</option>
                    <option value="2">RESPONSE (device reply)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="field-ldac-status-0x7f">${isZh ? 'LDAC状态:' : 'LDAC Status:'}</label>
                <select id="field-ldac-status-0x7f" class="payload-input">
                    <option value="0">${isZh ? '开启 (ON)' : 'ON'}</option>
                    <option value="1">${isZh ? '关闭 (OFF)' : 'OFF'}</option>
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
        const ldacStatusEl = document.getElementById('field-ldac-status-0x7f');
        const ldacStatus = ldacStatusEl ? parseInt(ldacStatusEl.value) || 0 : 0;

        // Build byte according to specification (same format as 0x7E)
        let codecByte = 0;
        codecByte |= (0x00 & 0x3F); // Bits 0-5: LDAC codec type (0x00)
        codecByte |= ((ldacStatus & 0x03) << 6); // Bits 6-7: Status

        return [codecByte];
    }

    getPacketType() {
        const packetTypeEl = document.getElementById('field-packet-type-0x7f');
        return packetTypeEl ? parseInt(packetTypeEl.value, 10) : 0;
    }
}

// Register the command class globally
window.Command7F = Command7F;
