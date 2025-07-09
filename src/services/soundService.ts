
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

  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.soundEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }

  async playClickSound() {
    await this.playTone(800, 0.1, 'square');
  }

  async playSuccessSound() {
    if (!this.soundEnabled) return;
    
    // Sequência de notas ascendentes para som de sucesso
    const notes = [523, 659, 784, 1047]; // C, E, G, C (oitava)
    
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.2, 'sine');
      }, i * 100);
    }
  }

  async playProgressSound() {
    await this.playTone(600, 0.15, 'triangle');
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }
}

export const soundService = new SoundService();
