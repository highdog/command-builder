/**
 * Command 0x07 - Auto-generated from command_handlers.js
 */
class Command07 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x07">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x07" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                        <option value="1">NOTIFICATION</option>
                    </select>
                </div>
                <div id="response-options-0x07">
                    <div class="form-group">
                        <label for="field-bt-led-config-0x07">${isZh ? '蓝牙LED配置:' : 'Bluetooth LED Config:'}</label>
                        <select id="field-bt-led-config-0x07" class="payload-input">
                            <option value="0x00">${isZh ? '开启' : 'On'}</option>
                            <option value="0x01">${isZh ? '关闭' : 'Off'}</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x07').addEventListener('change', (e) => {
                document.getElementById('response-options-0x07').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            const config = parseInt(document.getElementById('field-bt-led-config-0x07').value, 16);
            return [config];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x07').value, 10);
        }
    
}

// Register the command class globally
window.Command07 = Command07;