/**
 * Command 0x34 - Auto-generated from command_handlers.js
 */
class Command34 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x34">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x34" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x34">
                    <div class="form-group">
                        <label for="field-wind-detection-0x34">${isZh ? '风噪检测:' : 'Wind Noise Detection:'}</label>
                        <select id="field-wind-detection-0x34" class="payload-input">
                            <option value="0x00">${isZh ? '开启' : 'ON'}</option>
                            <option value="0x01">${isZh ? '关闭' : 'OFF'}</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x34').addEventListener('change', (e) => {
                document.getElementById('response-options-0x34').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-wind-detection-0x34').value, 16)];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x34').value, 10);
        }
    
}

// Register the command class globally
window.Command34 = Command34;