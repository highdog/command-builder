// 0x01 Register Notification Listeners (注册通知监听器)
class Command01 extends BaseCommand {
    constructor() {
        super();
        this.commandId = '0x01';
        this.commandName = 'Register Notification Listeners';
        this.commandNameZh = '注册通知监听器';
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        container.innerHTML = `
            <div class="form-section">
                <h4>${isZh ? '注册通知监听器' : 'Register Notification Listeners'}</h4>
                
                <div class="form-group">
                    <label for="field-packet-type">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type">
                        <option value="0">COMMAND</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>

                
            </div>
        `;
        
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type', 'change');
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) {
            // COMMAND: Register listeners request payload: constant 0x11
            return [0x11];
        } else {
            // RESPONSE: Empty payload
            return [];
        }
    }

    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }
}

// 注册命令
window.Command01 = Command01;
