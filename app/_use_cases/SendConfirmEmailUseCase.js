import { sendMail } from "@/app/_lib/send-mail";

export async function sendConfirmEmail(name, phone, email, sendTo) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const logoUrl = `${baseUrl}/logo_sonia_154L_t.png`;

    const mailHtml = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <img src="${logoUrl}" alt="Logo" style="width: 150px; margin-bottom: 20px;">
      <p style="font-weight: bold">Olá!</p>
      <p>Segue um novo cadastro para verificação</p>
      <p>${name}</p>
      <p>${phone}</p>
      <p>${email}</p>
    </div>
  `;

    await sendMail({
      email: "comercial@psrtech.com.br",
      sendTo: sendTo,
      subject: "[Imóveis] Novo cadastro",
      html: mailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
}
