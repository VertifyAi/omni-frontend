import { NextRequest, NextResponse } from "next/server";
import { FacebookAdsApi, Business } from "facebook-nodejs-business-sdk";

const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN as string;
const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET as string;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI as string;

const api = new FacebookAdsApi(ACCESS_TOKEN);
FacebookAdsApi.init(ACCESS_TOKEN);

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  try {
    const response = await api.call("GET", "/oauth/access_token", {
      client_id: APP_ID,
      client_secret: APP_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const accessToken = response.data.access_token;

    const business = await new Business("<BUSINESS_ID>").read([], {
      access_token: accessToken,
    });

    return NextResponse.json({ accessToken, business }, { status: 200 });
  } catch (error) {
    console.error("Erro ao conectar com a API do Facebook:", error);
    return NextResponse.json({ error: "Erro ao conectar com a API do Facebook." }, { status: 500 });
  }
}
