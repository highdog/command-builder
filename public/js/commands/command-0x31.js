/**
 * Command 0x31 - Auto-generated from command_handlers.js
 */
class Command31 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x31">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x31" class="payload-input">
                        <option value="0" selected>COMMAND (set)</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>
                <div id="command-options-0x31">
                    <div class="form-group">
                        <label for="field-anc-level-0x31">${isZh ? 'ANC级别 (0-255):' : 'ANC Level (0-255):'}</label>
                        <input type="number" id="field-anc-level-0x31" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
                <div id="response-options-0x31" style="display:none;">
                    <div class="form-group">
                        <label for="field-anc-level-resp-0x31">${isZh ? '应用的ANC级别 (0-255):' : 'Applied ANC Level (0-255):'}</label>
                        <input type="number" id="field-anc-level-resp-0x31" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x31').addEventListener('change', (e) => {
                const isCommand = e.target.value === '0';
                document.getElementById('command-options-0x31').style.display = isCommand ? 'block' : 'none';
                document.getElementById('response-options-0x31').style.display = isCommand ? 'none' : 'block';
                generateOutput();
            });
        }
        getPayload() {
            const packetType = this.getPacketType();
            if (packetType === 0) {
                return [parseInt(document.getElementById('field-anc-level-0x31').value) || 0];
            } else {
                return [parseInt(document.getElementById('field-anc-level-resp-0x31').value) || 0];
            }
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x31').value, 10);
        }
    
}

// Register the command class globally
window.Command31 = Command31;