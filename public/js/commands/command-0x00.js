/**
 * Command 0x00 - Device Type Query/Response
 * Handles device type information queries and responses
 */
class Command00 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x00">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x00" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x00">
                <div class="form-group">
                    <label for="field-device-type-0x00">${isZh ? '设备型号:' : 'Device Type:'}</label>
                    <select id="field-device-type-0x00" class="payload-input">
                        <option value="0x00">VERIO_100</option>
                        <option value="0x01">VERIO_200</option>
                        <option value="0x02">VERIO_300</option>
                        <option value="0x03">AVENTHO_300</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x00', 'change', (e) => {
            document.getElementById('response-options-0x00').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        return [parseInt(document.getElementById('field-device-type-0x00').value, 16)];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x00').value, 10);
    }
}

// Register the command class globally
window.Command00 = Command00;
