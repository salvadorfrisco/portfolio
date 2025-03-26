// export const CLIENT_NAME = "psr";
// export const BG_HEADER_COLOR = "bg-blue-300";
// export const BG_BUTTON_COLOR = "bg-blue-900";
// export const BG_BUTTON_COLOR_HOVER = "hover:bg-blue-800";
// export const TITLE_COLOR = "text-blue-700";
// export const DARK_TITLE_COLOR = "dark:text-cyan-500";
// export const BORDER_COLOR = "border-blue-200";
// export const COMMISSION_PERCENTUAL = 0;

export const CLIENT_NAME = "asmat";
export const BG_HEADER_COLOR = "bg-slate-700";
export const BG_BUTTON_COLOR = "bg-red-600";
export const BG_BUTTON_COLOR_HOVER = "hover:bg-red-500";
export const TITLE_COLOR = "text-red-600";
export const DARK_TITLE_COLOR = "dark:text-cyan-500";
export const BORDER_COLOR = "border-red-100";
export const COMMISSION_PERCENTUAL = 0;

// export const CLIENT_NAME = "coopliber";
// export const BG_HEADER_COLOR = "bg-white";
// export const BG_BUTTON_COLOR = "bg-red-900";
// export const BG_BUTTON_COLOR_HOVER = "hover:bg-red-800";
// export const TITLE_COLOR = "text-red-700";
// export const DARK_TITLE_COLOR = "dark:text-red-500";
// export const BORDER_COLOR = "border-red-200";
// export const COMMISSION_PERCENTUAL = 10;

export const BG_BUTTON_DISABLED = "bg-gray-500";

export const INITIAL_VALUES = {
  id: "",
  vehicleKind: 3,
  markId: 0,
  modelId: 0,
  markName: "",
  modelName: "",
  zipCode: "",
  vehicleValue: 0,
  levelBodilyHarm: 1,
  levelAssistance: 1,
  levelPropertyDamage: 1,
  levelReservationCar: 1,
  glasses: false,
  theft: false,
  tracker: false,
  appDeath: false,
  appInvalidity: false,
  appDmho: false,
  appFuneral: false,
  name: "",
  phoneNumber: "",
  email: "",
  billing_kind: "pix",
  document_kind: "cpf",
  identification: "",
  zipCodeBilling: "",
  streetBilling: "",
  streetNumberBilling: "",
  streetComplementBilling: "",
  neighborhoodBilling: "",
  stateBilling: "",
  cityBilling: "",
  fipe_interval_id: 0,
  minimal_contribution: 0,
  adm_expenses_premium_value: 0,
  banking_expenses_premium_value: 0,
  apportionment_expenses_premium_value: 0,
  theft_expenses_premium_value: 0,
  tracker_premium_value: 0,
  glasses_expenses_premium_value: 0,
  tax_value: 0,
  premiumPropertyDamage: 0,
  premiumBodilyHarm: 0,
  premiumAssistance: 0,
  premiumReservationCar: 0,
  app_death_value: 0,
  app_invalidity_value: 0,
  app_dmho_value: 0,
  app_funeral_value: 0,
  monthlyPaymentValue: 0,
  ipAddress: "",
};

export const VEHICLE_OPTIONS = [
  { label: "Carro", value: 1 },
  { label: "SUV/Caminhonete", value: 2 },
  { label: "Moto", value: 3 },
];

export const BILLING_KIND_OPTIONS = [
  { label: "PIX", value: "pix" },
  { label: "Boleto", value: "boleto" },
];

export const DOCUMENT_KIND_OPTIONS = [
  { label: "CPF", value: "cpf" },
  { label: "CNPJ", value: "cnpj" },
];

export const PHONE_REGEX =
  /^(\(?[1-9]{2}\)?) ?((?:[2-8]|9[1-9])[0-9]{3}-?)([0-9]{4})/;

export const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const STATES_OPTIONS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];
