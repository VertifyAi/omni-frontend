// import { verifySession } from "@/lib/dal";
// import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const session = await verifySession();
  // if (!session?.isAuth) {
  //   redirect("/sign-in");
  // }

  return <>{children}</>;
}
