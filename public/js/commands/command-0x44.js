/**
 * Command 0x44 - Get Equalizer Mode
 * 获取均衡器模式（支持多种EQ类型）
 */
class Command44 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 均衡器模式定义
        this.equalizerModes = {
            'OFF': 0x00,
            'ROCK': 0x01,
            'POP': 0x02,
            'JAZZ': 0x03,
            'CLASSICAL': 0x04,
            'ELECTRONIC': 0x05,
            'BASS_BOOST': 0x06,
            'TREBLE_BOOST': 0x07,
            'VOCAL': 0x08,
            'CUSTOM': 0x09,
            'FLAT': 0x0A,
            'ACOUSTIC': 0x0B,
            'LATIN': 0x0C,
            'LOUNGE': 0x0D,
            'PIANO': 0x0E,
            'R_AND_B': 0x0F
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x44">数据包类型:</label>
                <select id="field-packet-type-0x44" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x44">
                <div class="form-group">
                    <label for="field-eq-mode-0x44">均衡器模式:</label>
                    <select id="field-eq-mode-0x44" class="payload-input">
                        <option value="0x00">OFF (关闭)</option>
                        <option value="0x01">ROCK (摇滚)</option>
                        <option value="0x02">POP (流行)</option>
                        <option value="0x03">JAZZ (爵士)</option>
                        <option value="0x04">CLASSICAL (古典)</option>
                        <option value="0x05">ELECTRONIC (电子)</option>
                        <option value="0x06">BASS_BOOST (低音增强)</option>
                        <option value="0x07">TREBLE_BOOST (高音增强)</option>
                        <option value="0x08">VOCAL (人声)</option>
                        <option value="0x09">CUSTOM (自定义)</option>
                        <option value="0x0A">FLAT (平坦)</option>
                        <option value="0x0B">ACOUSTIC (原声)</option>
                        <option value="0x0C">LATIN (拉丁)</option>
                        <option value="0x0D">LOUNGE (休闲)</option>
                        <option value="0x0E">PIANO (钢琴)</option>
                        <option value="0x0F">R_AND_B (R&B)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x44', 'change', (e) => {
            document.getElementById('response-options-0x44').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回均衡器模式
        const eqMode = parseInt(document.getElementById('field-eq-mode-0x44').value, 16);
        return [eqMode];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x44').value, 10);
    }
}

// Register the command class globally
window.Command44 = Command44;
