import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewPost from "./new-post";
import Posts from "./posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("posts")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const posts =
    data?.map((post) => ({
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      user_has_liked_post: !!post.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: post.likes.length,
    })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewPost user={session.user}/>
      <Posts posts={posts} />
    </div>
  );
}