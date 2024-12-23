import { createServerActionClient, User } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function NewPost({ user }: { user: User }) {
  const addPost = async (formData: FormData) => {
    "use server"
    const title = String(formData.get("title"));
    const strain = String(formData.get("strain"));
    const supabase = createServerActionClient<Database>({ cookies });

    await supabase.from("posts").insert({ title, strain, user_id: user.id});
  };

  return (
    <form className="border border-gray-800 border-t-0" action={addPost}>
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="User Image"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="strain"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
          placeholder="Strain"
        />
        <input
          name="title"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
          placeholder="Was it salty or what?"
        />
      </div>
      <input type="submit" className="bg-inherit border border-gray-800 rounded-lg"/>
    </form>
  );
}