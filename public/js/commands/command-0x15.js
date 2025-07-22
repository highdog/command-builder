/**
 * Command 0x15 - Auto-generated from command_handlers.js
 */
class Command15 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x15">数据包类型:</label>
                    <select id="field-packet-type-0x15" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x15">
                    <div class="form-group">
                        <label for="field-color-0x15">Earbuds Color:</label>
                        <select id="field-color-0x15" class="payload-input">
                            <option value="0x00">Color1</option>
                            <option value="0x01">Color2</option>
                            <option value="0x02">Color3</option>
                            <option value="0x03">Color4</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="field-online-status-0x15">Online Status:</label>
                        <select id="field-online-status-0x15" class="payload-input">
                            <option value="0x01">Left online, Right offline</option>
                            <option value="0x02">Right online, Left offline</option>
                            <option value="0x03" selected>Both earbuds online</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x15').addEventListener('change', (e) => {
                document.getElementById('response-options-0x15').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            const color = parseInt(document.getElementById('field-color-0x15').value, 16);
            const onlineStatus = parseInt(document.getElementById('field-online-status-0x15').value, 16);
            return [color, onlineStatus];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x15').value, 10);
        }
    
}

// Register the command class globally
window.Command15 = Command15;