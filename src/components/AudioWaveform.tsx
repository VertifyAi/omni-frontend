"use client";

import { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isRecording: boolean;
  stream: MediaStream | null;
}

export function AudioWaveform({ isRecording, stream }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);

  useEffect(() => {
    if (!stream || !isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Configurar Web Audio API
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 64; // Menor tamanho para mais responsividade
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Configurar estilo
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ef4444'); // Vermelho mais claro no topo
      gradient.addColorStop(0.7, '#dc2626'); // Vermelho médio
      gradient.addColorStop(1, '#b91c1c'); // Vermelho mais escuro na base
      
      ctx.fillStyle = gradient;
      
      // Desenhar barras
      const barCount = 50; // Mais barras para melhor visualização
      const barWidth = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        // Usar uma combinação de frequências baixas e médias para melhor visualização
        const dataIndex = Math.floor(i * (dataArray.length / barCount));
        let amplitude = dataArray[dataIndex] / 255;
        
        // Amplificar o sinal para melhor visualização
        amplitude = Math.pow(amplitude, 0.7) * 1.2;
        
        // Aplicar variação aleatória sutil para simular ruído natural
        amplitude += (Math.random() - 0.5) * 0.1;
        amplitude = Math.max(0, Math.min(1, amplitude));
        
        const barHeight = amplitude * canvas.height * 0.8; // 80% da altura máxima
        
        // Garantir altura mínima para mostrar atividade quando há som
        const minHeight = amplitude > 0.1 ? 6 : 2;
        const finalHeight = Math.max(barHeight, minHeight);
        
        // Desenhar barra centralizada verticalmente
        const x = i * barWidth + barWidth * 0.2; // Espaçamento entre barras
        const y = (canvas.height - finalHeight) / 2;
        const width = barWidth * 0.6; // Largura da barra
        
        // Cantos arredondados para as barras
        ctx.beginPath();
        const radius = Math.min(width / 4, 2); // Radius menor para melhor aparência
        
        // Desenhar retângulo com cantos arredondados manualmente
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + finalHeight - radius);
        ctx.quadraticCurveTo(x + width, y + finalHeight, x + width - radius, y + finalHeight);
        ctx.lineTo(x + radius, y + finalHeight);
        ctx.quadraticCurveTo(x, y + finalHeight, x, y + finalHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [stream, isRecording]);

  if (!isRecording) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={50}
        className="rounded-md"
        style={{ background: 'transparent' }}
      />
    </div>
  );
} 