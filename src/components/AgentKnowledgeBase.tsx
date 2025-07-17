import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function AgentKnowledgeBase() {
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const removePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
    toast.success("Arquivo removido");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handlePdfUpload(e.dataTransfer.files);
  };

  const handlePdfUpload = (files: FileList | null) => {
    if (!files) return;

    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== files.length) {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    // Verificar se algum arquivo é muito grande (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = pdfFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Arquivos devem ter no máximo 10MB");
      return;
    }

    setUploadedPdfs((prev) => [...prev, ...pdfFiles]);
    toast.success(`${pdfFiles.length} arquivo(s) PDF adicionado(s)`);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Base de Conhecimento
      </h2>
      <p className="text-muted-foreground mb-6 text-center">
        Faça upload de arquivos PDF para criar a base de conhecimento do agente
      </p>

      {/* Explicação sobre a base de conhecimento */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📚 Como funciona a Base de Conhecimento?
        </h3>
        <p className="text-blue-800 text-sm mb-4">
          Os arquivos PDF que você enviar serão processados e utilizados pelo
          agente de IA para responder perguntas dos clientes. Quanto melhor
          organizados os PDFs, mais precisas serão as respostas.
        </p>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            💡 Dicas para preparar seus PDFs:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Organize por tópicos:</strong> Crie um PDF para cada
              assunto (ex: &quot;FAQ Produto X&quot;, &quot;Manual de
              Instalação&quot;)
            </li>
            <li>
              • <strong>Use títulos claros:</strong> Estruture com títulos e
              subtítulos bem definidos
            </li>
            <li>
              • <strong>Seja específico:</strong> Inclua procedimentos passo a
              passo e respostas completas
            </li>
            <li>
              • <strong>Atualize regularmente:</strong> Mantenha as informações
              sempre atualizadas
            </li>
            <li>
              • <strong>Texto pesquisável:</strong> Certifique-se que o PDF não
              é apenas imagem
            </li>
          </ul>
        </div>
      </div>

      {/* Área de upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("pdf-upload-step3")?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Arraste e solte seus PDFs aqui
        </h3>
        <p className="text-gray-600 mb-4">ou clique para selecionar arquivos</p>

        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => handlePdfUpload(e.target.files)}
          className="hidden"
          id="pdf-upload-step3"
        />
        <p className="text-xs text-gray-500 mt-3">
          Formatos aceitos: PDF • Tamanho máximo: 10MB por arquivo
        </p>
      </div>

      {/* Lista de arquivos enviados */}
      {uploadedPdfs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Arquivos Enviados ({uploadedPdfs.length})
          </h3>

          <div className="space-y-3">
            {uploadedPdfs.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePdf(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedPdfs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground mt-6">
          <p>Nenhum arquivo PDF enviado ainda.</p>
          <p className="text-sm">
            Adicione pelo menos um PDF para criar a base de conhecimento.
          </p>
        </div>
      )}
    </div>
  );
}
