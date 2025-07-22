/**
 * Command 0x20 - Auto-generated from command_handlers.js
 */
class Command20 extends BaseCommand {
    constructor(commandId) {
    super(commandId);

        this.statisticsTypes = {
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
        };
    }

    render(container) {
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
    }

    

        addStatisticsItem(type = '0x00', value = 0) {
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
    }

    

        renderStatisticsContent(type, value) {
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
    }

    

        attachListeners() {
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
    }

    

        getPayload() {
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
    }

    

        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x20').value, 10);
        }
    
}

// Register the command class globally
window.Command20 = Command20;