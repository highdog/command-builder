/**
 * Command 0x02 - Serial Number Query/Response
 * Handles device serial number information queries and responses
 */
class Command02 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x02">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x02" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x02">
                <div class="form-group">
                    <label for="field-product-type-0x02">${isZh ? '产品类型:' : 'Product Type:'}</label>
                    <select id="field-product-type-0x02" class="payload-input">
                        <option value="earbuds">${isZh ? '耳机' : 'Earbuds'}</option>
                        <option value="headset">${isZh ? '头戴式耳机' : 'Headset'}</option>
                    </select>
                </div>
                <div id="earbuds-options-0x02">
                    <fieldset>
                        <legend>${isZh ? '左耳机' : 'Left Earbud'}</legend>
                        <input type="checkbox" id="left-sn-offline">
                        <label for="left-sn-offline">${isZh ? '离线 (零值)' : 'Offline (zeros)'}</label><br>
                        <label for="left-sn">${isZh ? '序列号 (最多16位):' : 'Serial (max 16):'}</label>
                        <input type="text" id="left-sn" maxlength="16" value="L_SERIAL_12345" style="width: 90%;">
                    </fieldset>
                    <fieldset>
                        <legend>${isZh ? '右耳机' : 'Right Earbud'}</legend>
                        <input type="checkbox" id="right-sn-offline">
                        <label for="right-sn-offline">${isZh ? '离线 (零值)' : 'Offline (zeros)'}</label><br>
                        <label for="right-sn">${isZh ? '序列号 (最多16位):' : 'Serial (max 16):'}</label>
                        <input type="text" id="right-sn" maxlength="16" value="R_SERIAL_67890" style="width: 90%;">
                    </fieldset>
                </div>
                <div id="headset-options-0x02" style="display:none;">
                    <fieldset>
                        <legend>${isZh ? '头戴式耳机' : 'Headset'}</legend>
                        <label for="headset-sn">${isZh ? '序列号 (最多16位):' : 'Serial (max 16):'}</label>
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
