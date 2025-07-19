export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

import {
  GET as baseGET,
  POST as basePOST,
  PUT as basePUT,
  DELETE as baseDELETE,
  PATCH as basePATCH,
} from "../../infrastructure/controllers/UserController";

import { NextRequest, NextResponse } from "next/server";

function withCORS(
  handler: (req: NextRequest) => Promise<Response | undefined>,
) {
  return async (req: NextRequest) => {
    const response =
      (await handler(req)) ??
      new NextResponse(JSON.stringify({ error: "Erro interno do servidor" }), {
        status: 500,
      });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return response;
  };
}

export const GET = withCORS(baseGET);
export const POST = withCORS(basePOST);
export const PUT = withCORS(basePUT);
export const DELETE = withCORS(baseDELETE);
export const PATCH = withCORS(basePATCH);
