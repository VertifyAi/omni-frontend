import React from "react";

export default function PrivacyPolicy() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("pt-BR", options);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade Vertify</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Introdução e Aceitação
          </h2>
          <p>
            Esta Política de Privacidade descreve como Vertify (&quot;nós&quot;, &quot;nosso&quot; ou &quot;a Empresa&quot;) coleta, usa,
            compartilha e protege suas informações pessoais quando você utiliza
            nossos serviços, especialmente aqueles que se integram com as
            plataformas e produtos da Meta Platforms, Inc. (incluindo, mas não
            se limitando, ao WhatsApp Business API, Facebook e Instagram).
          </p>
          <p className="mt-2">
            Ao utilizar nossos serviços, você concorda com a coleta e uso de
            informações de acordo com esta política, bem como com os Termos de
            Serviço da Meta e as Políticas de Plataforma aplicáveis. Caso não
            concorde com os termos desta política, por favor, não utilize nossos
            serviços.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Informações que Coletamos
          </h2>
          <p>
            Coletamos os seguintes tipos de informações, incluindo aquelas
            fornecidas por você e coletadas automaticamente, especialmente em
            função da sua interação com nossos serviços integrados à Meta:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              **Informações de Conta e Perfil:** Nome, endereço de e-mail,
              número de telefone, informações de contato do WhatsApp (se você se
              conectar através dele), e quaisquer outros dados que você forneça
              ao criar uma conta ou perfil conosco.
            </li>
            <li>
              **Informações de Mensagens e Conteúdo (apenas quando você interage
              via WhatsApp/Meta):** Quando você utiliza nossos serviços que se
              comunicam via WhatsApp Business API, podemos coletar o conteúdo
              das mensagens (texto, mídia) enviadas e recebidas para processar
              suas solicitações e fornecer o serviço. No entanto, **não
              acessamos, armazenamos ou utilizamos conversas ou dados de
              usuários do WhatsApp além do estritamente necessário para a
              funcionalidade do serviço e de acordo com as políticas do WhatsApp
              Business.**
            </li>
            <li>
              **Dados de Uso e Interação:** Informações sobre como você interage
              com nossos serviços, quais recursos você utiliza, tempo de sessão,
              páginas visualizadas, e interações com mensagens enviadas através
              de nossas integrações.
            </li>
            <li>
              **Informações do Dispositivo e Conexão:** Endereço IP, tipo de
              navegador, sistema operacional, identificadores únicos de
              dispositivo, dados da rede móvel.
            </li>
            <li>
              **Cookies e Tecnologias Similares:** Utilizamos cookies e
              tecnologias similares para coletar informações sobre como você
              interage com nossos serviços, melhorar a sua experiência, analisar
              tendências e administrar o site. Isso pode incluir cookies
              relacionados a serviços de terceiros, como o Facebook Pixel, para
              fins de publicidade e análise (se aplicável).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Como Usamos suas Informações
          </h2>
          <p>Utilizamos suas informações para os seguintes propósitos:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              **Fornecer e Manter Nossos Serviços:** Para operar, manter e
              aprimorar as funcionalidades de nossos serviços, incluindo a
              gestão de suas comunicações através do WhatsApp Business API.
            </li>
            <li>
              **Comunicação:** Para enviar notificações importantes,
              atualizações do serviço, e responder às suas perguntas e
              solicitações.
            </li>
            <li>
              **Personalização:** Para personalizar sua experiência e adaptar o
              conteúdo e as ofertas de acordo com suas preferências.
            </li>
            <li>
              **Segurança e Prevenção de Fraudes:** Para proteger a segurança de
              sua conta, nossos serviços e prevenir atividades fraudulentas ou
              não autorizadas.
            </li>
            <li>
              **Análise e Melhoria:** Para analisar o uso de nossos serviços,
              entender as tendências, e desenvolver novos recursos e
              funcionalidades.
            </li>
            <li>
              **Conformidade Legal:** Para cumprir com obrigações legais,
              regulatórias e as políticas da Meta Platforms, incluindo Termos de
              Serviço e Políticas de Plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Compartilhamento de Informações
          </h2>
          <p>Podemos compartilhar suas informações com:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              **Provedores de Serviços:** Terceiros que nos auxiliam na operação
              de nossos serviços, como hospedagem, análise de dados,
              processamento de pagamentos, e suporte ao cliente. Esses
              provedores são obrigados a proteger suas informações e utilizá-las
              apenas para os fins especificados por nós.
            </li>
            <li>
              **Meta Platforms, Inc. (e suas subsidiárias):** Compartilhamos
              informações necessárias para a integração e operação do WhatsApp
              Business API e outras ferramentas da Meta, estritamente de acordo
              com suas políticas e termos. Por exemplo, mensagens enviadas
              através do WhatsApp Business API são processadas pelos servidores
              do WhatsApp.
            </li>
            <li>
              **Parceiros Comerciais:** Com seu consentimento explícito, podemos
              compartilhar informações com parceiros comerciais para oferecer
              produtos ou serviços que acreditamos ser do seu interesse.
            </li>
            <li>
              **Autoridades Legais:** Quando exigido por lei, ordem judicial,
              processo legal, ou para proteger nossos direitos, propriedade ou
              segurança, ou a de nossos usuários e do público.
            </li>
            <li>
              **Transações Empresariais:** Em caso de fusão, aquisição, venda de
              ativos, ou outra transação empresarial, suas informações podem ser
              transferidas como parte dos ativos.
            </li>
          </ul>
          <p className="mt-2">
            **Não vendemos, alugamos ou trocamos suas informações pessoais com
            terceiros para fins de marketing direto.**
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Seus Direitos de Privacidade
          </h2>
          <p>
            Você tem os seguintes direitos em relação às suas informações
            pessoais, de acordo com a legislação aplicável:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              **Acesso e Retificação:** Acessar, revisar e solicitar a correção
              de suas informações pessoais que mantemos.
            </li>
            <li>
              **Exclusão (&quot;Direito ao Esquecimento&quot;):** Solicitar a exclusão de
              seus dados pessoais, sujeito a certas exceções legais.
            </li>
            <li>
              **Retirada de Consentimento:** Retirar seu consentimento a
              qualquer momento para o processamento de dados baseado em
              consentimento prévio. Isso não afetará a legalidade do
              processamento realizado antes da retirada.
            </li>
            <li>
              **Portabilidade de Dados:** Receber uma cópia de seus dados
              pessoais em um formato estruturado, de uso comum e legível por
              máquina.
            </li>
            <li>
              **Oposição:** Opor-se ao processamento de seus dados pessoais em
              certas circunstâncias.
            </li>
            <li>
              **Reclamação:** Apresentar uma reclamação junto à autoridade de
              proteção de dados competente se você acredita que seus direitos
              foram violados.
            </li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer um desses direitos, por favor, entre em
            contato conosco através do e-mail fornecido na seção &quot;Contato&quot; desta
            política.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Segurança dos Dados
          </h2>
          <p>
            Implementamos medidas de segurança técnicas, administrativas e
            organizacionais apropriadas para proteger suas informações pessoais
            contra acesso não autorizado, alteração, divulgação ou destruição.
            No entanto, nenhum método de transmissão pela Internet ou
            armazenamento eletrônico é 100% seguro. Embora nos esforcemos para
            proteger suas informações, não podemos garantir sua segurança
            absoluta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Cookies e Tecnologias Similares
          </h2>
          <p>
            Utilizamos cookies e tecnologias similares para coletar informações
            sobre como você interage com nossos serviços, lembrar suas
            preferências, e para fins de análise e publicidade. Isso nos ajuda a
            melhorar a funcionalidade do nosso site e a sua experiência. Você
            pode controlar o uso de cookies através das configurações do seu
            navegador. Ao continuar a usar nossos serviços, você concorda com o
            uso de cookies conforme descrito nesta política.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Links para Sites de Terceiros
          </h2>
          <p>
            Nossos serviços podem conter links para sites ou serviços de
            terceiros que não são operados por nós. Esta Política de Privacidade
            não se aplica a esses sites ou serviços. Recomendamos que você
            revise as políticas de privacidade de quaisquer sites de terceiros
            que você visitar.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            9. Alterações na Política de Privacidade
          </h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente para
            refletir mudanças em nossas práticas de informação. Notificaremos
            você sobre quaisquer alterações significativas publicando a nova
            política nesta página e atualizando a data de &quot;Última atualização&quot;.
            Aconselhamos que você revise esta política periodicamente para se
            manter informado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contato</h2>
          <p>
            Se você tiver dúvidas, comentários ou preocupações sobre esta
            Política de Privacidade ou sobre como tratamos suas informações
            pessoais, entre em contato conosco através do email: **joaoperetti@vertify.com.br** ou através
            do nosso site em: **https://vertify.com.br/**.
          </p>
        </section>

        <footer className="mt-8 text-sm text-gray-500">
          <p>Última atualização: {formattedDate}</p>
        </footer>
      </div>
    </div>
  );
}
