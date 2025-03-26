import { fetchIpAddress } from "@/app/_services/getIpAddressService";

export async function getIpAddress() {
  const ipAddress = await fetchIpAddress();
  return ipAddress;
}
