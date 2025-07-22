/**
 * Command 0x21 - Auto-generated from command_handlers.js
 */
class Command21 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label>数据包类型: COMMAND</label>
                    <p>重置设备使用统计数据（空载荷）</p>
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