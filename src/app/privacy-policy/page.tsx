import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introdução</h2>
          <p>
            Esta Política de Privacidade descreve como coletamos, usamos e
            compartilhamos suas informações pessoais quando você utiliza nossos
            serviços. Ao utilizar nossos serviços, você concorda com a coleta e
            uso de informações de acordo com esta política.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Informações que Coletamos
          </h2>
          <p>Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Informações de conta (nome, email, número de telefone)</li>
            <li>Informações de perfil</li>
            <li>Dados de uso e interação com nossos serviços</li>
            <li>Informações do dispositivo e conexão</li>
            <li>Cookies e tecnologias similares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Como Usamos suas Informações
          </h2>
          <p>Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Fornecer, manter e melhorar nossos serviços</li>
            <li>Processar suas transações</li>
            <li>Enviar comunicações relacionadas ao serviço</li>
            <li>Personalizar sua experiência</li>
            <li>Garantir a segurança de sua conta</li>
            <li>Desenvolver novos recursos e funcionalidades</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Compartilhamento de Informações
          </h2>
          <p>Podemos compartilhar suas informações com:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Provedores de serviços que nos auxiliam na operação</li>
            <li>Parceiros comerciais (com seu consentimento)</li>
            <li>Autoridades legais quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir informações imprecisas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Retirar seu consentimento</li>
            <li>Exportar seus dados</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Segurança</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para
            proteger suas informações pessoais. No entanto, nenhum método de
            transmissão pela Internet ou armazenamento eletrônico é 100% seguro.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Cookies e Tecnologias Similares
          </h2>
          <p>
            Utilizamos cookies e tecnologias similares para coletar informações
            sobre como você interage com nossos serviços. Você pode controlar o
            uso de cookies através das configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Alterações na Política
          </h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você
            sobre quaisquer alterações publicando a nova política nesta página e
            atualizando a data de &quot;última atualização&quot;.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta política ou sobre como tratamos
            suas informações pessoais, entre em contato conosco através do
            email: privacy@seudominio.com
          </p>
        </section>

        <footer className="mt-8 text-sm text-gray-500">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </footer>
      </div>
    </div>
  );
}
