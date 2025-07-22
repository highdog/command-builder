/**
 * Command 0x41 - Auto-generated from command_handlers.js
 */
class Command41 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group"><label>数据包类型: RESPONSE</label></div>
                <div class="form-group">
                    <label for="field-product-type-0x41">产品类型:</label>
                    <select id="field-product-type-0x41" class="payload-input"><option value="earbuds">Earbuds</option><option value="headset">Headset</option></select>
                </div>
                <div id="earbuds-options-0x41">
                    <fieldset><legend>Left Earbud</legend><input type="checkbox" id="left-offline"> <label for="left-offline">Offline (0xFF)</label><br><label for="left-hours">Hours:</label><input type="number" id="left-hours" min="0" max="254" value="7" style="width: 60px;"><label for="left-minutes">Minutes:</label><input type="number" id="left-minutes" min="0" max="59" value="30" style="width: 60px;"></fieldset>
                    <fieldset><legend>Right Earbud</legend><input type="checkbox" id="right-offline"> <label for="right-offline">Offline (0xFF)</label><br><label for="right-hours">Hours:</label><input type="number" id="right-hours" min="0" max="254" value="7" style="width: 60px;"><label for="right-minutes">Minutes:</label><input type="number" id="right-minutes" min="0" max="59" value="0" style="width: 60px;"></fieldset>
                </div>
                <div id="headset-options-0x41" style="display:none;"><fieldset><legend>Headset</legend><label for="headset-hours">Hours:</label><input type="number" id="headset-hours" min="0" max="254" value="10" style="width: 60px;"><label for="headset-minutes">Minutes:</label><input type="number" id="headset-minutes" min="0" max="59" value="0" style="width: 60px;"></fieldset></div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-product-type-0x41').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x41').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x41').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            ['left', 'right'].forEach(side => {
                const offlineCheckbox = document.getElementById(`${side}-offline`);
                const hoursInput = document.getElementById(`${side}-hours`);
                const minutesInput = document.getElementById(`${side}-minutes`);
                offlineCheckbox.addEventListener('change', (e) => { hoursInput.disabled = e.target.checked; minutesInput.disabled = e.target.checked; generateOutput(); });
            });
        }
        getPayload() {
            const payload = [];
            const productType = document.getElementById('field-product-type-0x41').value;
            if (productType === 'earbuds') {
                ['left', 'right'].forEach(side => {
                    if (document.getElementById(`${side}-offline`).checked) { payload.push(0xFF, 0xFF); }
                    else { payload.push(parseInt(document.getElementById(`${side}-hours`).value) || 0, parseInt(document.getElementById(`${side}-minutes`).value) || 0); }
                });
            } else { payload.push(parseInt(document.getElementById('headset-hours').value) || 0, parseInt(document.getElementById('headset-minutes').value) || 0); }
            return payload;
        }
        getPacketType() { return 2; }
    
}

// Register the command class globally
window.Command41 = Command41;