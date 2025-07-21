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
    '0x09': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x09">数据包类型:</label>
                    <select id="field-packet-type-0x09" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x09">
                    <fieldset>
                        <legend>LE Configurations (0=ON, 1=OFF)</legend>
                        <div><input type="checkbox" id="gfp-on" checked> <label for="gfp-on">Google Fast Pair (ON)</label></div>
                        <div><input type="checkbox" id="lea-on"> <label for="lea-on">LE Audio (ON)</label></div>
                    </fieldset>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x09').addEventListener('change', (e) => {
                document.getElementById('response-options-0x09').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            
            let payloadByte = 0b00000000;
            
            if (!document.getElementById('gfp-on').checked) {
                payloadByte |= (1 << 0);
            }
            if (!document.getElementById('lea-on').checked) {
                payloadByte |= (1 << 1);
            }
            
            return [payloadByte];
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x09').value, 10);
        }
    },
    '0x14': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x14">数据包类型:</label>
                    <select id="field-packet-type-0x14" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x14">
                    <div class="form-group">
                        <label for="field-product-type-0x14">产品类型:</label>
                        <select id="field-product-type-0x14" class="payload-input">
                            <option value="earbuds">Earbuds</option>
                            <option value="headset">Headset</option>
                        </select>
                    </div>
                    <div id="earbuds-options-0x14">
                        ${this.createVersionFields('left', 'Left Earbud', '1.6.1')}
                        ${this.createVersionFields('right', 'Right Earbud', '1.6.2')}
                        ${this.createVersionFields('case', 'Charging Case', '1.0.0')}
                    </div>
                    <div id="headset-options-0x14" style="display:none;">
                        ${this.createVersionFields('headset', 'Headset', '2.0.0')}
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        createVersionFields: function(idPrefix, legend, defaultVersion) {
            const [maj, min, pat] = defaultVersion.split('.');
            return `
                <fieldset>
                    <legend>${legend}</legend>
                    <input type="checkbox" id="${idPrefix}-fw-offline"> <label for="${idPrefix}-fw-offline">Offline (zeros)</label><br>
                    <label>Ver:</label>
                    <input type="number" id="${idPrefix}-fw-major" min="0" max="255" value="${maj}" style="width: 50px;">.
                    <input type="number" id="${idPrefix}-fw-minor" min="0" max="255" value="${min}" style="width: 50px;">.
                    <input type="number" id="${idPrefix}-fw-patch" min="0" max="255" value="${pat}" style="width: 50px;">
                </fieldset>
            `;
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x14').addEventListener('change', (e) => { document.getElementById('response-options-0x14').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('field-product-type-0x14').addEventListener('change', (e) => { document.getElementById('earbuds-options-0x14').style.display = e.target.value === 'earbuds' ? 'block' : 'none'; document.getElementById('headset-options-0x14').style.display = e.target.value === 'headset' ? 'block' : 'none'; generateOutput(); });
            
            ['left', 'right', 'case', 'headset'].forEach(idPrefix => {
                const offlineCheckbox = document.getElementById(`${idPrefix}-fw-offline`);
                if (offlineCheckbox) {
                    offlineCheckbox.addEventListener('change', (e) => {
                        const isOffline = e.target.checked;
                        document.getElementById(`${idPrefix}-fw-major`).disabled = isOffline;
                        document.getElementById(`${idPrefix}-fw-minor`).disabled = isOffline;
                        document.getElementById(`${idPrefix}-fw-patch`).disabled = isOffline;
                        generateOutput();
                    });
                }
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            
            const getVersionBytes = (idPrefix) => {
                if (document.getElementById(`${idPrefix}-fw-offline`)?.checked) {
                    return [0, 0, 0];
                }
                const maj = parseInt(document.getElementById(`${idPrefix}-fw-major`).value) || 0;
                const min = parseInt(document.getElementById(`${idPrefix}-fw-minor`).value) || 0;
                const pat = parseInt(document.getElementById(`${idPrefix}-fw-patch`).value) || 0;
                return [maj, min, pat];
            };

            const productType = document.getElementById('field-product-type-0x14').value;
            if (productType === 'earbuds') {
                return [
                    ...getVersionBytes('left'),
                    ...getVersionBytes('right'),
                    ...getVersionBytes('case')
                ];
            } else { // headset
                return getVersionBytes('headset');
            }
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x14').value, 10); }
    },
    '0x15': {
        render: function(container) {
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
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x15').addEventListener('change', (e) => {
                document.getElementById('response-options-0x15').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            const color = parseInt(document.getElementById('field-color-0x15').value, 16);
            const onlineStatus = parseInt(document.getElementById('field-online-status-0x15').value, 16);
            return [color, onlineStatus];
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x15').value, 10);
        }
    },
    '0x16': {
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x16">数据包类型:</label>
                    <select id="field-packet-type-0x16" class="payload-input">
                        <option value="0" selected>COMMAND (set color)</option>
                        <option value="2">RESPONSE (result status)</option>
                    </select>
                </div>
                <div id="command-options-0x16">
                    <div class="form-group">
                        <label for="field-color-0x16">Earbuds Color:</label>
                        <select id="field-color-0x16" class="payload-input">
                            <option value="0x00">Color1</option>
                            <option value="0x01">Color2</option>
                            <option value="0x02">Color3</option>
                            <option value="0x03">Color4</option>
                        </select>
                    </div>
                </div>
                <div id="response-options-0x16" style="display:none;">
                    <div class="form-group">
                        <label for="field-status-0x16">Result Status:</label>
                        <select id="field-status-0x16" class="payload-input">
                            <option value="0x00">FAILED</option>
                            <option value="0x01">LEFT successful</option>
                            <option value="0x02">RIGHT successful</option>
                            <option value="0x03">BOTH successful</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x16').addEventListener('change', (e) => {
                const isCommand = e.target.value === '0';
                document.getElementById('command-options-0x16').style.display = isCommand ? 'block' : 'none';
                document.getElementById('response-options-0x16').style.display = isCommand ? 'none' : 'block';
                generateOutput();
            });
        },
        getPayload: function() {
            const packetType = this.getPacketType();
            if (packetType === 0) { // COMMAND
                const color = parseInt(document.getElementById('field-color-0x16').value, 16);
                return [color];
            } else { // RESPONSE
                const status = parseInt(document.getElementById('field-status-0x16').value, 16);
                return [status];
            }
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x16').value, 10);
        }
    },
    '0x17': {
        types: { 'DONGLE': 0 },
        states: { 'DISCONNECTED': 0, 'CONNECTED': 1 },
        createSelect: function(options, selectedValue) {
            return Object.entries(options).map(([name, value]) => `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${name}</option>`).join('');
        },
        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x17">数据包类型:</label>
                    <select id="field-packet-type-0x17" class="payload-input"><option value="0">COMMAND (get)</option><option value="2" selected>RESPONSE</option><option value="1">NOTIFICATION</option></select>
                </div>
                <div id="response-options-0x17">
                    <div id="peripheral-container-0x17"></div>
                    <button type="button" id="add-peripheral-btn-0x17" class="button" style="width: 100%; margin-top: 1rem;">+ 添加外设状态</button>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
            this.addPeripheralRow();
        },
        addPeripheralRow: function(type = 0, state = 1) {
            const container = document.getElementById('peripheral-container-0x17');
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'peripheral-row';
            fieldset.innerHTML = `
                <legend>Peripheral #${container.children.length + 1}</legend>
                <div class="form-group"><label>Type:</label><select class="peripheral-type">${this.createSelect(this.types, type)}</select></div>
                <div class="form-group"><label>State:</label><select class="peripheral-state">${this.createSelect(this.states, state)}</select></div>
                <button type="button" class="remove-peripheral-btn button-danger">移除</button>
            `;
            container.appendChild(fieldset);
            generateOutput();
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x17').addEventListener('change', (e) => { document.getElementById('response-options-0x17').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('add-peripheral-btn-0x17').addEventListener('click', () => this.addPeripheralRow());
            document.getElementById('peripheral-container-0x17').addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-peripheral-btn')) {
                    e.target.closest('.peripheral-row').remove();
                    generateOutput();
                }
            });
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            const payload = [];
            document.querySelectorAll('#peripheral-container-0x17 .peripheral-row').forEach(row => {
                const type = parseInt(row.querySelector('.peripheral-type').value, 10);
                const state = parseInt(row.querySelector('.peripheral-state').value, 10);
                // Bits 0-5 for type, Bits 6-7 for state
                const combined = (type & 0x3F) | ((state & 0x03) << 6);
                payload.push(combined);
            });
            return payload;
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x17').value, 10); }
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
    },
    '0x59': {
        // --- Constants for v2 payload ---
        locations: {
            earbuds: { 'LEFT': 0, 'RIGHT': 1 },
            headset: { 'MFB': 0, 'Volume+': 1, 'Volume-': 2 }
        },
        triggers: { 'SINGLE_TAP': 0, 'DOUBLE_TAP': 1, 'TRIPLE_TAP': 2, 'LONG_PRESS': 3, 'SINGLE_THEN_LONG_PRESS': 4, 'DOUBLE_THEN_LONG_PRESS': 5, 'FOUR_TAP': 6 },
        actions: { 'NONE': 0, 'PLAY_PAUSE': 1, 'NEXT_SONG': 2, 'PREVIOUS_SONG': 3, 'VOICE_ASSISTANT': 4, 'VOLUME_UP': 5, 'VOLUME_DOWN': 6, 'SWITCH_ANC_MODE': 7, 'SWITCH_TRANSPARENCY_MODE': 8, 'SWITCH_GAMING_MODE': 9 },

        createSelect: function(options, selectedValue) {
            return Object.entries(options).map(([name, value]) => `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${name}</option>`).join('');
        },

        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x59">数据包类型:</label>
                    <select id="field-packet-type-0x59" class="payload-input"><option value="0">COMMAND (get)</option><option value="2" selected>RESPONSE</option></select>
                </div>
                <div id="response-options-0x59">
                    <div class="form-group">
                        <label for="field-product-type-0x59">产品类型:</label>
                        <select id="field-product-type-0x59" class="payload-input"><option value="earbuds">Earbuds</option><option value="headset">Headset</option></select>
                    </div>
                    <div id="mappings-container-0x59"></div>
                    <button type="button" id="add-mapping-btn-0x59" class="button" style="width: 100%; margin-top: 1rem;">+ 添加按键映射</button>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
            this.addMappingRow(); // Add one row by default
        },

        addMappingRow: function(location = 0, trigger = 0, action = 0) {
            const container = document.getElementById('mappings-container-0x59');
            const productType = document.getElementById('field-product-type-0x59').value;
            const locationOptions = this.locations[productType];
            
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'mapping-row';
            fieldset.innerHTML = `
                <legend>Mapping #${container.children.length + 1}</legend>
                <div class="form-group"><label>Location:</label><select class="mapping-location">${this.createSelect(locationOptions, location)}</select></div>
                <div class="form-group"><label>Trigger:</label><select class="mapping-trigger">${this.createSelect(this.triggers, trigger)}</select></div>
                <div class="form-group"><label>Action:</label><select class="mapping-action">${this.createSelect(this.actions, action)}</select></div>
                <button type="button" class="remove-mapping-btn button-danger">移除</button>
            `;
            container.appendChild(fieldset);
            generateOutput();
        },

        attachListeners: function() {
            document.getElementById('field-packet-type-0x59').addEventListener('change', (e) => { document.getElementById('response-options-0x59').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('add-mapping-btn-0x59').addEventListener('click', () => this.addMappingRow());
            
            document.getElementById('mappings-container-0x59').addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-mapping-btn')) {
                    e.target.closest('.mapping-row').remove();
                    generateOutput();
                }
            });
            
            document.getElementById('field-product-type-0x59').addEventListener('change', () => {
                document.getElementById('mappings-container-0x59').innerHTML = '';
                this.addMappingRow();
            });
        },

        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            
            const payload = [];
            const rows = document.querySelectorAll('#mappings-container-0x59 .mapping-row');
            
            rows.forEach(row => {
                const location = parseInt(row.querySelector('.mapping-location').value, 10);
                const trigger = parseInt(row.querySelector('.mapping-trigger').value, 10);
                const action = parseInt(row.querySelector('.mapping-action').value, 10);

                const combined = (action << 8) | (trigger << 3) | location;

                payload.push((combined >> 8) & 0xFF);
                payload.push(combined & 0xFF);
            });
            
            return payload;
        },
        getPacketType: function() { return parseInt(document.getElementById('field-packet-type-0x59').value, 10); }
    },
    '0x19': {
        render: function(container) {
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
        },
        attachListeners: function() {
            document.getElementById('field-packet-type-0x19').addEventListener('change', (e) => {
                document.getElementById('response-options-0x19').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
            document.getElementById('field-product-type-0x19').addEventListener('change', (e) => {
                document.getElementById('earbuds-options-0x19').style.display = e.target.value === 'earbuds' ? 'block' : 'none';
                document.getElementById('headset-options-0x19').style.display = e.target.value === 'headset' ? 'block' : 'none';
                generateOutput();
            });
        },
        macToBytes: function(macString) {
            // Convert MAC address string "AA:BB:CC:DD:EE:FF" to 6 bytes array
            const cleanMac = macString.replace(/[^0-9A-Fa-f]/g, '');
            if (cleanMac.length !== 12) return [0, 0, 0, 0, 0, 0];
            
            const bytes = [];
            for (let i = 0; i < 12; i += 2) {
                bytes.push(parseInt(cleanMac.substr(i, 2), 16));
            }
            return bytes;
        },
        getPayload: function() {
            if (this.getPacketType() === 0) return [];
            
            const productType = document.getElementById('field-product-type-0x19').value;
            if (productType === 'earbuds') {
                const leftMac = this.macToBytes(document.getElementById('left-mac-0x19').value);
                const rightMac = this.macToBytes(document.getElementById('right-mac-0x19').value);
                return [...leftMac, ...rightMac];
            } else {
                return this.macToBytes(document.getElementById('headset-mac-0x19').value);
            }
        },
        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x19').value, 10);
        }
    },
    '0x20': {
        statisticsTypes: {
            '0x00': 'Total Runtime',
            '0x01': 'Power On Events', 
            '0x02': 'Music Playback Time',
            '0x03': 'Voice Call Time',
            '0x04': 'Error Counter Total',
            '0x05': 'Accepted Calls Counter',
            '0x06': 'Button Presses Counter',
            '0x07': 'Volume Level Lifetime Average',
            '0x08': 'Time Multipoint Mode Used',
            '0x09': 'Time ANC Mode Used',
            '0x0A': 'Time Low Latency Mode Used',
            '0x0B': 'Error Information'
        },

        render: function(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x20">数据包类型:</label>
                    <select id="field-packet-type-0x20" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE (device reply)</option>
                    </select>
                </div>
                <div id="command-options-0x20" style="display:none;">
                    <div class="form-group">
                        <label for="field-index-0x20">Index (0-255):</label>
                        <input type="number" id="field-index-0x20" min="0" max="255" value="0" style="width: 90%;">
                    </div>
                </div>
                <div id="response-options-0x20">
                    <div class="form-group">
                        <label>Statistics Items:</label>
                        <div id="statistics-container-0x20"></div>
                        <button type="button" id="add-statistics-btn-0x20" class="button" style="width: 100%; margin-top: 1rem;">+ 添加统计项</button>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
            this.addStatisticsItem(); // Add one item by default
        },

        addStatisticsItem: function(type = '0x00', value = 0) {
            const container = document.getElementById('statistics-container-0x20');
            const itemIndex = container.children.length;
            
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'statistics-item';
            fieldset.innerHTML = `
                <legend>Statistics Item #${itemIndex + 1}</legend>
                <div class="form-group">
                    <label>Type:</label>
                    <select class="statistics-type">
                        ${Object.entries(this.statisticsTypes).map(([value, name]) => 
                            `<option value="${value}" ${value === type ? 'selected' : ''}>${value} - ${name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="statistics-content">
                    ${this.renderStatisticsContent(type, value)}
                </div>
                <button type="button" class="remove-statistics-btn button-danger">移除</button>
            `;
            container.appendChild(fieldset);
            
            // Add listener for type change
            fieldset.querySelector('.statistics-type').addEventListener('change', (e) => {
                const contentDiv = fieldset.querySelector('.statistics-content');
                contentDiv.innerHTML = this.renderStatisticsContent(e.target.value, 0);
                generateOutput();
            });
            
            generateOutput();
        },

        renderStatisticsContent: function(type, value) {
            switch(type) {
                case '0x07': // Volume Level Lifetime Average (1 byte)
                    return `<div class="form-group">
                        <label>Volume Level (0-32):</label>
                        <input type="number" class="statistics-value" min="0" max="32" value="${value}" style="width: 90%;">
                    </div>`;
                case '0x0B': // Error Information (variable length)
                    return `<div class="form-group">
                        <label>Error Data (hex bytes, space separated):</label>
                        <input type="text" class="statistics-value" placeholder="01 02 03 04" value="${value}" style="width: 90%;">
                    </div>`;
                default: // Most statistics are 4-byte uint32 values
                    return `<div class="form-group">
                        <label>Value (uint32):</label>
                        <input type="number" class="statistics-value" min="0" max="4294967295" value="${value}" style="width: 90%;">
                    </div>`;
            }
        },

        attachListeners: function() {
            document.getElementById('field-packet-type-0x20').addEventListener('change', (e) => {
                document.getElementById('command-options-0x20').style.display = e.target.value === '0' ? 'block' : 'none';
                document.getElementById('response-options-0x20').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
            
            document.getElementById('add-statistics-btn-0x20').addEventListener('click', () => this.addStatisticsItem());
            
            document.getElementById('statistics-container-0x20').addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-statistics-btn')) {
                    e.target.closest('.statistics-item').remove();
                    generateOutput();
                }
            });
        },

        getPayload: function() {
            const packetType = this.getPacketType();
            
            if (packetType === 0) { // COMMAND
                const index = parseInt(document.getElementById('field-index-0x20').value) || 0;
                return [index];
            } else { // RESPONSE
                const payload = [];
                const items = document.querySelectorAll('#statistics-container-0x20 .statistics-item');
                
                items.forEach(item => {
                    const type = parseInt(item.querySelector('.statistics-type').value, 16);
                    const valueInput = item.querySelector('.statistics-value');
                    
                    let content = [];
                    const typeHex = item.querySelector('.statistics-type').value;
                    
                    switch(typeHex) {
                        case '0x07': // Volume Level (1 byte)
                            content = [parseInt(valueInput.value) || 0];
                            break;
                        case '0x0B': // Error Information (variable)
                            const hexString = valueInput.value.trim();
                            if (hexString) {
                                content = hexString.split(/\s+/).map(hex => parseInt(hex, 16) || 0);
                            }
                            break;
                        default: // uint32 values (4 bytes, little endian)
                            const value = parseInt(valueInput.value) || 0;
                            content = [
                                value & 0xFF,
                                (value >> 8) & 0xFF,
                                (value >> 16) & 0xFF,
                                (value >> 24) & 0xFF
                            ];
                            break;
                    }
                    
                    // Add: type (1 byte) + length (1 byte) + content
                    payload.push(type);
                    payload.push(content.length);
                    payload.push(...content);
                });
                
                return payload;
            }
        },

        getPacketType: function() {
            return parseInt(document.getElementById('field-packet-type-0x20').value, 10);
        }
    }
};
// This is a global function that the handlers can call.
// It assumes `generateOutput` is defined in the main HTML file's script.
function triggerGenerateOutput() {
    if (typeof generateOutput === 'function') {
        generateOutput();
    }
}
