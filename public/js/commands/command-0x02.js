/**
 * Command 0x02 - Serial Number Query/Response
 * Handles device serial number information queries and responses
 */
class Command02 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x02">数据包类型:</label>
                <select id="field-packet-type-0x02" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x02">
                <div class="form-group">
                    <label for="field-product-type-0x02">产品类型:</label>
                    <select id="field-product-type-0x02" class="payload-input">
                        <option value="earbuds">Earbuds</option>
                        <option value="headset">Headset</option>
                    </select>
                </div>
                <div id="earbuds-options-0x02">
                    <fieldset>
                        <legend>Left Earbud</legend>
                        <input type="checkbox" id="left-sn-offline"> 
                        <label for="left-sn-offline">Offline (zeros)</label><br>
                        <label for="left-sn">Serial (max 16):</label>
                        <input type="text" id="left-sn" maxlength="16" value="L_SERIAL_12345" style="width: 90%;">
                    </fieldset>
                    <fieldset>
                        <legend>Right Earbud</legend>
                        <input type="checkbox" id="right-sn-offline"> 
                        <label for="right-sn-offline">Offline (zeros)</label><br>
                        <label for="right-sn">Serial (max 16):</label>
                        <input type="text" id="right-sn" maxlength="16" value="R_SERIAL_67890" style="width: 90%;">
                    </fieldset>
                </div>
                <div id="headset-options-0x02" style="display:none;">
                    <fieldset>
                        <legend>Headset</legend>
                        <label for="headset-sn">Serial (max 16):</label>
                        <input type="text" id="headset-sn" maxlength="16" value="H_SERIAL_ABCDE" style="width: 90%;">
                    </fieldset>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x02', 'change', (e) => {
            document.getElementById('response-options-0x02').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });

        this.addListener('field-product-type-0x02', 'change', (e) => {
            document.getElementById('earbuds-options-0x02').style.display = 
                e.target.value === 'earbuds' ? 'block' : 'none';
            document.getElementById('headset-options-0x02').style.display = 
                e.target.value === 'headset' ? 'block' : 'none';
        });

        ['left', 'right'].forEach(side => {
            const offlineCheckbox = document.getElementById(`${side}-sn-offline`);
            const snInput = document.getElementById(`${side}-sn`);
            if (offlineCheckbox && snInput) {
                offlineCheckbox.addEventListener('change', (e) => {
                    snInput.disabled = e.target.checked;
                    if (e.target.checked) snInput.value = '';
                    if (typeof generateOutput === 'function') generateOutput();
                });
            }
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        
        const productType = document.getElementById('field-product-type-0x02').value;
        if (productType === 'earbuds') {
            const leftSn = document.getElementById('left-sn-offline').checked ? 
                '' : document.getElementById('left-sn').value;
            const rightSn = document.getElementById('right-sn-offline').checked ? 
                '' : document.getElementById('right-sn').value;
            return [
                ...this.stringToPaddedBytes(leftSn, 16), 
                ...this.stringToPaddedBytes(rightSn, 16)
            ];
        }
        return this.stringToPaddedBytes(document.getElementById('headset-sn').value, 16);
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x02').value, 10);
    }
}

// Register the command class globally
window.Command02 = Command02;
