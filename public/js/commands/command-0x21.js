/**
 * Command 0x21 - Auto-generated from command_handlers.js
 */
class Command21 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            const currentLang = i18nManager.getCurrentLanguage();
            const isZh = currentLang === 'zh';

            let html = `
                <div class="form-group">
                    <label>${isZh ? '数据包类型: COMMAND' : 'Packet Type: COMMAND'}</label>
                    <p>${isZh ? '重置设备使用统计数据（空载荷）' : 'Reset device usage statistics (empty payload)'}</p>
                </div>
            `;
            container.innerHTML = html;
        }
        getPayload() {
            return [];
        }
        getPacketType() {
            return 0; // COMMAND
        }
    
}

// Register the command class globally
window.Command21 = Command21;