/**
 * Command 0x14 - Auto-generated from command_handlers.js
 */
class Command14 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x14">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type-0x14" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x14">
                    <div class="form-group">
                        <label for="field-product-type-0x14">${isZh ? '产品类型:' : 'Product Type:'}</label>
                        <select id="field-product-type-0x14" class="payload-input">
                            <option value="earbuds">${isZh ? '耳机' : 'Earbuds'}</option>
                            <option value="headset">${isZh ? '头戴式耳机' : 'Headset'}</option>
                        </select>
                    </div>
                    <div id="earbuds-options-0x14">
                        ${this.createVersionFields('left', isZh ? '左耳机' : 'Left Earbud', '1.6.1', isZh)}
                        ${this.createVersionFields('right', isZh ? '右耳机' : 'Right Earbud', '1.6.2', isZh)}
                        ${this.createVersionFields('case', isZh ? '充电盒' : 'Charging Case', '1.0.0', isZh)}
                    </div>
                    <div id="headset-options-0x14" style="display:none;">
                        ${this.createVersionFields('headset', isZh ? '头戴式耳机' : 'Headset', '2.0.0', isZh)}
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        createVersionFields(idPrefix, legend, defaultVersion, isZh = false) {
            const [maj, min, pat] = defaultVersion.split('.');
            return `
                <fieldset>
                    <legend>${legend}</legend>
                    <input type="checkbox" id="${idPrefix}-fw-offline"> <label for="${idPrefix}-fw-offline">${isZh ? '离线 (零值)' : 'Offline (zeros)'}</label><br>
                    <label>${isZh ? '版本:' : 'Ver:'}</label>
                    <input type="number" id="${idPrefix}-fw-major" min="0" max="255" value="${maj}" style="width: 50px;">.
                    <input type="number" id="${idPrefix}-fw-minor" min="0" max="255" value="${min}" style="width: 50px;">.
                    <input type="number" id="${idPrefix}-fw-patch" min="0" max="255" value="${pat}" style="width: 50px;">
                </fieldset>
            `;
        }
        attachListeners() {
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
        }
        getPayload() {
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
        }
        getPacketType() { return parseInt(document.getElementById('field-packet-type-0x14').value, 10); }
    
}

// Register the command class globally
window.Command14 = Command14;