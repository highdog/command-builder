/**
 * Command 0x06 - Auto-generated from command_handlers.js
 */
class Command06 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x06">数据包类型:</label>
                    <select id="field-packet-type-0x06" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                        <option value="1">NOTIFICATION</option>
                    </select>
                </div>
                <div id="response-options-0x06">
                    <div class="form-group">
                        <label for="field-product-type-0x06">产品类型:</label>
                        <select id="field-product-type-0x06" class="payload-input">
                            <option value="earbuds">Earbuds</option>
                            <option value="headset">Headset</option>
                        </select>
                    </div>
                    <div id="earbuds-options-0x06">
                        <fieldset><legend>Left Earbud</legend><input type="checkbox" id="left-bat-offline"> <label for="left-bat-offline">Offline (0xFF)</label><br><label for="left-bat">Battery (0-100):</label><input type="number" id="left-bat" min="0" max="100" value="95" style="width: 90%;"></fieldset>
                        <fieldset><legend>Right Earbud</legend><input type="checkbox" id="right-bat-offline"> <label for="right-bat-offline">Offline (0xFF)</label><br><label for="right-bat">Battery (0-100):</label><input type="number" id="right-bat" min="0" max="100" value="98" style="width: 90%;"></fieldset>
                        <fieldset><legend>Charging Case</legend><input type="checkbox" id="case-bat-offline"> <label for="case-bat-offline">Offline (0xFF)</label><br><label for="case-bat">Battery (0-100):</label><input type="number" id="case-bat" min="0" max="100" value="80" style="width: 90%;"></fieldset>
                    </div>
                    <div id="headset-options-0x06" style="display:none;"><fieldset><legend>Headset</legend><label for="headset-bat">Battery (0-100):</label><input type="number" id="headset-bat" min="0" max="100" value="90" style="width: 90%;"></fieldset></div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
    }

    attachListeners() {
            document.getElementById('field-packet-type-0x06').addEventListener('change', (e) => { document.getElementById('response-options-0x06').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('field-product-type-0x06').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x06').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x06').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            ['left', 'right', 'case'].forEach(item => {
                const offlineCheckbox = document.getElementById(`${item}-bat-offline`);
                const batInput = document.getElementById(`${item}-bat`);
                if(offlineCheckbox) offlineCheckbox.addEventListener('change', (e) => { batInput.disabled = e.target.checked; generateOutput(); });
            });
    }

    getPayload() {
            if (this.getPacketType() === 0) return [];
            const productType = document.getElementById('field-product-type-0x06').value;
            if (productType === 'earbuds') {
                return ['left', 'right', 'case'].map(item => {
                    if (document.getElementById(`${item}-bat-offline`).checked) return 0xFF;
                    return parseInt(document.getElementById(`${item}-bat`).value) || 0;
                });
            }
            return [parseInt(document.getElementById('headset-bat').value) || 0];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x06').value, 10);
    }
    
}

// Register the command class globally
window.Command06 = Command06;