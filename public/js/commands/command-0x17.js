/**
 * Command 0x17 - Auto-generated from command_handlers.js
 */
class Command17 extends BaseCommand {
    constructor(commandId) {
        super(commandId);

        this.types = { 'DONGLE': 0 };
        this.states = { 'DISCONNECTED': 0, 'CONNECTED': 1 };
    }

    render(container) {
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
    }

    addPeripheralRow(type = 0, state = 1) {
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
    }

    attachListeners() {
            document.getElementById('field-packet-type-0x17').addEventListener('change', (e) => { document.getElementById('response-options-0x17').style.display = e.target.value !== '0' ? 'block' : 'none'; generateOutput(); });
            document.getElementById('add-peripheral-btn-0x17').addEventListener('click', () => this.addPeripheralRow());
            document.getElementById('peripheral-container-0x17').addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-peripheral-btn')) {
                    e.target.closest('.peripheral-row').remove();
                    generateOutput();
                }
            });
    }

    getPayload() {
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
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x17').value, 10);
    }
}

// Register the command class globally
window.Command17 = Command17;