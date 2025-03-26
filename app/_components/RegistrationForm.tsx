/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { saveLead } from "@/app/_services/leadService";
import MaskedInput from "react-text-mask";
import { toast } from "react-toastify";
import { PHONE_REGEX } from "../_lib/constants";
import { sendConfirmEmail } from "../_use_cases";

const RegistrationForm = ({ onClose }: { onClose: () => void }) => {
  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
  };
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Nome completo é obrigatório"),
    email: Yup.string().email("E-mail inválido"),
    phone: Yup.string()
      .required("Telefone obrigatório")
      .test({
        message: "Telefone inválido",
        test: (value) => !value || PHONE_REGEX.test(value),
      }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await saveLead(values);
      toast.info(
        "Cadastro realizado com sucesso, aguarde contato do corretor.",
      );
      // TODO: Corrigir o comportamento do fechamento da modal, pois não fecha de uma vez
      setTimeout(() => {
        onClose();
      }, 1000);
      await sendConfirmEmail(
        values.fullName,
        values.phone,
        values.email,
        "salvadorfrisco70@gmail.com",
      );
      setTimeout(() => {
        onClose();
      }, 1000);
      onClose();
    } catch (error: any) {
      // Verifica se o erro possui o status 400
      if (error.response && error.response.status === 400) {
        toast.warning("Cadastro já realizado anteriormente.");
      } else {
        toast.error("Erro ao realizar o cadastro. Tente novamente.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="rounded-lg border-2 border-slate-200 bg-slate-700 p-5 text-slate-200 shadow-lg">
        <h2 className="mb-4 flex items-center gap-5 whitespace-nowrap text-xl font-bold">
          <img
            src={`${imagePrefix}/logo_sonia_154L_t.png`}
            alt={"Logo Sonia da Cyrela"}
            width={120}
            height={60}
            className="max-h-[70px] object-contain sm:max-h-[80px] md:max-h-[90px]"
          />
          Fale com o Corretor
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-2">
            <div>
              <label>Nome Completo</label>
              <Field name="fullName" className="input" />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-sm text-yellow-300"
              />
            </div>
            <div>
              <label>Email</label>
              <Field name="email" className="input" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-yellow-300"
              />
            </div>
            <div>
              <label>Telefone</label>
              <Field name="phone">
                {({ field }: FieldProps) => (
                  <MaskedInput
                    {...field}
                    mask={[
                      "(",
                      /[1-9]/,
                      /\d/,
                      ")",
                      " ",
                      /[7-9]/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    className="input"
                  />
                )}
              </Field>
              <ErrorMessage
                name="phone"
                component="div"
                className="text-sm text-yellow-300"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button type="button" className="button" onClick={onClose}>
                Fechar
              </button>
              <button type="submit" className="button submit">
                Enviar
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationForm;
