/**
 * Command 0x19 - Auto-generated from command_handlers.js
 */
class Command19 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x19">数据包类型:</label>
                    <select id="field-packet-type-0x19" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE (device reply)</option>
                    </select>
                </div>
                <div id="response-options-0x19">
                    <div class="form-group">
                        <label for="field-product-type-0x19">产品类型:</label>
                        <select id="field-product-type-0x19" class="payload-input">
                            <option value="earbuds">Earbuds</option>
                            <option value="headset">Headset</option>
                        </select>
                    </div>
                    <div id="earbuds-options-0x19">
                        <fieldset>
                            <legend>Left Earbud MAC</legend>
                            <label for="left-mac-0x19">MAC Address:</label>
                            <input type="text" id="left-mac-0x19" placeholder="AA:BB:CC:DD:EE:FF" pattern="[0-9A-Fa-f:]{17}" value="12:34:56:78:9A:BC" style="width: 90%;">
                        </fieldset>
                        <fieldset>
                            <legend>Right Earbud MAC</legend>
                            <label for="right-mac-0x19">MAC Address:</label>
                            <input type="text" id="right-mac-0x19" placeholder="AA:BB:CC:DD:EE:FF" pattern="[0-9A-Fa-f:]{17}" value="12:34:56:78:9A:BD" style="width: 90%;">
                        </fieldset>
                    </div>
                    <div id="headset-options-0x19" style="display:none;">
                        <fieldset>
                            <legend>Headset MAC</legend>
                            <label for="headset-mac-0x19">MAC Address:</label>
                            <input type="text" id="headset-mac-0x19" placeholder="AA:BB:CC:DD:EE:FF" pattern="[0-9A-Fa-f:]{17}" value="12:34:56:78:9A:BE" style="width: 90%;">
                        </fieldset>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x19').addEventListener('change', (e) => {
                document.getElementById('response-options-0x19').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
            document.getElementById('field-product-type-0x19').addEventListener('change', (e) => {
                document.getElementById('earbuds-options-0x19').style.display = e.target.value === 'earbuds' ? 'block' : 'none';
                document.getElementById('headset-options-0x19').style.display = e.target.value === 'headset' ? 'block' : 'none';
                generateOutput();
            });
        }
        macToBytes(macString) {
            // Convert MAC address string "AA:BB:CC:DD:EE:FF" to 6 bytes array
            const cleanMac = macString.replace(/[^0-9A-Fa-f]/g, '');
            if (cleanMac.length !== 12) return [0, 0, 0, 0, 0, 0];
            
            const bytes = [];
            for (let i = 0; i < 12; i += 2) {
                bytes.push(parseInt(cleanMac.substr(i, 2), 16));
            }
            return bytes;
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            
            const productType = document.getElementById('field-product-type-0x19').value;
            if (productType === 'earbuds') {
                const leftMac = this.macToBytes(document.getElementById('left-mac-0x19').value);
                const rightMac = this.macToBytes(document.getElementById('right-mac-0x19').value);
                return [...leftMac, ...rightMac];
            } else {
                return this.macToBytes(document.getElementById('headset-mac-0x19').value);
            }
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x19').value, 10);
        }
    
}

// Register the command class globally
window.Command19 = Command19;