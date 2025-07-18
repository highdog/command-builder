// This file defines the specific UI and payload generation logic for each command.
// It is included before the main script in command_builder.html.

const customCommandHandlers = {
    '0x00': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x00">数据包类型:</label>
                    <select id="field-packet-type-0x00" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE (device reply)</option>
                    </select>
                </div>
                <div id="response-options-0x00">
                    <div class="form-group">
                        <label for="field-device-type-0x00">设备型号:</label>
                        <select id="field-device-type-0x00" class="payload-input">
                            <option value="0x00">VERIO_100</option>
                            <option value="0x01">VERIO_200</option>
                            <option value="0x02">VERIO_300</option>
                            <option value="0x03">AVENTHO_300</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x00').addEventListener('change', (e) => {
                document.getElementById('response-options-0x00').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-device-type-0x00').value, 16)];
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x00').value, 10);
        }
    },
    '0x02': {
        stringToPaddedBytes: function(str, length) {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(str);
            const padded = new Uint8Array(length);
            padded.set(encoded.slice(0, length));
            return Array.from(padded);
        },
        render: function(container) {
            let html = `
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
                        <fieldset><legend>Left Earbud</legend><input type="checkbox" id="left-sn-offline"> <label for="left-sn-offline">Offline (zeros)</label><br><label for="left-sn">Serial (max 16):</label><input type="text" id="left-sn" maxlength="16" value="L_SERIAL_12345" style="width: 90%;"></fieldset>
                        <fieldset><legend>Right Earbud</legend><input type="checkbox" id="right-sn-offline"> <label for="right-sn-offline">Offline (zeros)</label><br><label for="right-sn">Serial (max 16):</label><input type="text" id="right-sn" maxlength="16" value="R_SERIAL_67890" style="width: 90%;"></fieldset>
                    </div>
                    <div id="headset-options-0x02" style="display:none;"><fieldset><legend>Headset</legend><label for="headset-sn">Serial (max 16):</label><input type="text" id="headset-sn" maxlength="16" value="H_SERIAL_ABCDE" style="width: 90%;"></fieldset></div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x02').addEventListener('change', (e) => { document.getElementById('response-options-0x02').style.display = e.target.value === '2' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('field-product-type-0x02').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x02').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x02').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            ['left', 'right'].forEach(side => {
                const offlineCheckbox = document.getElementById(`${side}-sn-offline`);
                const snInput = document.getElementById(`${side}-sn`);
                offlineCheckbox.addEventListener('change', (e) => { snInput.disabled = e.target.checked; if (e.target.checked) snInput.value = ''; generateOutput(); });
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            const productType = document.getElementById('field-product-type-0x02').value;
            if (productType === 'earbuds') {
                const leftSn = document.getElementById('left-sn-offline').checked ? '' : document.getElementById('left-sn').value;
                const rightSn = document.getElementById('right-sn-offline').checked ? '' : document.getElementById('right-sn').value;
                return [...this.stringToPaddedBytes(leftSn, 16), ...this.stringToPaddedBytes(rightSn, 16)];
            }
            return this.stringToPaddedBytes(document.getElementById('headset-sn').value, 16);
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x02').value, 10); }
    },
    '0x03': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x03">数据包类型:</label>
                    <select id="field-packet-type-0x03" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE (device reply)</option>
                    </select>
                </div>
                <div id="response-options-0x03">
                    <div class="form-group">
                        <label for="field-feature-version-0x03">Feature Version (0-255):</label>
                        <input type="number" id="field-feature-version-0x03" min="0" max="255" value="0" style="width: 90%;">
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x03').addEventListener('change', (e) => {
                document.getElementById('response-options-0x03').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-feature-version-0x03').value) || 0];
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x03').value, 10); }
    },
    '0x06': {
        render: function(container) {
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
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x06').addEventListener('change', (e) => { document.getElementById('response-options-0x06').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('field-product-type-0x06').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x06').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x06').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            ['left', 'right', 'case'].forEach(item => {
                const offlineCheckbox = document.getElementById(`${item}-bat-offline`);
                const batInput = document.getElementById(`${item}-bat`);
                if(offlineCheckbox) offlineCheckbox.addEventListener('change', (e) => { batInput.disabled = e.target.checked; generateOutput(); });
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            const productType = document.getElementById('field-product-type-0x06').value;
            if (productType === 'earbuds') {
                return ['left', 'right', 'case'].map(item => {
                    if (document.getElementById(`${item}-bat-offline`).checked) return 0xFF;
                    return parseInt(document.getElementById(`${item}-bat`).value) || 0;
                });
            }
            return [parseInt(document.getElementById('headset-bat').value) || 0];
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x06').value, 10); }
    },
    '0x07': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x07">数据包类型:</label>
                    <select id="field-packet-type-0x07" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                        <option value="1">NOTIFICATION</option>
                    </select>
                </div>
                <div id="response-options-0x07">
                    <div class="form-group">
                        <label for="field-bt-led-config-0x07">Bluetooth LED Config:</label>
                        <select id="field-bt-led-config-0x07" class="payload-input">
                            <option value="0x00">On</option>
                            <option value="0x01">Off</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x07').addEventListener('change', (e) => {
                document.getElementById('response-options-0x07').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            const config = parseInt(document.getElementById('field-bt-led-config-0x07').value, 16);
            return [config];
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x07').value, 10);
        }
    },
    '0x41': {
        render: function(container) {
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
        },
        attachListeners: function() {
            document.getElementById('field-product-type-0x41').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x41').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x41').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            ['left', 'right'].forEach(side => {
                const offlineCheckbox = document.getElementById(`${side}-offline`);
                const hoursInput = document.getElementById(`${side}-hours`);
                const minutesInput = document.getElementById(`${side}-minutes`);
                offlineCheckbox.addEventListener('change', (e) => { hoursInput.disabled = e.target.checked; minutesInput.disabled = e.target.checked; generateOutput(); });
            });
        },
        getPayload: function() {
            const payload = [];
            const productType = document.getElementById('field-product-type-0x41').value;
            if (productType === 'earbuds') {
                ['left', 'right'].forEach(side => {
                    if (document.getElementById(`${side}-offline`).checked) { payload.push(0xFF, 0xFF); }
                    else { payload.push(parseInt(document.getElementById(`${side}-hours`).value) || 0, parseInt(document.getElementById(`${side}-minutes`).value) || 0); }
                });
            } else { payload.push(parseInt(document.getElementById('headset-hours').value) || 0, parseInt(document.getElementById('headset-minutes').value) || 0); }
            return payload;
        },
        getPacketType: function() { return 2; }
    }
};
// This is a global function that the handlers can call.
// It assumes `generateOutput` is defined in the main HTML file's script.
function triggerGenerateOutput() {
    if (typeof generateOutput === 'function') {
        generateOutput();
    }
}
