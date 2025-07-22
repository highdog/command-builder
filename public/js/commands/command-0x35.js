/**
 * Command 0x35 - Auto-generated from command_handlers.js
 */
class Command35 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x35">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x35" class="payload-input">
                        <option value="0" selected>COMMAND (set)</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>
                <div id="command-options-0x35">
                    <div class="form-group">
                        <label for="field-wind-detection-0x35">${isZh ? '风噪检测:' : 'Wind Noise Detection:'}</label>
                        <select id="field-wind-detection-0x35" class="payload-input">
                            <option value="0x00">${isZh ? '开启' : 'ON'}</option>
                            <option value="0x01">${isZh ? '关闭' : 'OFF'}</option>
                        </select>
                    </div>
                </div>
                <div id="response-options-0x35" style="display:none;">
                    <div class="form-group">
                        <label for="field-wind-detection-resp-0x35">${isZh ? '应用的风噪检测:' : 'Applied Wind Detection:'}</label>
                        <select id="field-wind-detection-resp-0x35" class="payload-input">
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
            document.getElementById('field-packet-type-0x35').addEventListener('change', (e) => {
                const isCommand = e.target.value === '0';
                document.getElementById('command-options-0x35').style.display = isCommand ? 'block' : 'none';
                document.getElementById('response-options-0x35').style.display = isCommand ? 'none' : 'block';
                generateOutput();
            });
        }
        getPayload() {
            const packetType = this.getPacketType();
            if (packetType === 0) {
                return [parseInt(document.getElementById('field-wind-detection-0x35').value, 16)];
            } else {
                return [parseInt(document.getElementById('field-wind-detection-resp-0x35').value, 16)];
            }
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x35').value, 10);
        }
    
}

// Register the command class globally
window.Command35 = Command35;