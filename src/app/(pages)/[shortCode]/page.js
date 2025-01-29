import { checkShortAndUpdateCount } from "@/actions/url/checkShortAndUpdateCount";
import { redirect } from "next/navigation";

export default async function ShortenUrl({ params }) {
  const { shortCode } = params;

  const hostName = process.env.NEXT_PUBLIC_HOSTNAME;
  const shortUrl = `${hostName}/${shortCode}`;

  const result = await checkShortAndUpdateCount(shortUrl);
  if (result?.success && result?.longUrl) {
    const longUrl = result.longUrl;
    redirect(longUrl); // Redirect to the long URL
  } else  {
    redirect("/");
  }

  return (
    <div className="flex  min-h-screen pt-[80px] bg-blue-50 justify-center text-3xl items-center">
      Redirecting...
    </div>
  );
}
