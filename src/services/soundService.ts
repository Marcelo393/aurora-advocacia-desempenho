
class SoundService {
  private audioContext: AudioContext | null = null;
  private soundEnabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext não suportado:', error);
    }
  }

  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.audioContext || !this.soundEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }

  async playClickSound() {
    // Som satisfatório tipo PlayStation notification - grave e satisfatório
    await this.playTone(440, 0.25, 'sine', 0.15);
  }

  async playTransition() {
    // Som de transição suave
    await this.playTone(600, 0.2, 'sine', 0.1);
  }

  async playSuccessSound() {
    if (!this.soundEnabled) return;
    
    // Som épico de finalização tipo "achievement unlocked"
    const notes = [
      { freq: 523, time: 0 },     // C
      { freq: 659, time: 150 },   // E
      { freq: 784, time: 300 },   // G
      { freq: 1047, time: 450 }   // C oitava
    ];
    
    notes.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, 0.4, 'sine', 0.2);
      }, note.time);
    });

    // Adiciona um acorde final épico
    setTimeout(() => {
      this.playTone(523, 0.8, 'sine', 0.15);
      this.playTone(659, 0.8, 'sine', 0.15);
      this.playTone(784, 0.8, 'sine', 0.15);
    }, 600);
  }

  async playProgressSound() {
    // Som satisfatório de progresso - PlayStation style
    await this.playTone(600, 0.2, 'sine', 0.12);
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }
}

export const soundService = new SoundService();
