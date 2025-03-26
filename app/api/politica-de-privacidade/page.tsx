import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="mt-32 text-center text-3xl font-bold">
        Política de Privacidade
      </h1>
      <p className="text-center text-sm text-gray-400">
        Atualizado em 05/12/2024
      </p>
      <section className="space-y-4">
        <p className="text-foreground">
          Nós, da <strong>Abdala Corretora de Imóveis</strong>, estamos
          comprometidos em proteger sua privacidade e garantir que suas
          informações pessoais sejam tratadas com segurança e transparência.
          Esta Política de Privacidade explica como coletamos, utilizamos,
          armazenamos e protegemos seus dados pessoais ao utilizar nosso site e
          serviços relacionados à promoção e venda de imóveis.
        </p>

        <h2 className="text-xl font-semibold">1. Informações Coletadas</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>Informações de contato:</strong> Nome completo, e-mail,
            número de telefone, e endereço.
          </li>
          <li>
            <strong>Informações de navegação:</strong> Endereço IP, tipo de
            dispositivo, navegador utilizado, e dados de localização.
          </li>
          <li>
            <strong>Informações fornecidas voluntariamente:</strong> Dados
            preenchidos em formulários de contato, de cadastro ou para solicitar
            informações sobre imóveis, como preferências e faixa de preço.
          </li>
          <li>
            <strong>Informações de pagamento:</strong> Caso aplicável, dados de
            pagamento poderão ser coletados em transações.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">
          2. Finalidade do Tratamento de Dados
        </h2>
        <p>As informações coletadas são utilizadas para:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Entrar em contato com você para fornecer informações sobre os
            imóveis de seu interesse.
          </li>
          <li>Personalizar sua experiência em nosso site.</li>
          <li>
            Enviar comunicações relacionadas a ofertas, promoções ou informações
            relevantes sobre imóveis, com seu consentimento.
          </li>
          <li>Cumprir obrigações legais e regulatórias.</li>
          <li>Melhorar nossos serviços e funcionalidades do site.</li>
        </ul>

        <h2 className="text-xl font-semibold">
          3. Compartilhamento de Informações
        </h2>
        <p className="text-foreground">
          Não compartilhamos suas informações pessoais com terceiros, exceto:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Quando necessário para a prestação de serviços (por exemplo,
            corretores de imóveis ou empresas parceiras diretamente envolvidas
            na negociação).
          </li>
          <li>
            Para cumprir obrigações legais ou solicitações de autoridades
            regulatórias.
          </li>
          <li>Em caso de consentimento prévio para finalidades específicas.</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Segurança das Informações</h2>
        <p className="text-foreground">
          Adotamos medidas técnicas e organizacionais apropriadas para proteger
          seus dados pessoais contra acessos não autorizados, perda, divulgação
          ou destruição. No entanto, nenhum sistema é completamente seguro, e
          não podemos garantir segurança absoluta.
        </p>

        <h2 className="text-xl font-semibold">5. Seus Direitos</h2>
        <p className="text-foreground">Você tem o direito de:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Solicitar acesso às suas informações pessoais.</li>
          <li>Corrigir dados incorretos ou desatualizados.</li>
          <li>
            Solicitar a exclusão de seus dados, salvo quando a retenção for
            necessária para cumprir obrigações legais.
          </li>
          <li>Retirar seu consentimento, quando aplicável.</li>
        </ul>
        <p className="text-foreground">
          Entre em contato conosco pelo e-mail{" "}
          <strong>seuemail@exemplo.com</strong> para exercer seus direitos ou
          esclarecer dúvidas.
        </p>

        <h2 className="text-xl font-semibold">
          6. Cookies e Tecnologias de Rastreamento
        </h2>
        <p className="text-foreground">
          Utilizamos cookies para melhorar sua experiência de navegação,
          personalizar conteúdo e analisar o tráfego do site. Você pode
          gerenciar suas preferências de cookies diretamente no navegador.
        </p>

        <h2 className="text-xl font-semibold">7. Alterações nesta Política</h2>
        <p className="text-foreground">
          Reservamo-nos o direito de atualizar esta Política de Privacidade a
          qualquer momento. As alterações entrarão em vigor assim que publicadas
          em nosso site. Recomendamos que você revise esta página
          periodicamente.
        </p>

        <h2 className="text-xl font-semibold">8. Contato</h2>
        <p className="text-foreground">
          Em caso de dúvidas ou solicitações sobre esta Política de Privacidade,
          entre em contato pelo e-mail{" "}
          <strong>salvadorfrisco70@gmail.com</strong> ou telefone{" "}
          <strong>+55 11 97404-9668</strong>.
        </p>

        <p className="text-foreground">
          <strong>Abdala Corretora de Imóveis</strong>
          <br />
          <strong>Endereço:</strong> Rua Serra do Japi, 290 - Vila Gomes Cardim
          <br />
          São Paulo - SP - CEP 03309-000
          <br />
          <strong>CNPJ:</strong> 28.796.632/0001-22
        </p>
      </section>
    </main>
  );
}
