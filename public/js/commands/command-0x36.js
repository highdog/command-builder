/**
 * Command 0x36 - Adaptive ANC Level
 * 自适应ANC等级控制
 */
class Command36 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        let html = `
            <div class="form-group">
                <label for="field-packet-type-0x36">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x36" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE</option>
                    <option value="1">NOTIFICATION</option>
                </select>
            </div>
            <div id="response-options-0x36">
                <div class="form-group">
                    <label for="field-adaptive-anc-level-0x36">${isZh ? '自适应ANC级别:' : 'Adaptive ANC Level:'}</label>
                    <select id="field-adaptive-anc-level-0x36" class="payload-input">
                        <option value="0x00">${isZh ? '高' : 'HIGH'}</option>
                        <option value="0x01" selected>${isZh ? '中' : 'MIDDLE'}</option>
                        <option value="0x02">${isZh ? '低' : 'LOW'}</option>
                    </select>
                </div>
            </div>
        `;
            container.innerHTML = html;
            this.attachListeners();
    }

    attachListeners() {
            document.getElementById('field-packet-type-0x36').addEventListener('change', (e) => {
                document.getElementById('response-options-0x36').style.display = e.target.value !== '0' ? 'block' : 'none';
                generateOutput();
            });
    }

    getPayload() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-adaptive-anc-level-0x36').value, 16)];
    }

    getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x36').value, 10);
    }
}

// Register the command class globally
window.Command36 = Command36;