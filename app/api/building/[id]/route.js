import executeQuery from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : req.headers.get("host") || "IP não encontrado";
  const sanitizedIp =
    ip.includes("127.0.0.1") ||
    ip.includes("191.9.24.165") ||
    ip.includes("::1")
      ? null
      : ip;

  try {
    const { id } = await context.params;
    const brokerId = process.env.NEXT_PUBLIC_BROKER_ID || "";

    // Query principal para o building
    const query = `
      SELECT 
          b.id AS building_id,
          b.name AS building_name,
          b.address AS building_address,
          b.priority AS building_priority,
          b.has_site AS building_has_site,
          p.title AS presentation_title,
          p.sub_title AS presentation_sub_title,
          p.image_url AS presentation_image_url,
          p.dark_color AS presentation_dark_color,
          p.dark_background_header AS presentation_dark_background_header,
          p.dark_background AS presentation_dark_background,
          p.has_page_background AS presentation_has_page_background,
          p.blueprint_image_tall AS presentation_blueprint_image_tall,
          p.font_name AS presentation_font_name,
          p.star_effect AS presentation_star_effect,
          bp.image_url AS blueprint_image,
          ph.file_name AS photo_file_name,
          fc.description AS facility_description,  
          fc.file_name AS facility_file_name,
          ph.description AS photo_description,  
          f.description AS feature_description,
          f.bold AS feature_bold
      FROM 
          building b
      LEFT JOIN 
          presentation p ON b.id = p.building_id
      LEFT JOIN 
          blueprint bp ON b.id = bp.building_id
      LEFT JOIN 
          photos ph ON b.id = ph.building_id
      LEFT JOIN 
          feature f ON b.id = f.building_id
      LEFT JOIN 
          facilities fc ON b.id = fc.building_id
      INNER JOIN 
          brokerxbuilding bx ON bx.building_id = b.id
      WHERE 
          b.id = ?
          AND b.active = 1
          AND bx.broker_id = ?
          AND bx.active = 1;
    `;

    const results = await executeQuery({
      query,
      values: [id, brokerId],
    });

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado encontrado." },
        { status: 404 },
      );
    }

    // Query adicional para lista de prédios
    const buildingListQuery = `
      SELECT 
          b.id AS building_id,
          b.name AS building_name,
          b.priority AS building_priority,
          b.has_site AS building_has_site,
          p.title AS presentation_title
      FROM 
          building b 
      LEFT JOIN 
          presentation p ON b.id = p.building_id
      INNER JOIN 
          brokerxbuilding bx ON bx.building_id = b.id
      WHERE 
          b.active = 1
          AND bx.broker_id = ?
          AND bx.active = 1;
    `;

    const buildingList = await executeQuery({
      query: buildingListQuery,
      values: [brokerId],
    });

    // Organizando os dados no formato esperado
    const building = {
      building_id: results[0].building_id,
      building_name: results[0].building_name,
      building_address: results[0].building_address,
      presentation_title: results[0].presentation_title,
      presentation_sub_title: results[0].presentation_sub_title,
      presentation_image_url: results[0].presentation_image_url,
      presentation_dark_color: results[0].presentation_dark_color,
      presentation_blueprint_image_tall:
        results[0].presentation_blueprint_image_tall,
      presentation_dark_background_header:
        results[0].presentation_dark_background_header,
      presentation_dark_background: results[0].presentation_dark_background,
      presentation_has_page_background:
        results[0].presentation_has_page_background,
      presentation_font_name: results[0].presentation_font_name,
      presentation_star_effect: results[0].presentation_star_effect,
      blueprint_images: [],
      photos: [],
      features: [],
      facilities: [],
    };

    const blueprintImagesSet = new Set();
    const photosSet = new Set();
    const featuresSet = new Set();
    const facilitiesSet = new Set();

    results.forEach((row) => {
      if (row.blueprint_image && !blueprintImagesSet.has(row.blueprint_image)) {
        blueprintImagesSet.add(row.blueprint_image);
        building.blueprint_images.push({
          file_name: row.blueprint_image,
        });
      }

      if (row.photo_file_name && !photosSet.has(row.photo_file_name)) {
        photosSet.add(row.photo_file_name);
        building.photos.push({
          file_name: row.photo_file_name,
          description: row.photo_description,
        });
      }

      if (
        row.facility_file_name &&
        !facilitiesSet.has(row.facility_file_name)
      ) {
        facilitiesSet.add(row.facility_file_name);
        building.facilities.push({
          file_name: row.facility_file_name,
          description: row.facility_description,
        });
      }

      if (
        row.feature_description &&
        !featuresSet.has(row.feature_description)
      ) {
        featuresSet.add(row.feature_description);
        building.features.push({
          feature_description: row.feature_description,
          feature_bold: row.feature_bold,
        });
      }
    });

    // Inserindo log na tabela accesslog
    if (sanitizedIp) {
      const logQuery = `INSERT INTO accesslog (building_id, ip_address) VALUES (?, ?);`;

      await executeQuery({
        query: logQuery,
        values: [id, sanitizedIp],
      });
    }

    // Adicionando a lista de prédios no retorno
    return NextResponse.json({
      building,
      buildingList,
    });
  } catch (error) {
    console.error("Erro ao buscar building:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao buscar os dados." },
      { status: 500 },
    );
  }
}
