// 0x08 Set Bluetooth Led Configurations (设置蓝牙指示灯配置)
class Command08 extends BaseCommand {
    constructor() {
        super();
        this.commandId = '0x08';
        this.commandName = 'Set Bluetooth Led Configurations';
        this.commandNameZh = '设置蓝牙指示灯配置';
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        container.innerHTML = `
            <div class="form-section">
                <h4>${isZh ? '设置蓝牙LED配置' : 'Set Bluetooth LED Configurations'}</h4>
                
                <div class="form-group">
                    <label for="field-packet-type">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type">
                        <option value="0">COMMAND</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="field-led-config">${isZh ? 'LED配置:' : 'LED Configuration:'}</label>
                    <select id="field-led-config">
                        <option value="0">${isZh ? '开启' : 'On'}</option>
                        <option value="1">${isZh ? '关闭' : 'Off'}</option>
                    </select>
                </div>
            </div>
        `;
        
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type', 'change');
        this.addListener('field-led-config', 'change');
    }

    getPayload() {
        const packetType = this.getPacketType();
        const ledConfig = document.getElementById('field-led-config')?.value || '0';
        
        if (packetType === 0) {
            // COMMAND: Bluetooth led configurations payload
            return [parseInt(ledConfig)];
        } else {
            // RESPONSE: Same format - the actual data that was applied
            return [parseInt(ledConfig)];
        }
    }

    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }
}

// 注册命令
window.Command08 = Command08;
