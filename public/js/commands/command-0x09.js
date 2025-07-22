/**
 * Command 0x09 - Auto-generated from command_handlers.js
 */
class Command09 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x09">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x09" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x09">
                    <fieldset>
                        <legend>${isZh ? 'LE配置 (0=开启, 1=关闭)' : 'LE Configurations (0=ON, 1=OFF)'}</legend>
                        <div><input type="checkbox" id="gfp-on" checked> <label for="gfp-on">${isZh ? 'Google快速配对 (开启)' : 'Google Fast Pair (ON)'}</label></div>
                        <div><input type="checkbox" id="lea-on"> <label for="lea-on">${isZh ? 'LE音频 (开启)' : 'LE Audio (ON)'}</label></div>
                    </fieldset>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x09').addEventListener('change', (e) => {
                document.getElementById('response-options-0x09').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            
            let payloadByte = 0b00000000;
            
            if (!document.getElementById('gfp-on').checked) {
                payloadByte |= (1 << 0);
            }
            if (!document.getElementById('lea-on').checked) {
                payloadByte |= (1 << 1);
            }
            
            return [payloadByte];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x09').value, 10);
        }
    
}

// Register the command class globally
window.Command09 = Command09;