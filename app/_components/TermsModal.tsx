import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function TermsModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="ml-2 flex w-full flex-col items-center justify-center md:flex-row">
          <a className="ml-1 hover:text-orange-300">Termos de Uso.</a>
        </div>
      </DialogTrigger>
      <DialogContent className="dialog max-h-screen max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-3 text-2xl">
            Termos de Uso
          </DialogTitle>
        </DialogHeader>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-2 md:px-6">
          <span className="mb-4 text-sm">
            Bem-vindo ao nosso site. Ao acessar ou usar nosso serviço, você
            concorda com os seguintes Termos de Uso. Por favor, leia com
            atenção.
          </span>

          <h6 className="m-2 text-lg font-semibold">Coleta de Dados</h6>
          <span className="mb-4 text-sm">
            Nosso site utiliza o Google Analytics exclusivamente para fins de
            análise de tráfego e desempenho, com o objetivo de melhorar a
            experiência do usuário e otimizar nossa presença online para SEO.
          </span>
          <span className="mb-4 text-sm">
            As informações coletadas são anônimas e incluem, por exemplo, dados
            sobre páginas acessadas, tempo de navegação e origem do tráfego.
            Nenhuma informação pessoal identificável é coletada ou armazenada.
          </span>

          <h6 className="m-2 text-lg font-semibold">Uso do Serviço</h6>
          <span className="mb-4 text-sm">
            Você concorda em utilizar o serviço de maneira ética e respeitosa.
            Qualquer tentativa de interferir no funcionamento do site, ou de
            acessar informações não autorizadas, será considerada uma violação
            destes Termos.
          </span>

          <h6 className="m-2 text-lg font-semibold">Alterações nos Termos</h6>
          <span className="mb-4 text-sm">
            Reservamo-nos o direito de alterar estes Termos de Uso a qualquer
            momento, com ou sem aviso prévio. É sua responsabilidade revisá-los
            regularmente para se manter informado.
          </span>

          <h6 className="m-2 text-lg font-semibold">Entre em Contato</h6>
          <span className="mb-4 text-sm">
            Caso tenha dúvidas sobre estes Termos de Uso, entre em contato
            conosco através do email:
            <a
              href="mailto:salvadorfrisco70@gmail.com"
              className="text-blue-600 underline"
            >
              {" "}
              salvadorfrisco70@gmail.com
            </a>
            .
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
