import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Termos de Uso</h1>
      <p className="mb-4">
        Bem-vindo ao nosso site. Ao acessar ou usar nosso serviço, você concorda
        com os seguintes Termos de Uso. Por favor, leia com atenção.
      </p>

      <h2 className="mb-2 text-2xl font-semibold">Coleta de Dados</h2>
      <p className="mb-4">
        Nosso site utiliza o Google Analytics exclusivamente para fins de
        análise de tráfego e desempenho, com o objetivo de melhorar a
        experiência do usuário e otimizar nossa presença online para SEO.
      </p>
      <p className="mb-4">
        As informações coletadas são anônimas e incluem, por exemplo, dados
        sobre páginas acessadas, tempo de navegação e origem do tráfego. Nenhuma
        informação pessoal identificável é coletada ou armazenada.
      </p>

      <h2 className="mb-2 text-2xl font-semibold">Uso do Serviço</h2>
      <p className="mb-4">
        Você concorda em utilizar o serviço de maneira ética e respeitosa.
        Qualquer tentativa de interferir no funcionamento do site, ou de acessar
        informações não autorizadas, será considerada uma violação destes
        Termos.
      </p>

      <h2 className="mb-2 text-2xl font-semibold">Alterações nos Termos</h2>
      <p className="mb-4">
        Reservamo-nos o direito de alterar estes Termos de Uso a qualquer
        momento, com ou sem aviso prévio. É sua responsabilidade revisá-los
        regularmente para se manter informado.
      </p>

      <h2 className="mb-2 text-2xl font-semibold">Entre em Contato</h2>
      <p>
        Caso tenha dúvidas sobre estes Termos de Uso, entre em contato conosco
        através do email:
        <a
          href="mailto:salvadorfrisco70@gmail.com"
          className="text-blue-600 underline"
        >
          {" "}
          salvadorfrisco70@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default Terms;
