/**
 * Command 0x59 - Button Mapping Configuration
 * Handles button mapping configuration for earbuds and headsets
 */
class Command59 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // Constants for v2 payload
        this.locations = {
            earbuds: { 'LEFT': 0, 'RIGHT': 1 },
            headset: { 'MFB': 0, 'Volume+': 1, 'Volume-': 2 }
        };
        
        this.triggers = { 
            'SINGLE_TAP': 0, 
            'DOUBLE_TAP': 1, 
            'TRIPLE_TAP': 2, 
            'LONG_PRESS': 3, 
            'SINGLE_THEN_LONG_PRESS': 4, 
            'DOUBLE_THEN_LONG_PRESS': 5, 
            'FOUR_TAP': 6 
        };
        
        this.actions = { 
            'NONE': 0, 
            'PLAY_PAUSE': 1, 
            'NEXT_SONG': 2, 
            'PREVIOUS_SONG': 3, 
            'VOICE_ASSISTANT': 4, 
            'VOLUME_UP': 5, 
            'VOLUME_DOWN': 6, 
            'SWITCH_ANC_MODE': 7, 
            'SWITCH_TRANSPARENCY_MODE': 8, 
            'SWITCH_GAMING_MODE': 9 
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x59">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x59" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE</option>
                </select>
            </div>
            <div id="response-options-0x59">
                <div class="form-group">
                    <label for="field-product-type-0x59">${isZh ? '产品类型:' : 'Product Type:'}</label>
                    <select id="field-product-type-0x59" class="payload-input">
                        <option value="earbuds">${isZh ? '耳机' : 'Earbuds'}</option>
                        <option value="headset">${isZh ? '头戴式耳机' : 'Headset'}</option>
                    </select>
                </div>
                <div id="mappings-container-0x59"></div>
                <button type="button" id="add-mapping-btn-0x59" class="button" style="width: 100%; margin-top: 1rem;">${isZh ? '+ 添加按键映射' : '+ Add Button Mapping'}</button>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
        this.addMappingRow(); // Add one row by default
    }

    addMappingRow(location = 0, trigger = 0, action = 0) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const container = document.getElementById('mappings-container-0x59');
        const productType = document.getElementById('field-product-type-0x59').value;
        const locationOptions = this.locations[productType];

        const fieldset = document.createElement('fieldset');
        fieldset.className = 'mapping-row';
        fieldset.innerHTML = `
            <legend>${isZh ? '映射' : 'Mapping'} #${container.children.length + 1}</legend>
            <div class="form-group">
                <label>${isZh ? '位置:' : 'Location:'}</label>
                <select class="mapping-location">${this.createSelect(locationOptions, location)}</select>
            </div>
            <div class="form-group">
                <label>${isZh ? '触发方式:' : 'Trigger:'}</label>
                <select class="mapping-trigger">${this.createSelect(this.triggers, trigger)}</select>
            </div>
            <div class="form-group">
                <label>${isZh ? '动作:' : 'Action:'}</label>
                <select class="mapping-action">${this.createSelect(this.actions, action)}</select>
            </div>
            <button type="button" class="remove-mapping-btn button-danger">${isZh ? '移除' : 'Remove'}</button>
        `;
        container.appendChild(fieldset);
        if (typeof generateOutput === 'function') generateOutput();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x59', 'change', (e) => {
            document.getElementById('response-options-0x59').style.display = 
                e.target.value !== '0' ? 'block' : 'none';
        });

        document.getElementById('add-mapping-btn-0x59').addEventListener('click', () => {
            this.addMappingRow();
        });
        
        document.getElementById('mappings-container-0x59').addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('remove-mapping-btn')) {
                e.target.closest('.mapping-row').remove();
                if (typeof generateOutput === 'function') generateOutput();
            }
        });
        
        this.addListener('field-product-type-0x59', 'change', () => {
            document.getElementById('mappings-container-0x59').innerHTML = '';
            this.addMappingRow();
        });
    }

    getPayload() {
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
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x59').value, 10);
    }
}

// Register the command class globally
window.Command59 = Command59;
